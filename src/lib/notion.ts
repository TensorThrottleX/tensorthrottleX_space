import { Client } from '@notionhq/client';
import type { Post, NotionBlock } from '@/types';

/* ------------------------------------------------------------------ */
/* Notion client setup */
/* ------------------------------------------------------------------ */

const token = process.env.NOTION_TOKEN ?? '';
if (!token) {
  console.error('[NOTION] Missing NOTION_TOKEN');
}

const notion = new Client({ auth: token });

/* ------------------------------------------------------------------ */
/* Database IDs */
/* ------------------------------------------------------------------ */

export function getFeedDbId(): string {
  const id = process.env.NOTION_FEED_DB_ID ?? '';
  if (!id) {
    console.error('[NOTION] Missing NOTION_FEED_DB_ID');
  }
  return id;
}

export function getDatabaseIds(): Record<string, string> {
  return {
    feed: process.env.NOTION_FEED_DB_ID ?? '',
    experiments: process.env.NOTION_DATABASE_EXPERIMENTS ?? '',
    projects: process.env.NOTION_DATABASE_PROJECTS ?? '',
    notes: process.env.NOTION_DATABASE_NOTES ?? '',
  };
}

/* ------------------------------------------------------------------ */
/* Type guards & helpers */
/* ------------------------------------------------------------------ */

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
  return Array.isArray(p.rich_text)
    ? p.rich_text.map((t) => t.plain_text ?? '').join('')
    : '';
}

function getCheckbox(prop: unknown): boolean {
  return Boolean((prop as { checkbox?: boolean })?.checkbox);
}

function getSelect(prop: unknown): string {
  return (prop as { select?: { name?: string } })?.select?.name ?? '';
}

function getCoverUrl(cover: unknown): string | null {
  const c = cover as any;
  if (c?.type === 'file') return c.file?.url ?? null;
  if (c?.type === 'external') return c.external?.url ?? null;
  return null;
}

/* ------------------------------------------------------------------ */
/* Page → Post mapper (STRICT) */
/* ------------------------------------------------------------------ */

function pageToPost(page: {
  id: string;
  properties: Record<string, unknown>;
  cover: unknown;
  created_time?: string;
}): Post | null {
  const props = page.properties;

  const title = getPlainText(props.Title);
  const slug = getPlainText(props.Slug).trim();
  if (!slug) return null;

  const published = getCheckbox(props.Published);
  if (!published) return null;

  const typeRaw = getSelect(props.Type).toLowerCase();
  if (!['feed', 'experiment', 'project', 'note'].includes(typeRaw)) {
    return null;
  }

  return {
    id: page.id,
    title: title || 'Untitled',
    slug,
    type: typeRaw as Post['type'],
    published: true,
    createdAt: page.created_time ?? new Date().toISOString(),
    cover: getCoverUrl(page.cover),
    content: [],
  };
}

/* ------------------------------------------------------------------ */
/* Database queries */
/* ------------------------------------------------------------------ */

export async function fetchDatabasePages(
  databaseId: string,
  type: Post['type']
): Promise<Post[]> {
  if (!databaseId || !token) return [];

  try {
    console.error('[NOTION] Query DB:', databaseId, 'Type:', type);

    const { results } = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          { property: 'Published', checkbox: { equals: true } },
          { property: 'Type', select: { equals: type } },
        ],
      },
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    });

    console.error('[NOTION] Results count:', results.length);

    return results
      .filter(isNotionPage)
      .map(pageToPost)
      .filter((p): p is Post => Boolean(p));
  } catch (err) {
    console.error('[NOTION QUERY ERROR]', err);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Block fetching */
/* ------------------------------------------------------------------ */

async function fetchBlockChildren(blockId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  try {
    do {
      const res = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100,
      });

      for (const b of res.results as any[]) {
        const richText =
          b.paragraph?.rich_text ??
          b.heading_1?.rich_text ??
          b.heading_2?.rich_text ??
          b.heading_3?.rich_text ??
          b.bulleted_list_item?.rich_text ??
          b.numbered_list_item?.rich_text;

        const block: NotionBlock = {
          id: b.id,
          type: b.type,
          plainText: richText?.map((t: any) => t.plain_text).join(''),
          richText,
        };

        if (b.type === 'image') block.url = b.image?.file?.url ?? b.image?.external?.url;
        if (b.type === 'video') block.url = b.video?.file?.url ?? b.video?.external?.url;
        if (b.type === 'embed' || b.type === 'bookmark') block.url = b.embed?.url ?? b.bookmark?.url;

        if (b.has_children) {
          block.children = await fetchBlockChildren(b.id);
        }

        blocks.push(block);
      }

      cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);
  } catch (err) {
    console.error('[NOTION BLOCK ERROR]', err);
  }

  return blocks;
}

/* ------------------------------------------------------------------ */
/* Single page fetch */
/* ------------------------------------------------------------------ */

export async function fetchPageById(pageId: string): Promise<Post | null> {
  if (!pageId || !token) return null;

  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    if (!isNotionPage(page)) return null;

    const post = pageToPost(page);
    if (!post) return null;

    post.content = await fetchBlockChildren(pageId);
    return post;
  } catch (err) {
    console.error('[NOTION PAGE ERROR]', err);
    return null;
  }
}

export { notion };
