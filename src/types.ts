/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Painting {
  id: string;
  title: string;
  medium: string;
  category: string;
  year: number;
  dimensions: string;
  description: string;
  imageUrl: string;
  price: number | null;
  status: 'Available' | 'Sold' | 'In Collection';
  collection?: 'Fossils of a Drifting Mind' | 'The Ones I Carry' | 'Whispers of the Subconscious';
  createdAt: string;
}

export interface ArtistProfile {
  name: string;
  title: string;
  bio: string;
  statement: string;
  avatarUrl: string;
  instagram: string;
  email: string;
}

export interface StudioVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  posterUrl?: string;
  duration?: string;
}
