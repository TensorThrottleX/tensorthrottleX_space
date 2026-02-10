import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-lg font-mono text-neutral-200">Signal lost (404)</h1>
      <p className="text-neutral-500 font-mono text-xs mt-4 max-w-sm mx-auto uppercase tracking-wide">
        The requested node does not exist.
      </p>
      <Link
        href="/"
        className="inline-block mt-8 text-xs font-mono text-neutral-400 hover:text-white border-b border-transparent hover:border-neutral-500 transition-colors pb-1"
      >
        return_to_feed
      </Link>
    </div>
  );
}
