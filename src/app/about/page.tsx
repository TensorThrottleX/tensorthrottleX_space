export const metadata = {
  title: 'About | TensorThrottleX',
  description: 'Experiment hub — minimal publishing from Notion.',
};

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-xl font-medium text-neutral-900 mb-2">About</h1>
      <div className="prose prose-neutral text-neutral-600 text-sm space-y-4 max-w-none">
        <p>
          TensorThrottleX is an experiment hub — a minimal place to publish raw, chronological content without touching code.
        </p>
        <p>
          Content is written in Notion. A single toggle (Publish) makes it live. No admin panel, no login, no polish required.
        </p>
        <p className="text-neutral-400">
          Think of it as a private feed, exposed.
        </p>
      </div>
    </div>
  );
}
