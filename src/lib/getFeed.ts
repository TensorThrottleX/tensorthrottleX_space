import { fetchDatabasePages, getFeedDbId, fetchPageById } from './notion';
import type { Post } from '@/types';

/**
 * Fetch ALL content for the Unified Feed.
 * Sources from the single source of truth database.
 * No filtering by default - the UI handles section views.
 */
export async function getAllPosts(): Promise<Post[]> {
  const dbId = getFeedDbId();
  if (!dbId) return [];

  // Fetch all types (post, project, research, etc) from the one DB
  return fetchDatabasePages(dbId);
}

/**
 * Fetch a single post by slug.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await getAllPosts();
  const post = all.find((p) => p.slug === slug);
  if (!post) return null;

  return fetchPageById(post.id);
}

/**
 * Fetch a limited preview for the homepage (if needed).
 */
export async function getFeedPreview(limit: number): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}

/**
 * @deprecated Use getAllPosts() instead. Kept for compatibility.
 */
export async function getFeed(): Promise<Post[]> {
  return getAllPosts();
}
