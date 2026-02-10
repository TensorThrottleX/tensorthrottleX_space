import { fetchDatabasePages, getFeedDbId } from './notion';
import type { Post } from '@/types';

/**
 * Fetch feed-only posts.
 */
export async function getFeed(): Promise<Post[]> {
  const dbId = getFeedDbId();
  if (!dbId) return [];

  return fetchDatabasePages(dbId, 'feed');
}

/**
 * Fetch a limited preview of feed posts for the homepage.
 */
export async function getFeedPreview(limit: number): Promise<Post[]> {
  const posts = await getFeed();
  return posts.slice(0, limit);
}
