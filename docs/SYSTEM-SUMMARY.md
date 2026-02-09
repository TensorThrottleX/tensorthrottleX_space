# TensorThrottleX — System Summary (Phase 3 Complete)

This document describes the full system from setup to deployment: what exists, how it works, and what is considered done.

---

## 1. What the System Is

- **Product:** A minimal, public “experiment hub” for one creator.
- **Publishing:** Content is written and toggled in **Notion**; the site reads it via the Notion API. No code changes or Git needed to publish.
- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Notion (read-only), Vercel-ready.
- **Experience:** Immersive, calm depth with atmospheric background video and keyboard navigation.

---

## 2. Repository & Tooling (Done)

| Item | Status | Notes |
|------|--------|--------|
| **Next.js** | Done | App Router, `src/` layout |
| **TypeScript** | Done | Strict, path alias `@/*` |
| **Tailwind CSS** | Done | `tailwind.config.ts`, `postcss.config.js`, `globals.css` |
| **ESLint** | Done | `next/core-web-vitals` |
| **Dependencies** | Done | next, react, react-dom, @notionhq/client, framer-motion; dev: typescript, tailwindcss, eslint, etc. |
| **.gitignore** | Done | `.env`, `.env.local`, `node_modules`, `.next`, etc. |
| **.env.example** | Done | Documents `NOTION_TOKEN`, `NOTION_FEED_DB_ID` only |

---

## 3. Environment & Secrets (Done)

- **Required in `.env.local` (and Vercel):**
  - `NOTION_TOKEN` — Notion integration secret (server-only).
  - `NOTION_FEED_DB_ID` — Feed database ID from Notion URL.
- **Optional:** `NOTION_DATABASE_EXPERIMENTS`, `NOTION_DATABASE_PROJECTS`, `NOTION_DATABASE_NOTES` (default to feed DB if unset).
- **Security:** Env is read only via `process.env` in server code (`src/lib/`). No `NEXT_PUBLIC_*` for secrets. No logging or exposure of tokens client-side.

---

## 4. Data Layer (Done)

### 4.1 Types (`src/types/index.ts`)

- **Post:** id, title, slug, type (`feed` | `experiment` | `project` | `note`), published, createdAt, cover, content (blocks).
- **NotionBlock:** id, type, plainText, richText, url, caption, children — used for rendering.
- **NotionDatabaseConfig:** feed, experiments, projects, notes (DB IDs).

### 4.2 Notion Client (`src/lib/notion.ts`)

- **Auth:** `Client({ auth: process.env.NOTION_TOKEN })`.
- **Helpers:** `getFeedDbId()`, `getDatabaseIds()` — read from env only.
- **Page → Post:** `pageToPost()` — maps Notion page to `Post`; uses **`created_time`** from API when present.
- **Fetch DB pages:** `fetchDatabasePages(databaseId)`:
  - Filter: **Published === true** (with fallback if DB has no Published property).
  - Sort: **created_time** descending.
- **Block content:** `fetchBlockChildren()` → normalized `NotionBlock[]` (paragraph, headings, lists, image, video, embed, bookmark, divider).
- **Other exports:** `fetchPageContent(pageId)`, `fetchPageById(pageId)`.

### 4.3 Feed API (`src/lib/getFeed.ts`)

- **getFeed():** Fetches from `NOTION_FEED_DB_ID` via `fetchDatabasePages` (Published, created_time sort).
- **getFeedPreview(limit):** First N posts from `getFeed()` (default 8).

### 4.4 Posts API (`src/lib/posts.ts`)

- **getAllPosts():** Fetches from all four DBs (feed, experiments, projects, notes), normalizes type, sorts by `createdAt` desc.
- **getPostsByType(type):** Filter of `getAllPosts()` by type.
- **getFeedPosts():** Delegates to **getFeed()** (single feed DB, created_time).
- **getPostBySlug(slug):** Finds post across all DBs, then loads block content via `fetchPageContent`.
- **getPostById(id):** Single page by Notion page ID.

---

## 5. Routes & Pages (Done)

