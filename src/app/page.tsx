import Link from 'next/link';
import { getFeedPreview } from '@/lib/getFeed';
import FeedItem from '@/components/FeedItem';
import BackgroundVideo from '@/components/BackgroundVideo';

export const revalidate = 60;

export const metadata = {
  title: 'TensorThrottleX',
  description: 'Experiment hub — raw, chronological, minimal. No code to publish.',
};

export default async function HomePage() {
  const preview = await getFeedPreview(8);

  return (
    <>
      <BackgroundVideo />

      <div className="relative z-10">
        <section className="mb-20 pt-16 md:pt-24 pb-12">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3 tracking-tight">TensorThrottleX</h1>
          <p className="text-neutral-600 text-base max-w-lg leading-relaxed">
            Experiment hub — raw, chronological, minimal.
            <br />
            No code to publish. Just signal.
          </p>
        </section>

        <section>
          <div className="flex items-baseline justify-between gap-4 mb-8">
            <h2 className="text-lg font-medium text-neutral-900 flex items-center gap-2">
              Latest
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </h2>
            <Link
              href="/feed"
              className="text-sm font-medium text-neutral-500 hover:text-black transition-colors"
            >
              View all →
            </Link>
          </div>

          {preview.length === 0 ? (
            <div className="py-20 text-center bg-white/50 backdrop-blur-sm border border-dashed border-[var(--border)] rounded-xl">
              <p className="text-neutral-500 text-sm font-medium">Nothing here yet.</p>
              <p className="text-neutral-400 text-xs mt-2">
                Toggle Published in Notion when you’re ready.
              </p>
            </div>
          ) : (
            <ul className="space-y-0">
              {preview.map((post, i) => (
                <li key={post.id}>
                  <FeedItem post={post} index={i} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
