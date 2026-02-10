/**
 * Normalized post type used across the app.
 * All Notion content is mapped to this shape.
 */
export type PostType = 'post' | 'project' | 'research' | 'comment' | 'status' | 'note' | 'system';

export interface Post {
  id: string;
  title: string;
  slug: string;
  type: PostType;
  published: boolean;
  createdAt: string;
  cover: string | null;
  content: NotionBlock[];
}

/**
 * Simplified Notion block for rendering.
 * Mirrors common block types from Notion API.
 */
export interface NotionBlock {
  id: string;
  type: string;
  text?: string;
  plainText?: string;
  href?: string;
  caption?: string;
  url?: string;
  children?: NotionBlock[];
  // Rich text array from Notion
  richText?: Array<{
    plain_text: string;
    href?: string | null;
    annotations?: {
      bold?: boolean;
      italic?: boolean;
      strikethrough?: boolean;
      underline?: boolean;
      code?: boolean;
    };
  }>;
}

export interface NotionDatabaseConfig {
  feed: string;
  experiments: string;
  projects: string;
  notes: string;
}