| Route | Purpose | Data | Behavior |
|-------|---------|------|----------|
| **/** | Homepage | `getFeedPreview(8)` | Surface section (title + tagline) + Background Video + “Latest” feed preview + “View all →” to `/feed`. |
| **/feed** | Full timeline | `getAllPosts()` | Client-side filters (Type: all/feed/experiment/project/note; Time: latest/older). Keyboard nav (j/k). |
| **/experiments** | Experiments list | `getPostsByType('experiment')` | Same list UI as feed; empty state. |
| **/projects** | Projects list | `getPostsByType('project')` | Same list UI; empty state. |
| **/notes** | Notes list | `getPostsByType('note')` | Same list UI; empty state. |
| **/about** | Static about | — | Short copy about TensorThrottleX (no Notion). |
| **/post/[slug]** | Single post | `getPostBySlug(slug)` | Sticky header (title + date), scroll progress bar, cover, long-form body (`.post-body`). 404 if missing/unpublished. |

All data routes use **`revalidate = 60`** (ISR).

---

## 6. UI Components (Done)

- **Layout (`src/app/layout.tsx`):** Root layout; Inter font; wraps with `Sidebar` + main content area.
- **Sidebar (`src/components/Sidebar.tsx`):** Nav links (with active motion pill). Collapses on mobile with hamburger.
- **Header (`src/components/Header.tsx`):** Top bar (desktop).
- **BackgroundVideo (`src/components/BackgroundVideo.tsx`):** Ambient background (Hero layer) with scroll-linked opacity/blur. Respects reduced motion.
- **FeedWithFilters (`src/components/FeedWithFilters.tsx`):** Client-side filter + Keyboard Navigation (j/k).
- **FeedItem (`src/components/FeedItem.tsx`):** Card: solid bg, shadow, hover effect. Framer Motion entrance.
- **PostRenderer (`src/components/PostRenderer.tsx`):** Renders `NotionBlock[]`.
- **ScrollProgress (`src/components/ScrollProgress.tsx`):** Thin progress bar at top of viewport (post page only).

---

## 7. Styling & UX (Done)

- **globals.css:** Tailwind base/components/utilities; CSS vars for background, foreground, muted, border, sidebar width.
- **Design:** White background, minimal typography, sidebar nav with active state, subtle motion (feed item enter; page transition).
- **Mobile:** Sidebar hidden by default; hamburger toggles overlay nav. Background video opacity capped for readability.
- **Empty states:** Calm copy on 404 and empty lists.
- **Post body:** `.post-body` in globals.css for long-form typography.

---

## 8. Notion Integration (Done)

- **API:** Notion API v1, read-only (`@notionhq/client`).
- **Env:** `NOTION_TOKEN`, `NOTION_FEED_DB_ID` (and optional others).
- **DB shape:** Title, Slug, Type, Published, Created Time, Cover.
- **Content:** Body is Notion blocks fetched per post.

---

## 9. Deployment & Production (Done)

- **Vercel:** No extra config; deploy from Git, set env vars.
- **No filesystem writes** in `src/`.
- **Notion only in server code:** No secrets in client bundle.

---

## 10. Phase 3 — Immersive Surface (Done)

- **Background Video:** Muted, looping atmospheric video (`/background.mp4`) with noise overlay and gradient mask. Fades out on scroll.
- **Layering Model:** Content > Atmosphere > Video. Text always readable.
- **Keyboard Navigation:** Vim-style `j`/`k` scrolling on `/feed`. Focus management without intrusive outline.
- **Accessibility:** Respects `prefers-reduced-motion` (disables video).
- **Mobile Tuning:** Video opacity capped to ensure contrast and battery efficiency.

---

## 11. End-to-End Flow (Publishing)

1. Creator writes in Notion.
2. Fills **Title**, **Slug**, **Type**, checks **Published**.
3. Site revalidates every 60s; post appears automatically.
4. No code change needed.

---

## 12. Quick Reference: File Roles

| Path | Role |
|------|------|
| `src/app/page.tsx` | Homepage: Content + Atmosphere layers |
| `src/app/feed/page.tsx` | Full feed with filters + keyboard nav |
| `src/components/BackgroundVideo.tsx` | Hero video + noise/gradient overlays |
| `src/hooks/useKeyboardNav.ts` | Custom hook for j/k navigation |
| `src/components/Sidebar.tsx` | Nav (with active state animation) |
| `src/components/FeedItem.tsx` | Feed card (solid, shadow) |
| `src/lib/notion.ts` | Notion client |

---

**Summary:** The system is fully implemented, serving as a high-quality "signal emitter" with deep atmosphere and zero-friction publishing.
