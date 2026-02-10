'use client';

import { useMemo, useState, useEffect } from 'react';
import FeedItem from '@/components/FeedItem';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import type { Post } from '@/types';

type Section = 'feed' | 'projects' | 'research' | 'logs';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'feed', label: 'Feed' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'logs', label: 'Logs' },
];

function getDaysAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `${days} days`;
}

interface FeedWithFiltersProps {
  posts: Post[];
  emptyMessage?: string;
}

export default function FeedWithFilters({ posts, emptyMessage }: FeedWithFiltersProps) {
  const [activeSection, setActiveSection] = useState<Section>('feed');

  // Filter logic based on sections
  const filtered = useMemo(() => {
    let list = posts;

    if (activeSection === 'projects') {
      list = posts.filter(p => p.type === 'project');
    } else if (activeSection === 'research') {
      list = posts.filter(p => p.type === 'research');
    } else if (activeSection === 'logs') {
      // Logs includes notes, status, system
      list = posts.filter(p => ['note', 'status', 'system', 'comment'].includes(p.type));
    }
    // 'feed' includes everything (unfiltered)

    // Always chronological (newest first)
    return [...list].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [posts, activeSection]);

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
        <p className="text-neutral-500 text-sm font-mono">{emptyMessage ?? 'System idle.'}</p>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen">
      {/* Feed Spine Indicator */}
      <div className="fixed left-8 top-20 bottom-0 w-[2px] bg-neutral-700 opacity-40"></div>

      {/* Sticky Section Selector */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-neutral-900 mb-8 -mx-6 px-6 py-4 flex items-center gap-6">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`text-sm font-mono tracking-wide transition-colors ${activeSection === section.id
              ? 'text-white font-medium'
              : 'text-neutral-500 hover:text-neutral-300'
              }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Feed Header / Threshold Indicator */}
      <div className="sticky top-20 px-8 text-xs uppercase text-neutral-600 font-bold tracking-wider mb-8 z-30 mix-blend-difference">
        Feed Stream ▼
      </div>

      {/* Feed Content */}
      <ul className="space-y-12 pb-20 relative border-l border-neutral-900 ml-3 pl-8 min-h-[50vh]">
        {filtered.map((post, i) => {
          const prev = filtered[i - 1];
          // Calculate days difference (if prev exists)
          const diff = prev
            ? (new Date(prev.createdAt).getTime() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24)
            : 0;
          const daysSince = Math.floor(diff);

          return (
            <div key={post.id} className="contents">
              {daysSince > 14 && (
                <li className="relative py-4">
                  <span className="absolute -left-[37px] top-6 w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                  <p className="text-[10px] font-mono text-neutral-800 uppercase tracking-widest pl-1">
                    ... {daysSince} days of silence ...
                  </p>
                </li>
              )}
              <li className="relative group">
                {/* Timeline node */}
                <span
                  className={`absolute -left-[37px] top-1.5 w-1.5 h-1.5 rounded-full ring-4 ring-black/50 transition-colors ${post.type === 'system'
                    ? 'bg-red-900/40 ring-red-900/10'
                    : 'bg-neutral-800 group-hover:bg-neutral-500'
                    }`}
                />
                <FeedItem post={post} index={i} id={`feed-item-${i}`} />
              </li>
            </div>
          );
        })}

        {/* End of feed signal */}
        <li className="relative pt-12">
          <span className="absolute -left-[37px] top-[54px] w-1.5 h-1.5 bg-emerald-900/50 rounded-full animate-pulse" />
          <div className="mt-8 px-8 text-sm text-neutral-500 font-mono flex items-center gap-2">
            <span className="text-green-400">[SYSTEM]</span>
            <span>{filtered.length > 0 ? getDaysAgo(filtered[0].createdAt) : '0 days'} ago</span>
          </div>
          <div className="px-8 text-neutral-400 font-mono text-base">
            System idle. Monitoring only.
          </div>
        </li>
      </ul>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-neutral-600 font-mono text-xs uppercase tracking-widest">
            No signals detected in {activeSection}
          </p>
        </div>
      )}
    </section>
  );
}
