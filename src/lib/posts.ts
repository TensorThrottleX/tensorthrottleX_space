import type { Post, PostType } from '@/types';
import {
  fetchDatabasePages,
  fetchPageById,
  getDatabaseIds,
} from './notion';

/**
 * Fetch all published posts from all configured Notion databases,
 * normalized to a single list, sorted by createdAt desc.
 */
export async function getAllPosts(): Promise<Post[]> {
  const ids = getDatabaseIds();

  const [feed, experiments, projects, notes] = await Promise.all([
    ids.feed ? fetchDatabasePages(ids.feed, 'feed') : Promise.resolve([]),
    ids.experiments ? fetchDatabasePages(ids.experiments, 'experiment') : Promise.resolve([]),
    ids.projects ? fetchDatabasePages(ids.projects, 'project') : Promise.resolve([]),
    ids.notes ? fetchDatabasePages(ids.notes, 'note') : Promise.resolve([]),
  ]);

  return [...feed, ...experiments, ...projects, ...notes].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );
}

/**
 * Fetch posts filtered by type (feed | experiment | project | note).
 */
export async function getPostsByType(type: PostType): Promise<Post[]> {
  const ids = getDatabaseIds();

  switch (type) {
    case 'feed':
      return ids.feed ? fetchDatabasePages(ids.feed, 'feed') : [];
    case 'experiment':
      return ids.experiments
        ? fetchDatabasePages(ids.experiments, 'experiment')
        : [];
    case 'project':
      return ids.projects
        ? fetchDatabasePages(ids.projects, 'project')
        : [];
    case 'note':
      return ids.notes ? fetchDatabasePages(ids.notes, 'note') : [];
    default:
      return [];
  }
}

/**
 * Get a single post by slug.
 * Loads from all DBs, finds match, then loads full content.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await getAllPosts();
  const post = all.find((p) => p.slug === slug);
  if (!post) return null;

  // fetchPageById already loads content
  return fetchPageById(post.id);
}

/**
 * Get a single post by Notion page ID.
 */
export async function getPostById(id: string): Promise<Post | null> {
  return fetchPageById(id);
}
