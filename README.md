# TensorThrottleX

Minimal experiment hub — one creator, zero code to publish. Content lives in Notion; this site reads it and renders a clean, chronological feed.

## Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Content:** Notion (read-only API)
- **Hosting:** Vercel

## Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx          → homepage (surface + latest feed preview)
│   ├── feed/             → full timeline
│   ├── experiments/
│   ├── projects/
│   ├── notes/
│   ├── about/
│   ├── post/[slug]/
│   └── not-found.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── FeedItem.tsx
│   └── PostRenderer.tsx
├── lib/
│   ├── notion.ts         → Notion API client (NOTION_TOKEN, created_time)
│   ├── getFeed.ts        → feed from NOTION_FEED_DB_ID, Published === true
│   └── posts.ts          → fetch & normalize posts
├── types/
│   └── index.ts
└── styles/
```

## Notion setup

1. Create a [Notion integration](https://www.notion.so/my-integrations) (read-only is enough).
2. Create four databases (or one database with a **Type** select: feed, experiment, project, note).
3. In each database, add these properties:
   - **Title** (title)
   - **Slug** (text) — URL-friendly identifier; leave empty to use page ID
   - **Type** (select) — feed | experiment | project | note (if using one DB)
   - **Published** (checkbox) — only checked items appear on the site
   - **Created** (date) — or use Notion’s built-in “Created time”
4. Share each database with your integration (database → Connect to → your integration).
5. Copy the database IDs from the URL: `notion.so/workspace/DATABASE_ID?v=...`

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `NOTION_TOKEN` | Notion integration secret (read via `process.env` only; never logged or exposed client-side) |
| `NOTION_FEED_DB_ID` | Feed database ID (from Notion URL). Sorting uses `created_time`. |

Optional (default to feed DB if unset): `NOTION_DATABASE_EXPERIMENTS`, `NOTION_DATABASE_PROJECTS`, `NOTION_DATABASE_NOTES`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Homepage shows a surface section and latest feed preview; `/feed` shows the full timeline.

## Deploy on Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add `NOTION_TOKEN` and `NOTION_FEED_DB_ID` in Project Settings → Environment Variables.
3. Deploy. No build config needed.

**Vercel readiness:** No filesystem writes; Notion API is used only in server code (App Router server components / server-side); no secrets in client bundle.

## Publishing flow

- Write in Notion (text, images, embeds).
- Check **Published** when ready.
- No code changes, no Git, no admin UI. Revalidation is set to 60s so new posts appear within a minute.

## Design

- White background, minimal typography, sidebar navigation (collapses on mobile).
- Subtle motion via Framer Motion.
- Comment area is a placeholder for future use.

TensorThrottleX — a tool for thinking, not a product.
