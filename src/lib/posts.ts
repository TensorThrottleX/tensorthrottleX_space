import type { Post, PostType } from '@/types';
import {
  fetchDatabasePages,
  fetchPageById,
  getDatabaseIds,
} from './notion';

export async function getAllPosts(): Promise<Post[]> {
  const ids = getDatabaseIds();

  const [feed, experiments, projects, notes] = await Promise.all([
    ids.feed ? fetchDatabasePages(ids.feed, 'feed') : [],
    ids.experiments ? fetchDatabasePages(ids.experiments, 'experiment') : [],
    ids.projects ? fetchDatabasePages(ids.projects, 'project') : [],
    ids.notes ? fetchDatabasePages(ids.notes, 'note') : [],
  ]);

  return [...feed, ...experiments, ...projects, ...notes].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );
}

export async function getPostsByType(type: PostType): Promise<Post[]> {
  const ids = getDatabaseIds();

  switch (type) {
    case 'feed':
      return ids.feed ? fetchDatabasePages(ids.feed, 'feed') : [];
    case 'experiment':
      return ids.experiments ? fetchDatabasePages(ids.experiments, 'experiment') : [];
    case 'project':
      return ids.projects ? fetchDatabasePages(ids.projects, 'project') : [];
    case 'note':
      return ids.notes ? fetchDatabasePages(ids.notes, 'note') : [];
    default:
      return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await getAllPosts();
  const post = all.find((p) => p.slug === slug);
  if (!post) return null;

  return fetchPageById(post.id);
}

export async function getPostById(id: string): Promise<Post | null> {
  return fetchPageById(id);
}
