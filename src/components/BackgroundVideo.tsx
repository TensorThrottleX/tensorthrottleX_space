'use client';

import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

export default function BackgroundVideo() {
    const { scrollY } = useScroll();
    const shouldReduceMotion = useReducedMotion();

    const opacity = useTransform(scrollY, [0, 800], [0.3, 0.1]);
    const blur = useTransform(scrollY, [0, 800], ['0px', '4px']);

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
                style={{ filter: `blur(${blur})` }}
                className="absolute inset-0 w-full h-full"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="
            object-cover w-full h-full
            brightness-105 contrast-105
            grayscale-[0.30]
          "
                >
                    <source src="/background.mp4" type="video/mp4" />
                </video>
            </motion.div>

            {/* Main overlay — lowered darkness */}
            <div className="absolute inset-0 bg-black/42" />

            {/* Softer vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.58)_100%)]" />

            {/* Low noise */}
            <div
                className="absolute inset-0 opacity-[0.02] mix-blend-soft-light"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
            />
        </div>
    );
}
