'use client';

import Link from 'next/link';
import type { Post } from '@/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit'
  });
}

interface FeedItemProps {
  post: Post;
  index?: number;
  id?: string;
}

export default function FeedItem({ post, id }: FeedItemProps) {
  return (
    <article className="group relative pl-4 border-l border-neutral-800 hover:border-neutral-600 transition-colors py-1">
      {post.type === 'system' ? (
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 select-none cursor-default">
          {/* Metadata Line */}
          <div className="flex items-center gap-3 shrink-0">
            <time className="font-mono text-[10px] text-neutral-600 tabular-nums">
              {formatDate(post.createdAt)}
            </time>
            <span className="font-mono text-[10px] uppercase tracking-wider text-red-500/80">
              [SYSTEM]
            </span>
          </div>
          {/* Content Line */}
          <h2 className="text-sm font-mono text-neutral-500 leading-snug uppercase tracking-wide">
            {post.title}
          </h2>
        </div>
      ) : (
        <Link
          id={id}
          href={`/post/${post.slug}`}
          className="block focus:outline-none"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
            {/* Metadata Line */}
            <div className="flex items-center gap-3 shrink-0">
              <time className="font-mono text-[10px] text-neutral-600 tabular-nums">
                {formatDate(post.createdAt)}
              </time>
              <span className={`font-mono text-[10px] uppercase tracking-wider ${post.type === 'post' ? 'text-blue-500' :
                  post.type === 'project' ? 'text-green-500' :
                    post.type === 'research' ? 'text-purple-500' :
                      post.type === 'status' ? 'text-yellow-500' :
                        'text-neutral-500'
                }`}>
                [{post.type}]
              </span>
            </div>

            {/* Content Line */}
            <h2 className="text-base font-normal text-neutral-300 group-hover:text-white transition-colors leading-snug">
              {post.title}
              {post.type === 'note' && (
                <span className="ml-2 text-neutral-600 text-sm">Create a raw thought stream...</span>
              )}
            </h2>
          </div>
        </Link>
      )}
    </article>
  );
}
