'use client';

import { useFormStatus } from 'react-dom';
import { submitComment } from '@/app/actions';
import { useState } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="mt-2 text-xs font-mono text-neutral-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {pending ? 'Transmitting...' : '[Submit input]'}
        </button>
    );
}

export default function CommentForm({ slug }: { slug: string }) {
    const [complete, setComplete] = useState(false);

    async function action(formData: FormData) {
        const res = await submitComment(formData);
        if (res?.success) {
            setComplete(true);
        }
    }

    if (complete) {
        return (
            <div className="py-4 text-xs font-mono text-green-500">
                Input received. Pending system integration.
            </div>
        );
    }

    return (
        <form action={action} className="mt-8">
            <h3 className="text-xs font-mono text-neutral-600 mb-2 uppercase tracking-wide">
                Add signal
            </h3>
            <input type="hidden" name="slug" value={slug} />

            {/* Honeypot */}
            <input
                type="text"
                name="website"
                className="absolute w-0 h-0 opacity-0 pointer-events-none"
                tabIndex={-1}
                autoComplete="off"
            />

            <textarea
                name="content"
                className="w-full bg-neutral-900/50 border border-neutral-800 text-neutral-300 text-sm font-mono p-3 rounded focus:outline-none focus:border-neutral-600 transition-colors resize-y min-h-[100px]"
                placeholder="Type observation..."
                required
            />
            <div className="flex justify-end">
                <SubmitButton />
            </div>
        </form>
    );
}
