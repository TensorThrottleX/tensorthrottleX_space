'use client';

import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BackgroundVideo() {
    const { scrollY } = useScroll();
    const shouldReduceMotion = useReducedMotion();

    // Opacity fades out on scroll, but never fully disappears to maintain atmosphere
    const opacity = useTransform(scrollY, [0, 800], [0.3, 0.1]);
    // Blur increases slightly on scroll to separate content
    const blur = useTransform(scrollY, [0, 800], ['0px', '4px']);

    const [videoLoaded, setVideoLoaded] = useState(false);

    if (shouldReduceMotion) {
        return (
            <div className="fixed inset-0 -z-20 bg-[#050505]">
                <div className="absolute inset-0 bg-neutral-900/20" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 -z-20 bg-[#050505] overflow-hidden pointer-events-none select-none">
            <motion.div
                style={{ opacity, filter: `blur(${blur})` }}
                className="absolute inset-0 w-full h-full transition-opacity duration-1000"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedData={() => setVideoLoaded(true)}
                    className={`object-cover w-full h-full grayscale opacity-60 mix-blend-screen transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                >
                    <source src="/background.mp4" type="video/mp4" />
                </video>
            </motion.div>

            {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
            />
        </div>
    );
}
