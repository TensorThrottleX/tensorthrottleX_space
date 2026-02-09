'use client';

import { useMemo, useState, useEffect } from 'react';
import FeedItem from '@/components/FeedItem';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import type { Post, PostType } from '@/types';

const TYPE_OPTIONS: { value: 'all' | PostType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'feed', label: 'Feed' },
  { value: 'experiment', label: 'Experiment' },
  { value: 'project', label: 'Project' },
  { value: 'note', label: 'Note' },
];

const TIME_OPTIONS: { value: 'latest' | 'older'; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'older', label: 'Older' },
];

interface FeedWithFiltersProps {
  posts: Post[];
  emptyMessage?: string;
}

export default function FeedWithFilters({ posts, emptyMessage }: FeedWithFiltersProps) {
  const [typeFilter, setTypeFilter] = useState<'all' | PostType>('all');
  const [timeOrder, setTimeOrder] = useState<'latest' | 'older'>('latest');

  const filtered = useMemo(() => {
    let list = typeFilter === 'all' ? posts : posts.filter((p) => p.type === typeFilter);
    list = [...list].sort((a, b) => {
      const tA = new Date(a.createdAt).getTime();
      const tB = new Date(b.createdAt).getTime();
      return timeOrder === 'latest' ? tB - tA : tA - tB;
    });
    return list;
  }, [posts, typeFilter, timeOrder]);

  const activeIndex = useKeyboardNav(filtered.length);

  useEffect(() => {
    if (activeIndex >= 0) {
      const el = document.getElementById(`feed-item-${activeIndex}`);
      if (el) {
        el.focus({ preventScroll: true });
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeIndex]);

  if (posts.length === 0) {
    return (
      <div className="py-14 text-center">
        <p className="text-neutral-500 text-sm">{emptyMessage ?? 'Nothing here yet.'}</p>
        <p className="text-neutral-400 text-xs mt-2">Publish from Notion with Published ✓</p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-xs text-neutral-400 uppercase tracking-wide mr-1">Type</span>
        {TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTypeFilter(opt.value)}
            className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${typeFilter === opt.value
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
          >
            {opt.label}
          </button>
        ))}
        <span className="text-xs text-neutral-400 uppercase tracking-wide ml-2 mr-1">Time</span>
        {TIME_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTimeOrder(opt.value)}
            className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${timeOrder === opt.value
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <ul className="space-y-0">
        {filtered.map((post, i) => (
          <li key={post.id}>
            <FeedItem post={post} index={i} id={`feed-item-${i}`} />
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="text-neutral-500 text-sm py-8">No posts match this filter.</p>
      )}
    </section>
  );
}
