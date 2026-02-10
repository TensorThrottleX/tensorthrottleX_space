'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types';

// Hardcoded signals for "Currently Working On"
const SIGNALS = [
    'Experiment: Real-time inference pipeline optimization',
    'System: CMS failure detection protocols',
    'Research: Low-latency regime modeling'
];

function SectionHero() {
    return (
        <section className="h-screen flex flex-col justify-center items-center relative z-10 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="text-center"
            >
                <p className="text-sm font-mono text-neutral-500 mb-4 tracking-widest uppercase">Status: Online</p>
                <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-2">
                    Currently building.
                </h1>
                <p className="text-lg md:text-xl text-neutral-400 font-light">
                    Experiments in motion.
                </p>
            </motion.div>
        </section>
    );
}

function SectionSignals() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-32 px-6 max-w-2xl mx-auto">
            <div className="space-y-8">
                <h2 className="text-xs font-mono text-neutral-600 uppercase tracking-widest mb-8">
                    Active Processes including
                </h2>
                <div className="space-y-4">
                    {SIGNALS.map((signal, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="flex items-center gap-3 border-l-2 border-neutral-800 pl-4 py-2 hover:border-accent transition-colors group"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent group-hover:animate-pulse transition-all" />
                            <span className="text-neutral-400 font-mono text-sm md:text-base group-hover:text-neutral-200 transition-colors">
                                {signal}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SectionThoughts({ posts }: { posts: Post[] }) {
    // Show only the 3 most recent 'note' or generic posts if no notes
    const notes = posts.filter(p => p.type === 'note').slice(0, 3);
    const displayPosts = notes.length > 0 ? notes : posts.slice(0, 3);

    return (
        <section className="py-32 px-6 max-w-3xl mx-auto">
            <h2 className="text-xs font-mono text-neutral-600 uppercase tracking-widest mb-12">
                Input / Output
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayPosts.map((post) => (
                    <Link key={post.id} href={`/post/${post.slug}`}>
                        <article className="h-full bg-neutral-900/30 border border-neutral-800 p-6 rounded hover:bg-neutral-900/50 hover:border-neutral-700 transition-all group">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase mb-2 block">
                                {post.type}
                            </span>
                            <h3 className="text-lg font-medium text-neutral-200 group-hover:text-white leading-snug mb-3">
                                {post.title}
                            </h3>
                            <p className="text-sm text-neutral-500 font-mono">
                                // Read entry
                            </p>
                        </article>
                    </Link>
                ))}
            </div>
            <div className="mt-8 text-right">
                <Link href="/notes" className="text-xs font-mono text-neutral-500 hover:text-white underline decoration-neutral-800">
                    View all nodes &rarr;
                </Link>
            </div>
        </section>
    )
}

function SectionTransition() {
    return (
        <section className="h-[50vh] flex items-center justify-center relative overflow-hidden my-20">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent w-full" />
            <p className="font-mono text-xs text-neutral-600 bg-[#050505] px-4 relative z-10">
                SYSTEM FEED INITIALIZED
            </p>
        </section>
    )
}

function SectionFeed({ posts }: { posts: Post[] }) {
    // Show all posts in the main feed
    return (
        <section className="py-20 px-6 max-w-2xl mx-auto min-h-screen">
            <h2 className="text-xs font-mono text-neutral-600 uppercase tracking-widest mb-12">
                Chronological Log
            </h2>
            <div className="relative border-l border-neutral-800 ml-3 space-y-12 pb-20">
                {posts.map((post, i) => (
                    <motion.article
                        key={post.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5 }}
                        className="pl-8 relative group"
                    >
                        <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700 group-hover:border-accent group-hover:bg-accent transition-colors" />

                        <Link href={`/post/${post.slug}`} className="block group-hover:translate-x-1 transition-transform">
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${post.type === 'experiment' ? 'border-blue-900/50 text-blue-500' :
                                        post.type === 'project' ? 'border-purple-900/50 text-purple-500' :
                                            'border-neutral-800 text-neutral-500'
                                    }`}>
                                    {post.type}
                                </span>
                                <time className="text-xs text-neutral-600 font-mono">
                                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                                </time>
                            </div>

                            <h3 className="text-xl font-medium text-neutral-300 group-hover:text-white transition-colors">
                                {post.title}
                            </h3>
                        </Link>
                    </motion.article>
                ))}

                <div className="pl-8 pt-8 text-sm text-neutral-600 font-mono">
                    -- End of buffer --
                </div>
            </div>
        </section>
    );
}

export default function HomeContent({ initialPosts }: { initialPosts: Post[] }) {
    return (
        <div className="flex flex-col">
            <SectionHero />
            <SectionSignals />
            <SectionThoughts posts={initialPosts} />
            <SectionTransition />
            <SectionFeed posts={initialPosts} />
        </div>
    );
}
