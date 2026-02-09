import { getPostsByType } from '@/lib/posts';
import FeedItem from '@/components/FeedItem';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects | TensorThrottleX',
  description: 'Curated work.',
};

export default async function ProjectsPage() {
  const posts = await getPostsByType('project');

  return (
    <div>
      <h1 className="text-xl font-medium text-neutral-900 mb-2">Projects</h1>
      <p className="text-sm text-neutral-500 mb-8">Curated work.</p>
      <section className="space-y-0">
        {posts.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-neutral-500 text-sm">No projects yet.</p>
            <p className="text-neutral-400 text-xs mt-2">Add one in Notion and check Published.</p>
          </div>
        ) : (
          posts.map((post, i) => <FeedItem key={post.id} post={post} index={i} />)
        )}
      </section>
    </div>
  );
}
