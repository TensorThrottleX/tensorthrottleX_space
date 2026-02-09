import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-lg font-medium text-neutral-900">Page not found</h1>
      <p className="text-neutral-500 text-sm mt-2 max-w-sm mx-auto">
        This might have been moved or unpublished. No need to hurry.
      </p>
      <Link
        href="/feed"
        className="inline-block mt-8 text-sm text-neutral-600 hover:text-neutral-900 underline transition-colors"
      >
        Back to feed
      </Link>
    </div>
  );
}
