'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Post } from '@/types';

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

interface FeedItemProps {
  post: Post;
  index?: number;
  id?: string;
}

export default function FeedItem({ post, index = 0, id }: FeedItemProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      <Link
        id={id}
        href={`/post/${post.slug}`}
        className="block bg-white border border-[var(--border)] p-5 hover:border-neutral-300 hover:shadow-md focus:ring-2 focus:ring-neutral-200 focus:outline-none transition-all duration-200 rounded-xl shadow-sm mb-4"
      >
        <div className="flex gap-4 items-start">
          {post.cover && (
            <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-100">
              <Image
                src={post.cover}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="96px"
              />
            </div>
          )}
          <div className="min-w-0 flex-1 py-0.5">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1 block">{post.type}</span>
            <h2 className="text-lg font-medium text-neutral-900 group-hover:text-black leading-tight mb-2">
              {post.title}
            </h2>
            <time className="text-xs text-neutral-500 font-medium" dateTime={post.createdAt}>
              {formatDate(post.createdAt)}
            </time>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
