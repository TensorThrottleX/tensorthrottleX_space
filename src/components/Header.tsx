'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  const getPageTitle = (path: string) => {
    if (path === '/feed') return 'Feed';
    if (path === '/experiments') return 'Experiments';
    if (path === '/projects') return 'Projects';
    if (path === '/notes') return 'Notes';
    if (path === '/about') return 'About';
    if (path.startsWith('/post/')) return 'Post';
    return '';
  };

  const pageTitle = getPageTitle(pathname);
  const displayText = pageTitle ? `TensorThrottleX | ${pageTitle}` : 'TensorThrottleX';

  return (
    <header className="border-b border-[var(--border)] bg-[#050505]/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between pl-14 md:pl-6">
        <Link href="/feed" className="text-sm font-medium text-neutral-400 hover:text-neutral-100 transition-colors">
          {displayText}
        </Link>
        <span className="hidden md:inline text-xs text-neutral-500">experiment hub</span>
      </div>
    </header>
  );
}
