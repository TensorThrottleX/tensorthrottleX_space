'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? scrollTop / total : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-20 h-0.5 w-full origin-left bg-neutral-200"
      aria-hidden
    >
      <motion.div
        className="h-full bg-neutral-400"
        style={{ scaleX: progress }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
