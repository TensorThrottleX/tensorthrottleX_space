import { Client } from '@notionhq/client';
import type { Post, NotionBlock } from '@/types';

const token = process.env.NOTION_TOKEN ?? '';
const notion = new Client({ auth: token });

/**
 * Feed database ID from env. Used for main timeline.
 * NOTION_FEED_DB_ID is read via process.env only (server-side).
 */
export function getFeedDbId(): string {
  return process.env.NOTION_FEED_DB_ID ?? '';
}

/**
 * Optional: other database IDs for experiments, projects, notes.
 * Fallback to NOTION_FEED_DB_ID if only one DB is used.
 */
export function getDatabaseIds(): Record<string, string> {
  const feedId = process.env.NOTION_FEED_DB_ID ?? '';
  return {
    feed: feedId,
    experiments: process.env.NOTION_DATABASE_EXPERIMENTS ?? feedId,
    projects: process.env.NOTION_DATABASE_PROJECTS ?? feedId,
    notes: process.env.NOTION_DATABASE_NOTES ?? feedId,
  };
}

function isNotionPage(
  page: unknown
): page is {
  id: string;
  properties: Record<string, unknown>;
  cover: unknown;
  created_time?: string;
} {
  return (
    typeof page === 'object' &&
    page !== null &&
    'id' in page &&
    'properties' in page
  );
}

function getPlainText(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return '';
  const p = prop as { rich_text?: Array<{ plain_text?: string }> };
  if (Array.isArray(p.rich_text) && p.rich_text.length > 0) {
    return p.rich_text.map((t) => t.plain_text ?? '').join('');
  }
  return '';
}

function getCheckbox(prop: unknown): boolean {
  if (!prop || typeof prop !== 'object') return false;
  return (prop as { checkbox?: boolean }).checkbox === true;
}

function getSelect(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return '';
  const s = (prop as { select?: { name?: string } }).select;
  return s?.name ?? '';
}

function getCoverUrl(cover: unknown): string | null {
  if (!cover || typeof cover !== 'object') return null;
  const c = cover as {
    type?: string;
    file?: { url?: string };
    external?: { url?: string };
  };
  if (c.type === 'file' && c.file?.url) return c.file.url;
  if (c.type === 'external' && c.external?.url) return c.external.url;
  return null;
}

/**
 * Map Notion page to Post.
 */
function pageToPost(page: {
  id: string;
  properties: Record<string, unknown>;
  cover: unknown;
  created_time?: string;
}): Post | null {
  const props = page.properties;

  const title = getPlainText(props.Title ?? props.title);
  const slug = getPlainText(props.Slug ?? props.slug).trim();
  if (!slug) return null;

  const published = getCheckbox(props.Published ?? props.published);
  if (!published) return null;

  const typeRaw = (getSelect(props.Type ?? props.type) || 'feed').toLowerCase();
  const type = ['feed', 'experiment', 'project', 'note'].includes(typeRaw)
    ? (typeRaw as Post['type'])
    : 'feed';

  const createdAt = page.created_time ?? new Date().toISOString();

  return {
    id: page.id,
    title: title || 'Untitled',
    slug,
    type,
    published,
    createdAt,
    cover: getCoverUrl(page.cover),
    content: [],
  };
}

/**
 * Fetch published pages from a Notion database.
 */
export async function fetchDatabasePages(databaseId: string): Promise<Post[]> {
  if (!databaseId || !token) return [];

  try {
    const { results } = await notion.databases.query({
      database_id: databaseId,
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    });

    const posts: Post[] = [];
    for (const page of results) {
      if (isNotionPage(page)) {
        const post = pageToPost(page);
        if (post) posts.push(post);
      }
    }
    return posts;
  } catch {
    return [];
  }
}

async function fetchBlockChildren(blockId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let hasMore = true;
  let startCursor: string | undefined;

  while (hasMore) {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: startCursor,
      page_size: 100,
    });

    for (const block of response.results) {
      const b = block as any;

      const richText =
        b.paragraph?.rich_text ??
        b.heading_1?.rich_text ??
        b.heading_2?.rich_text ??
        b.heading_3?.rich_text ??
        b.bulleted_list_item?.rich_text ??
        b.numbered_list_item?.rich_text;

      const plainText = richText?.map((t: any) => t.plain_text).join('') ?? '';

      const normalized: NotionBlock = {
        id: b.id,
        type: b.type,
        plainText: plainText || undefined,
        richText,
      };

      if (b.type === 'image') {
        normalized.url = b.image?.file?.url ?? b.image?.external?.url;
      } else if (b.type === 'video') {
        normalized.url = b.video?.file?.url ?? b.video?.external?.url;
      } else if (b.type === 'embed' || b.type === 'bookmark') {
        normalized.url = b.embed?.url ?? b.bookmark?.url;
      }

      if (b.has_children) {
        normalized.children = await fetchBlockChildren(b.id);
      }

      blocks.push(normalized);
    }

    hasMore = response.has_more;
    startCursor = response.next_cursor ?? undefined;
  }

  return blocks;
}

export async function fetchPageContent(pageId: string): Promise<NotionBlock[]> {
  if (!pageId || !token) return [];
  try {
    return await fetchBlockChildren(pageId);
  } catch {
    return [];
  }
}

export async function fetchPageById(pageId: string): Promise<Post | null> {
  if (!pageId || !token) return null;
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    if (!isNotionPage(page)) return null;

    const post = pageToPost(page);
    if (!post) return null;

    post.content = await fetchPageContent(pageId);
    return post;
  } catch {
    return null;
  }
}

export { notion };
