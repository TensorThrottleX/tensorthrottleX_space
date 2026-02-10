import { getPostsByType } from '@/lib/posts';
import FeedItem from '@/components/FeedItem';

export const dynamic = 'force-dynamic';


export const metadata = {
  title: 'Experiments | TensorThrottleX',
  description: 'Demos and experiments.',
};

export default async function ExperimentsPage() {
  const posts = await getPostsByType('experiment');

  return (
    <div>
      <h1 className="text-xl font-medium text-neutral-100 mb-2">Experiments</h1>
      <p className="text-sm text-neutral-500 mb-8">Demos and experiments.</p>
      <section className="space-y-0">
        {posts.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-neutral-500 text-sm">No experiments yet.</p>
            <p className="text-neutral-400 text-xs mt-2">Add one in Notion and check Published.</p>
          </div>
        ) : (
          posts.map((post, i) => <FeedItem key={post.id} post={post} index={i} />)
        )}
      </section>
    </div>
  );
}
