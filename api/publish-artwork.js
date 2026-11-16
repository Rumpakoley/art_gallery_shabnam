/**
 * Vercel Serverless Function: Automated GitHub Publisher for Studio Artworks
 * Commits uploaded artwork images and metadata directly to GitHub repo.
 * Supports single publish, batch sync, and delete actions.
 * Triggers automated live Vercel deployments in ~30-45 seconds without developer intervention.
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { adminPassword, artwork, artworks, imageBase64, action = 'publish' } = req.body || {};

    // 1. Password verification
    const validPasswords = ['morphiq@2026', 'dev@morphiq'];
    if (!adminPassword || !validPasswords.includes(adminPassword.trim())) {
      return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials.' });
    }

    // 2. GitHub Token check & sanitization
    let cleanToken = (process.env.GITHUB_TOKEN || '')
      .trim()
      .replace(/^["'`]|["'`]$/g, '')
      .trim();

    if (cleanToken.toLowerCase().startsWith('bearer ')) {
      cleanToken = cleanToken.slice(7).trim();
    } else if (cleanToken.toLowerCase().startsWith('token ')) {
      cleanToken = cleanToken.slice(6).trim();
    }

    if (!cleanToken) {
      return res.status(500).json({
        error: 'GITHUB_TOKEN environment variable is not configured or empty in Vercel settings.',
        details: 'Please add a valid GITHUB_TOKEN in your Vercel Project Settings > Environment Variables.'
      });
    }

    const owner = 'Rumpakoley';
    const repo = 'art_gallery_shabnam';
    const branch = 'main';

    // GitHub Classic PATs (ghp_...) use 'token <PAT>', Fine-grained PATs use 'Bearer <PAT>'
    const isClassicPat = cleanToken.startsWith('ghp_');
    const primaryAuth = isClassicPat ? `token ${cleanToken}` : `Bearer ${cleanToken}`;
    const fallbackAuth = isClassicPat ? `Bearer ${cleanToken}` : `token ${cleanToken}`;

    // Helper for GitHub API calls with automatic auth-header retry
    async function ghFetch(url, options = {}) {
      const call = async (auth) => {
        return fetch(`https://api.github.com${url}`, {
          ...options,
          headers: {
            'Authorization': auth,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'TheMorphiq-Studio-Publisher',
            ...(options.headers || {})
          }
        });
      };

      let response = await call(primaryAuth);
      
      // If 401, retry with alternative header format
      if (response.status === 401) {
        console.warn(`Primary auth format failed with 401. Retrying with fallback header for ${url}...`);
        const fallbackResponse = await call(fallbackAuth);
        if (fallbackResponse.ok) {
          return fallbackResponse.json();
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        const masked = cleanToken.length > 8 ? `${cleanToken.slice(0, 4)}...${cleanToken.slice(-4)}` : 'too-short';
        throw new Error(`GitHub API Error (${response.status}) on ${url}: ${errorText} [Token prefix: "${cleanToken.slice(0, 4)}", length: ${cleanToken.length}, masked: "${masked}"]`);
      }
      return response.json();
    }

    // 3. Get latest commit SHA on main
    const refData = await ghFetch(`/repos/${owner}/${repo}/git/ref/heads/${branch}`);
    const latestCommitSha = refData.object.sha;

    // Get commit details to find root tree SHA
    const commitData = await ghFetch(`/repos/${owner}/${repo}/git/commits/${latestCommitSha}`);
    const baseTreeSha = commitData.tree.sha;

    // 4. Fetch current src/custom_paintings.json if it exists
    let existingPaintings = [];
    try {
      const fileData = await ghFetch(`/repos/${owner}/${repo}/contents/src/custom_paintings.json?ref=${branch}`);
      if (fileData && fileData.content) {
        const decoded = Buffer.from(fileData.content, 'base64').toString('utf8');
        existingPaintings = JSON.parse(decoded);
      }
    } catch (e) {
      existingPaintings = [];
    }

    const treeItems = [];

    if (action === 'delete') {
      const targetId = artwork?.id;
      if (!targetId) {
        return res.status(400).json({ error: 'Artwork ID is required for deletion.' });
      }
      existingPaintings = existingPaintings.filter(p => p.id !== targetId);
      
      const jsonBlob = await ghFetch(`/repos/${owner}/${repo}/git/blobs`, {
        method: 'POST',
        body: JSON.stringify({
          content: Buffer.from(JSON.stringify(existingPaintings, null, 2), 'utf8').toString('base64'),
          encoding: 'base64'
        })
      });

      treeItems.push({
        path: 'src/custom_paintings.json',
        mode: '100644',
        type: 'blob',
        sha: jsonBlob.sha
      });
    } else if (action === 'batch_sync' && Array.isArray(artworks)) {
      // BATCH SYNC: publish multiple artworks at once
      for (const item of artworks) {
        if (!item || !item.title) continue;
        const artworkId = item.id || `painting-custom-${Date.now()}`;
        let finalImageUrl = item.imageUrl;

        // If artwork has Base64 image
        if (item.imageUrl && item.imageUrl.startsWith('data:image/')) {
          const cleanBase64 = item.imageUrl.replace(/^data:image\/\w+;base64,/, '');
          const imageBlob = await ghFetch(`/repos/${owner}/${repo}/git/blobs`, {
            method: 'POST',
            body: JSON.stringify({
              content: cleanBase64,
              encoding: 'base64'
            })
          });

          const imagePath = `public/artworks/${artworkId}.jpg`;
          treeItems.push({
            path: imagePath,
            mode: '100644',
            type: 'blob',
            sha: imageBlob.sha
          });

          finalImageUrl = `/artworks/${artworkId}.jpg`;
        }

        const formatted = {
          ...item,
          id: artworkId,
          imageUrl: finalImageUrl,
          createdAt: item.createdAt || new Date().toISOString()
        };

        const existingIdx = existingPaintings.findIndex(p => p.id === artworkId || p.title?.toLowerCase() === item.title?.toLowerCase());
        if (existingIdx >= 0) {
          existingPaintings[existingIdx] = formatted;
        } else {
          existingPaintings.unshift(formatted);
        }
      }

      const jsonBlob = await ghFetch(`/repos/${owner}/${repo}/git/blobs`, {
        method: 'POST',
        body: JSON.stringify({
          content: Buffer.from(JSON.stringify(existingPaintings, null, 2), 'utf8').toString('base64'),
          encoding: 'base64'
        })
      });

      treeItems.push({
        path: 'src/custom_paintings.json',
        mode: '100644',
        type: 'blob',
        sha: jsonBlob.sha
      });
    } else {
      // SINGLE PUBLISH ACTION
      if (!artwork || !artwork.title) {
        return res.status(400).json({ error: 'Artwork metadata with title is required.' });
      }

      const artworkId = artwork.id || `painting-custom-${Date.now()}`;
      let finalImageUrl = artwork.imageUrl;

      if (imageBase64 || (artwork.imageUrl && artwork.imageUrl.startsWith('data:image/'))) {
        const rawBase64 = imageBase64 || artwork.imageUrl;
        const cleanBase64 = rawBase64.replace(/^data:image\/\w+;base64,/, '');
        const imageBlob = await ghFetch(`/repos/${owner}/${repo}/git/blobs`, {
          method: 'POST',
          body: JSON.stringify({
            content: cleanBase64,
            encoding: 'base64'
          })
        });

        const imagePath = `public/artworks/${artworkId}.jpg`;
        treeItems.push({
          path: imagePath,
          mode: '100644',
          type: 'blob',
          sha: imageBlob.sha
        });

        finalImageUrl = `/artworks/${artworkId}.jpg`;
      }

      const newPainting = {
        ...artwork,
        id: artworkId,
        imageUrl: finalImageUrl,
        createdAt: artwork.createdAt || new Date().toISOString()
      };

      const existingIdx = existingPaintings.findIndex(p => p.id === artworkId || p.title?.toLowerCase().trim() === artwork.title?.toLowerCase().trim());
      if (existingIdx >= 0) {
        existingPaintings[existingIdx] = {
          ...existingPaintings[existingIdx],
          ...newPainting,
          imageUrl: finalImageUrl || existingPaintings[existingIdx].imageUrl
        };
      } else {
        existingPaintings.unshift(newPainting);
      }

      const jsonBlob = await ghFetch(`/repos/${owner}/${repo}/git/blobs`, {
        method: 'POST',
        body: JSON.stringify({
          content: Buffer.from(JSON.stringify(existingPaintings, null, 2), 'utf8').toString('base64'),
          encoding: 'base64'
        })
      });

      treeItems.push({
        path: 'src/custom_paintings.json',
        mode: '100644',
        type: 'blob',
        sha: jsonBlob.sha
      });
    }

    if (treeItems.length === 0) {
      return res.status(400).json({ error: 'No changes to commit.' });
    }

    // 5. Create new tree
    const newTree = await ghFetch(`/repos/${owner}/${repo}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeItems
      })
    });

    // 6. Create commit
    const isUpdateAction = action === 'update' || (artwork && existingPaintings.some(p => p.id === artwork.id));
    const commitMessage = action === 'delete'
      ? `Delete artwork: ${artwork?.title || artwork?.id} [Studio Admin]`
      : action === 'batch_sync'
      ? `Sync batch of ${artworks?.length || 0} artworks [Studio Admin]`
      : isUpdateAction
      ? `Update artwork: "${artwork.title}" [Studio Admin]`
      : `Publish artwork: "${artwork.title}" [Studio Admin]`;

    const newCommit = await ghFetch(`/repos/${owner}/${repo}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({
        message: commitMessage,
        tree: newTree.sha,
        parents: [latestCommitSha]
      })
    });

    // 7. Update branch ref
    await ghFetch(`/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
      method: 'PATCH',
      body: JSON.stringify({
        sha: newCommit.sha,
        force: false
      })
    });

    return res.status(200).json({
      success: true,
      commitSha: newCommit.sha,
      message: `Artwork(s) successfully committed to GitHub! Vercel is now deploying your changes live across all devices.`
    });

  } catch (error) {
    console.error('Publisher API Error:', error);
    return res.status(500).json({
      error: 'Failed to publish artwork to GitHub.',
      details: error.message
    });
  }
}
