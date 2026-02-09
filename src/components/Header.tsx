import Link from 'next/link';

export default function Header() {
  return (
    <header className="hidden md:block border-b border-[var(--border)] bg-white/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/feed" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          TensorThrottleX
        </Link>
        <span className="text-xs text-neutral-400">experiment hub</span>
      </div>
    </header>
  );
}
