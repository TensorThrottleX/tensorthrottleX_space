'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const navItems = [
  { href: '/feed', label: 'Feed' },
  { href: '/experiments', label: 'Experiments' },
  { href: '/projects', label: 'Projects' },
  { href: '/notes', label: 'Notes' },
  { href: '/about', label: 'About' },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Toggle menu"
        className="fixed top-4 left-4 z-50 md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center rounded border border-neutral-200 bg-white"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`w-4 h-0.5 bg-neutral-700 transition-transform ${open ? 'rotate-45 translate-y-1' : ''}`} />
        <span className={`w-4 h-0.5 bg-neutral-700 transition-opacity ${open ? 'opacity-0' : ''}`} />
        <span className={`w-4 h-0.5 bg-neutral-700 transition-transform ${open ? '-rotate-45 -translate-y-1' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.2 }}
        className="fixed left-0 top-0 z-40 h-full w-[var(--sidebar-width)] border-r border-[var(--border)] bg-white md:!transform-none"
      >
        <nav className="flex flex-col gap-1 pt-20 md:pt-12 px-4">
          <Link
            href="/feed"
            className={`text-sm font-medium mb-4 pl-2 transition-colors duration-200 ${pathname === '/feed' || pathname === '/' ? 'text-black' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            onClick={() => setOpen(false)}
          >
            TensorThrottleX
          </Link>
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/feed' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`relative text-sm py-2 px-2 rounded-md transition-colors duration-200 ${isActive ? 'text-black font-semibold' : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-neutral-100 rounded-md -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </motion.aside >
    </>
  );
}
