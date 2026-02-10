import { fetchDatabasePages, getFeedDbId, getDatabaseIds } from './notion';
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

/**
 * Fetch all published posts of any type from all configured databases.
 */
export async function getAllPosts(): Promise<Post[]> {
  // Get all database IDs (feed, experiments, projects, notes)
  const idsMap = getDatabaseIds();
  const ids = Array.from(new Set(Object.values(idsMap).filter(id => id && id.length > 0)));

  if (ids.length === 0) return [];

  // Fetch from all databases in parallel
  const results = await Promise.all(ids.map(id => fetchDatabasePages(id)));

  // Flatten and sort by date descending
  const allPosts = results.flat();

  // Remove duplicates just in case (by ID)
  const uniquePosts = Array.from(new Map(allPosts.map(p => [p.id, p])).values());

  return uniquePosts.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
