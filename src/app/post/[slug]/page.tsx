import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getPostBySlug } from '@/lib/posts';
import PostRenderer from '@/components/PostRenderer';
import ScrollProgress from '@/components/ScrollProgress';

interface Props {
  params: Promise<{ slug: string }>;
}

function firstText(content: { plainText?: string; richText?: Array<{ plain_text?: string }> }[]): string {
  for (const b of content) {
    const text = b.plainText ?? b.richText?.map((t) => t.plain_text ?? '').join('');
    if (text?.trim()) return text.slice(0, 160);
  }
  return '';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post | TensorThrottleX' };
  const desc = firstText(post.content);
  return {
    title: `${post.title} | TensorThrottleX`,
    ...(desc && { description: desc }),
    openGraph: {
      title: post.title,
      ...(desc && { description: desc }),
      ...(post.cover && { images: [{ url: post.cover, width: 1200, height: 630, alt: post.title }] }),
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="pb-16">
      <ScrollProgress />
      <header className="sticky top-14 z-10 -mx-6 bg-[#050505]/95 backdrop-blur-sm px-6 py-4 border-b border-[var(--border)] mb-8">
        <span className="text-xs text-neutral-400 uppercase tracking-wide">{post.type}</span>
        <h1 className="text-xl font-semibold text-neutral-100 mt-1 truncate max-w-full">
          {post.title}
        </h1>
        <time className="text-sm text-neutral-500 mt-1 block" dateTime={post.createdAt}>
          {date}
        </time>
      </header>

      {post.cover && (
        <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-lg overflow-hidden bg-neutral-100 mb-8">
          <Image
            src={post.cover}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>
      )}

      <div className="post-body">
        <PostRenderer blocks={post.content} />
      </div>

      <footer className="mt-12 pt-8 border-t border-[var(--border)]">
        <div className="text-sm text-neutral-400">
          Comments — placeholder (future-ready)
        </div>
      </footer>
    </article>
  );
}
