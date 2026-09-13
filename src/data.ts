/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Painting, ArtistProfile } from './types';

import oilCoastalCliff from './assets/images/oil_coastal_cliff.jpg';
import watercolorForest from './assets/images/watercolor_forest.jpg';
import abstractAcrylic from './assets/images/abstract_acrylic.jpg';
import stillLifePears from './assets/images/still_life_pears.jpg';
import artistPortrait from './assets/images/artist_portrait.jpg';
import painting5 from './assets/images/painting_5.jpg';
import painting6 from './assets/images/painting_6.jpg';
import painting7 from './assets/images/painting_7.jpg';
import painting8 from './assets/images/painting_8.jpg';
import painting9 from './assets/images/painting_9.jpg';

export const INITIAL_VIDEOS: StudioVideo[] = [
  {
    id: "video-1",
    title: "Intuitive Ink Movements & Silence",
    description: "Watch studio process reel on Instagram @themorphiq",
    videoUrl: "https://www.instagram.com/reel/Dbk3BGyvJpp/",
    posterUrl: "https://res.cloudinary.com/dpdtsaalf/image/upload/v1787910634/WhatsApp_Image_2026-08-27_at_9.05.33_PM_vwnozh.jpg"
  },
  {
    id: "video-2",
    title: "Pigment & Texture Layering",
    description: "Watch studio process reel on Instagram @themorphiq",
    videoUrl: "https://www.instagram.com/reel/DW8QqW-DOoh/",
    posterUrl: "https://res.cloudinary.com/dpdtsaalf/image/upload/v1787910634/WhatsApp_Image_2026-08-27_at_9.05.34_PM_o4wuaw.jpg"
  },
  {
    id: "video-3",
    title: "Canvas Transformation Live",
    description: "Watch studio process reel on Instagram @themorphiq",
    videoUrl: "https://www.instagram.com/reel/DI1qHlQya0n/",
    posterUrl: "https://res.cloudinary.com/dpdtsaalf/image/upload/v1787910633/WhatsApp_Image_2026-08-27_at_9.05.41_PM_yn2qrs.jpg"
  },
  {
    id: "video-4",
    title: "Surreal Form Explorations",
    description: "Watch studio process reel on Instagram @themorphiq",
    videoUrl: "https://www.instagram.com/reel/DLh8hidyFbH/",
    posterUrl: "https://res.cloudinary.com/dpdtsaalf/image/upload/v1787911568/WhatsApp_Image_2026-08-27_at_9.05.39_PM_pkg6ne.jpg"
  },
  {
    id: "video-5",
    title: "Freehand Line Drawings",
    description: "Watch studio process reel on Instagram @themorphiq",
    videoUrl: "https://www.instagram.com/reel/DXJh8FMjOri/",
    posterUrl: "https://res.cloudinary.com/dpdtsaalf/image/upload/v1787914652/WhatsApp_Image_2026-08-27_at_9.05.37_PM_uzmoyt.jpg"
  },
  {
    id: "video-6",
    title: "Studio Reflections & Color Flow",
    description: "Watch studio process reel on Instagram @themorphiq",
    videoUrl: "https://www.instagram.com/reel/DH1CX8xS6P9/",
    posterUrl: "https://res.cloudinary.com/dpdtsaalf/image/upload/v1787914651/WhatsApp_Image_2026-08-27_at_9.05.36_PM_diijeh.jpg"
  }
];

export const INITIAL_PROFILE: ArtistProfile = {
  name: "Husne Shabnam",
  title: "Visual Artist",
  bio: "I am a surrealist abstract artist.\n\nI do not sketch before I begin.\nI do not plan what will emerge.\nI do not start with a destination.\n\nMy work arrives as a conversation with the unknown. Every line, form, and texture appears through intuition rather than intention. I often discover the artwork at the same time as the viewer. The process feels less like creating and more like receiving—a message, a memory, a symbol, or a fragment from a place beyond language.\n\nMy hand moves freely, but something deeper guides it. The worlds that emerge in my work are surreal, abstract, and open-ended. They are not meant to provide answers. They are invitations into reflection.\n\nIn a time that demands speed, certainty, and immediate understanding, my art asks for something different:\nPause.\nSilence.\nPatience.\n\nMany of my works reveal themselves slowly. They are not designed to be consumed in a glance. They ask the viewer to stay, to observe, and to listen.\n\nBecause art speaks differently to every person. What you see is often a reflection of what already exists within you:\nA shape that feels familiar.\nA forgotten memory.\nA hidden fear.\nA longing.\nA dream.\nA question.\n\nThe same artwork may tell entirely different stories to different people, because each viewer brings their own subconscious to the encounter.\n\nI believe that art is not complete when it leaves the artist’s hand. It becomes complete when it meets the inner world of another human being.\n\nThis website is a home for those conversations. A collection of messages from the unknown, waiting to find their meaning in you.",
  statement: "If you find yourself here, take your time.\nLook closely.\nLook slowly.\nAllow the work to speak in its own language.\n\nAnd if a piece reminds you of a forgotten memory, an unfinished dream, a place you’ve never been, or a version of yourself you haven’t met yet, then the artwork has already fulfilled its purpose.\n\nWelcome to my world.\n— Husne Shabnam",
  avatarUrl: artistPortrait,
  instagram: "@themorphiq",
  email: "husneshabnam.connect@gmail.com",
};

