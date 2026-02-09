import { fetchDatabasePages, getFeedDbId } from '@/lib/notion';
import FeedWithFilters from '@/components/FeedWithFilters';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Feed | TensorThrottleX',
  description: 'Timeline — raw, chronological. Filter by type or time.',
};

export default async function FeedPage() {
  const posts = await fetchDatabasePages(getFeedDbId(), 'feed');

  return (
    <div>
      <div className="mb-10 py-6 border-b border-[var(--border)]">
        <h1 className="text-xl font-medium text-neutral-900 mb-1">Feed</h1>
        <p className="text-sm text-neutral-500">
          Filter by type or order. No extra load.
        </p>
      </div>

      <FeedWithFilters
        posts={posts}
        emptyMessage="No posts yet. Content comes from Notion."
      />
    </div>
  );
}
