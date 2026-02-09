import { fetchDatabasePages, fetchPageContent, fetchPageById, getDatabaseIds } from './notion';
import { getFeed } from './getFeed';
import type { Post, PostType } from '@/types';

/**
 * Fetch all published posts from all configured Notion databases,
 * normalized to a single list, sorted by createdAt desc.
 */
export async function getAllPosts(): Promise<Post[]> {
  const ids = getDatabaseIds();
  const all: Post[] = [];

  const [feed, experiments, projects, notes] = await Promise.all([
    fetchDatabasePages(ids.feed),
    fetchDatabasePages(ids.experiments),
    fetchDatabasePages(ids.projects),
    fetchDatabasePages(ids.notes),
  ]);

  for (const p of feed) {
    p.type = 'feed';
    all.push(p);
  }
  for (const p of experiments) {
    p.type = 'experiment';
    all.push(p);
  }
  for (const p of projects) {
    p.type = 'project';
    all.push(p);
  }
  for (const p of notes) {
    p.type = 'note';
    all.push(p);
  }

  all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return all;
}

/**
 * Fetch posts filtered by type (feed | experiment | project | note).
 */
export async function getPostsByType(type: PostType): Promise<Post[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.type === type);
}

/**
 * Fetch the main feed (timeline) — uses getFeed (NOTION_FEED_DB_ID, created_time sort).
 */
export async function getFeedPosts(): Promise<Post[]> {
  return getFeed();
}

/**
 * Get a single post by slug. Loads from all DBs then finds match; fetches block content.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await getAllPosts();
  const post = all.find((p) => p.slug === slug);
  if (!post) return null;
  const content = await fetchPageContent(post.id);
  return { ...post, content };
}

/**
 * Get a single post by Notion page ID (e.g. from URL). Used when linking directly.
 */
export async function getPostById(id: string): Promise<Post | null> {
  return fetchPageById(id);
}