export const INITIAL_PAINTINGS: Painting[] = [
  {
    id: "painting-1",
    title: "Crashing Tides at Cape Meares",
    medium: "Ink & Acrylic on Canvas",
    category: "Landscape",
    year: 2025,
    dimensions: "24 x 36 inches",
    description: "An expressive coastal study catching the late afternoon sun breaking through heavy clouds. Modeled with dynamic brushstrokes representing the violent and gorgeous action of the surf against the basalt column cliffs.",
    imageUrl: oilCoastalCliff,
    price: 3400,
    status: "Available",
    collection: "Fossils of a Drifting Mind",
    createdAt: "2025-10-15T12:00:00Z"
  },
  {
    id: "painting-2",
    title: "Misty Birches in November",
    medium: "Fine Line Pen & Ink on Paper",
    category: "Landscape",
    year: 2026,
    dimensions: "18 x 24 inches",
    description: "A soft, quiet ink & pen composition exploring negative space, bleeding atmospheric mist, and the stark linear elegance of silver birch trees in late autumn. Perfect for capturing stillness.",
    imageUrl: watercolorForest,
    price: 1800,
    status: "Available",
    collection: "The Ones I Carry",
    createdAt: "2026-02-12T14:30:00Z"
  },
  {
    id: "painting-3",
    title: "Ochre & Charcoal Dialogue No. 5",
    medium: "Acrylic & Mixed Media on Wood Panel",
    category: "Abstract",
    year: 2026,
    dimensions: "40 x 40 inches",
    description: "An expressive abstract piece using highly-textured heavy body acrylic sweeps. Contrasts deep navy and carbon overlays with warm golden ochres and delicate hand-veined gold leafing, reflecting mental landscapes of shadow and hope.",
    imageUrl: abstractAcrylic,
    price: 4200,
    status: "Available",
    collection: "Fossils of a Drifting Mind",
    createdAt: "2026-04-05T09:15:00Z"
  },
  {
    id: "painting-4",
    title: "Studio Still Life with Pears",
    medium: "Pen & Ink on Archival Paper",
    category: "Still Life",
    year: 2025,
    dimensions: "12 x 16 inches",
    description: "A delicate pen and ink realism study in light and shade. Focuses on subtle hatch textures and variations on ripe Bartlett pears situated in a hand-thrown ceramic bowl.",
    imageUrl: stillLifePears,
    price: 1200,
    status: "Available",
    collection: "The Ones I Carry",
    createdAt: "2025-12-01T16:45:00Z"
  },
  {
    id: "painting-5",
    title: "Whispers of the Subconscious",
    medium: "Ink & Fine Pen on Paper",
    category: "Abstract",
    year: 2026,
    dimensions: "18 x 24 inches",
    description: "An intricate monochrome drawing created through pure intuitive hand movements. Soft ink textures morph into open-ended questions and familiar shapes.",
    imageUrl: painting5,
    price: 1600,
    status: "Available",
    collection: "Whispers of the Subconscious",
    createdAt: "2026-05-10T10:00:00Z"
  },
  {
    id: "painting-6",
    title: "Transformations of Silence",
    medium: "Acrylic & Gold Leaf on Wood Panel",
    category: "Abstract",
    year: 2026,
    dimensions: "30 x 40 inches",
    description: "Atmospheric, deep sweeps of color overlaying delicate gold veining. Evolved freely without prior sketches, inviting the viewer into quiet reflection.",
    imageUrl: painting6,
    price: 3400,
    status: "Available",
    collection: "Whispers of the Subconscious",
    createdAt: "2026-05-20T11:30:00Z"
  },
  {
    id: "painting-7",
    title: "A Conversation with the Unknown",
    medium: "Pen & Ink on Paper",
    category: "Abstract",
    year: 2026,
    dimensions: "36 x 36 inches",
    description: "Layers of dense pigments intersecting with free-form pen lines. A visual representation of the unseen process through which raw emotion takes shape.",
    imageUrl: painting7,
    price: 4500,
    status: "Available",
    collection: "The Ones I Carry",
    createdAt: "2026-05-28T15:45:00Z"
  },
  {
    id: "painting-8",
    title: "Echoes of the Unseen",
    medium: "Acrylic & Ink on Canvas",
    category: "Abstract",
    year: 2026,
    dimensions: "30 x 30 inches",
    description: "An exploration of negative space and fluid transitions. Bold shapes overlay delicate ink details, representing the dialogue between what is hidden and what is revealed.",
    imageUrl: painting8,
    price: 3800,
    status: "Available",
    collection: "Fossils of a Drifting Mind",
    createdAt: "2026-05-30T09:00:00Z"
  },
  {
    id: "painting-9",
    title: "The Silent Watchers",
    medium: "Acrylic, Pen & Ink on Canvas",
    category: "Abstract",
    year: 2026,
    dimensions: "24 x 30 inches",
    description: "Surreal crimson figures and watchful eye motifs rising from geometric patterns against deep forest green—a contemplative visual dialogue on consciousness, vulnerability, and unseen presence.",
    imageUrl: painting9,
    price: 4200,
    status: "Available",
    collection: "Whispers of the Subconscious",
    createdAt: "2026-09-01T12:00:00Z"
  }
];
