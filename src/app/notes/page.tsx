import { getPostsByType } from '@/lib/posts';
import FeedItem from '@/components/FeedItem';

export const revalidate = 60;

export const metadata = {
  title: 'Notes | TensorThrottleX',
  description: 'Short text thoughts.',
};

export default async function NotesPage() {
  const posts = await getPostsByType('note');

  return (
    <div>
      <h1 className="text-xl font-medium text-neutral-900 mb-2">Notes</h1>
      <p className="text-sm text-neutral-500 mb-8">Short text thoughts.</p>
      <section className="space-y-0">
        {posts.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-neutral-500 text-sm">No notes yet.</p>
            <p className="text-neutral-400 text-xs mt-2">Add one in Notion and check Published.</p>
          </div>
        ) : (
          posts.map((post, i) => <FeedItem key={post.id} post={post} index={i} />)
        )}
      </section>
    </div>
  );
}
