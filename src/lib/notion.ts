import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { Client } from '@notionhq/client';
import type { Post, NotionBlock } from '@/types';

/* ------------------------------------------------------------------ */
/* Environment guards (FAIL FAST) */
/* ------------------------------------------------------------------ */

function assertEnv(name: string, value: string) {
  if (!value) {
    throw new Error(`[ENV] Missing required variable: ${name}`);
  }
}

assertEnv('NOTION_TOKEN', process.env.NOTION_TOKEN ?? '');
assertEnv('NOTION_FEED_DB_ID', process.env.NOTION_FEED_DB_ID ?? '');

const token = process.env.NOTION_TOKEN as string;
const notion = new Client({ auth: token });

/* ------------------------------------------------------------------ */
/* Database IDs */
/* ------------------------------------------------------------------ */

export function getFeedDbId(): string {
  return process.env.NOTION_FEED_DB_ID as string;
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
/* Constants & types */
/* ------------------------------------------------------------------ */

const ALLOWED_TYPES = ['feed', 'experiment', 'project', 'note'] as const;
type AllowedType = typeof ALLOWED_TYPES[number];

/* ------------------------------------------------------------------ */
/* Type guards & helpers */
/* ------------------------------------------------------------------ */

function isNotionPage(page: unknown): page is PageObjectResponse {
  return (
    typeof page === 'object' &&
    page !== null &&
    'object' in page &&
    (page as any).object === 'page' &&
    'properties' in page
  );
}


function hasRequiredProps(props: Record<string, unknown>): boolean {
  return Boolean(props.Title && props.Slug && props.Published && props.Type);
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
/* Page → Post mapper (STRICT & DEFENSIVE) */
/* ------------------------------------------------------------------ */

function pageToPost(page: PageObjectResponse): Post | null {

  const props = page.properties;

  if (!hasRequiredProps(props)) {
    console.warn('[CMS] Dropped page (missing required properties):', page.id);
    return null;
  }

  const slug = getPlainText(props.Slug).trim();
  if (!slug) {
    console.warn('[CMS] Dropped page (empty slug):', page.id);
    return null;
  }

  if (!getCheckbox(props.Published)) {
    return null; // intentional draft
  }

  const typeRaw = getSelect(props.Type).toLowerCase();
  if (!ALLOWED_TYPES.includes(typeRaw as AllowedType)) {
    console.warn('[CMS] Dropped page (invalid type):', page.id, typeRaw);
    return null;
  }

  return {
    id: page.id,
    title: getPlainText(props.Title) || 'Untitled',
    slug,
    type: typeRaw as Post['type'],
    published: true,
    createdAt: page.created_time ?? new Date().toISOString(),
    cover: getCoverUrl(page.cover),
    content: [], // filled ONLY by fetchPageById
  };
}

/* ------------------------------------------------------------------ */
/* Database queries (STRICT FILTERING) */
/* ------------------------------------------------------------------ */

export async function fetchDatabasePages(
  databaseId: string,
  type?: Post['type']
): Promise<Post[]> {
  if (!databaseId) return [];

  try {
    const { results } = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: { equals: true },
      },
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    });

    const posts = results
      .filter(isNotionPage)
      .map(pageToPost)
      .filter((post): post is Post => post !== null)
      .filter((post) => !type || post.type === type);


    return posts;
  } catch (err) {
    console.error('[NOTION QUERY ERROR]', err);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Block fetching (internal only) */
/* ------------------------------------------------------------------ */

// ... (inside fetchBlockChildren)
try {
  console.log(`[DEBUG] Fetching blocks for blockId: ${blockId}`);
  do {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    console.log(`[DEBUG] Fetched ${res.results.length} blocks for ${blockId}`);

    for (const b of res.results as any[]) {
      // ...

      // ... (inside fetchPageById)
      export async function fetchPageById(pageId: string): Promise<Post | null> {
        if (!pageId) return null;

        try {
          console.log(`[DEBUG] Fetching page by ID: ${pageId}`);
          const page = await notion.pages.retrieve({ page_id: pageId });
          if (!isNotionPage(page)) {
            console.warn(`[DEBUG] Page ${pageId} is not a valid Notion page object`);
            return null;
          }

          const post = pageToPost(page);
          if (!post) {
            console.warn(`[DEBUG] Page ${pageId} failed to map to Post`);
            return null;
          }

          console.log(`[DEBUG] Page mapped to Post: ${post.slug}. Fetching content...`);
          post.content = await fetchBlockChildren(pageId);
          console.log(`[DEBUG] Attached ${post.content.length} blocks to post ${post.slug}`);

          return post;
        } catch (err) {
          console.error('[NOTION PAGE ERROR]', err);
          return null;
        }
      }

      /* ------------------------------------------------------------------ */
      /* Public client export */
      /* ------------------------------------------------------------------ */

      export { notion };
