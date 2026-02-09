import { fetchDatabasePages, getFeedDbId } from './notion';
import type { Post } from '@/types';

/**
 * Fetch latest feed from Notion.
 * Uses NOTION_FEED_DB_ID and NOTION_TOKEN (process.env, server-only).
 * Filter: Published === true. Sort: created_time descending.
 */
export async function getFeed(): Promise<Post[]> {
  const dbId = getFeedDbId();
  if (!dbId) return [];
  const posts = await fetchDatabasePages(dbId);
  return posts;
}

/**
 * Latest N items for homepage preview. Still sorted by created_time.
 */
export async function getFeedPreview(limit: number = 8): Promise<Post[]> {
  const all = await getFeed();
  return all.slice(0, limit);
}
