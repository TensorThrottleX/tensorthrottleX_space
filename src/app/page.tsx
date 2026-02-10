import { getAllPosts } from '@/lib/getFeed';
import HomeContent from '@/components/HomeContent';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'TensorThrottleX',
  description: 'Experiments in motion. Live system.',
};

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <>
      <HomeContent initialPosts={posts} />
    </>
  );
}
