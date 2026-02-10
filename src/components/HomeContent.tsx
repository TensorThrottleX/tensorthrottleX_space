'use client';

import { motion } from 'framer-motion';
import type { Post } from '@/types';
import FeedWithFilters from '@/components/FeedWithFilters';

function SectionHero() {
    return (
        <section className="min-h-[60vh] flex flex-col justify-center items-start relative z-10 mx-6 pt-32 pb-20 border-b border-neutral-900">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
            >
                <div className="flex flex-col gap-1 mb-8">
                    <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className="font-mono text-[10px] text-green-500/80 tracking-widest uppercase">System Online</span>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-600 tracking-widest uppercase">Latency: Nominal</span>
                </div>

                <div className="max-w-xl">
                    <p className="font-mono text-sm text-neutral-400 mb-2 uppercase tracking-wide">
                        Current Focus
                    </p>
                    <h1 className="text-xl md:text-2xl font-light text-neutral-200 leading-relaxed">
                        Refining unified feed architecture. <br />
                        Optimizing minimal surface data flow.
                    </h1>
                </div>
            </motion.div>
        </section>
    );
}

function SectionTransition() {
    return (
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-neutral-800">
            {/* This is now handled by FeedWithFilters sticky header */}
        </div>
    );
}

export default function HomeContent({ initialPosts }: { initialPosts: Post[] }) {
    const NOW = Date.now();
    const DAY_MS = 1000 * 60 * 60 * 24;

    const DEMO_POSTS: Post[] = [
        {
            id: 'demo-7',
            title: 'No active experiments. Monitoring only.',
            slug: 'status-ping-mock',
            type: 'status',
            published: true,
            createdAt: new Date(NOW - 2 * DAY_MS).toISOString(),
            cover: null,
            content: []
        },
        {
            id: 'demo-6',
            title: 'System idle. No new entries recorded.',
            slug: 'system-idle-mock',
            type: 'system',
            published: true,
            createdAt: new Date(NOW - 6 * DAY_MS).toISOString(),
            cover: null,
            content: []
        },
        {
            id: 'demo-5',
            title: 'This approach reminds me of internal observability dashboards. Interesting.',
            slug: 'comment-mock',
            type: 'comment',
            published: true,
            createdAt: new Date(NOW - 11 * DAY_MS).toISOString(),
            cover: null,
            content: []
        },
        {
            id: 'demo-4',
            title: 'Refactored feed to use a single Notion source of truth. Removed route-based silos.',
            slug: 'project-update-mock',
            type: 'project',
            published: true,
            createdAt: new Date(NOW - 12 * DAY_MS).toISOString(),
            cover: null,
            content: []
        },
        {
            id: 'demo-3',
            title: 'Observed that treating comments as first-class feed events simplifies moderation and filtering logic.',
            slug: 'research-note-mock',
            type: 'research',
            published: true,
            createdAt: new Date(NOW - 14 * DAY_MS).toISOString(),
            cover: null,
            content: []
        },
        {
            id: 'demo-2',
            title: 'Focus updated: unified feed architecture and inference latency.',
            slug: 'focus-update-mock',
            type: 'status',
            published: true,
            createdAt: new Date(NOW - 17 * DAY_MS).toISOString(),
            cover: null,
            content: []
        },
        {
            id: 'demo-1',
            title: 'System online. Monitoring enabled.',
            slug: 'system-boot-mock',
            type: 'system',
            published: true,
            createdAt: new Date(NOW - 18 * DAY_MS).toISOString(),
            cover: null,
            content: []
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-black">
            <SectionHero />
            {/* Transition handled by Feed header */}
            <div className="max-w-2xl mx-auto w-full px-6">
                <FeedWithFilters posts={DEMO_POSTS} />
            </div>
        </div>
    );
}
