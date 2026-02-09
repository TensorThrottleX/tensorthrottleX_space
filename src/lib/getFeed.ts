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
