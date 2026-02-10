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
    <div className="relative">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-neutral-800">
        <h1 className="text-xl font-medium text-neutral-100 mb-1">
          Feed
        </h1>
        <p className="text-sm text-neutral-400">
          Raw system output. Chronological. No noise.
        </p>
      </div>

      {/* Feed */}
      <FeedWithFilters
        posts={posts}
        emptyMessage="No signals yet. Waiting for input."
      />
    </div>
  );
}
