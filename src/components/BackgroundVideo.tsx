'use client';

import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BackgroundVideo() {
    const { scrollY } = useScroll();
    const shouldReduceMotion = useReducedMotion();

    // Opacity fades out on scroll.
    const opacity = useTransform(scrollY, [0, 500], [0.4, 0]); // Starts at 0.4 opacity, fades to 0
    const blur = useTransform(scrollY, [0, 500], ['2px', '10px']); // Starts slightly blurred, increases to 10px
    const [videoLoaded, setVideoLoaded] = useState(false);

    if (shouldReduceMotion) {
        return (
            <div className="fixed inset-0 -z-10 bg-neutral-100">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
                />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 -z-10 bg-neutral-100 overflow-hidden pointer-events-none select-none">
            {/* 
                Video Layer 
                - Mobile: Max opacity capped at 60% via CSS (opacity-60 md:opacity-100) inside the motion div
            */}
            <motion.div
                style={{ opacity, filter: `blur(${blur})` }}
                className="absolute inset-0 w-full h-full opacity-60 md:opacity-100 transition-opacity"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedData={() => setVideoLoaded(true)}
                    className={`object-cover w-full h-full transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <source src="/background.mp4" type="video/mp4" />
                </video>

                {/* Fallback CSS gradient animation if video missing/loading */}
                {!videoLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse" />
                )}
            </motion.div>

            {/* 
        Atmosphere Layer 
        - Grain / Noise overlay
        - Gradient mask for text readability
      */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/50 to-white/90" />
        </div>
    );
}
