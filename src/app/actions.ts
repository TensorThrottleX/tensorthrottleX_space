'use server';

import { createComment } from '@/lib/notion';
import { revalidatePath } from 'next/cache';

const ABUSE_KEYWORDS = ['spam', 'viagra', 'casino', 'buy', 'offer', 'free']; // extend as needed

export async function submitComment(formData: FormData) {
    const content = formData.get('content') as string;
    const parentSlug = formData.get('slug') as string;
    const honeypot = formData.get('website') as string;

    // 1. Invisible Honeypot check
    if (honeypot) {
        console.log('[SPAM] Honeypot triggered');
        return { success: true }; // Fake success
    }

    // 2. Validate input
    if (!content || !parentSlug || content.trim().length === 0) {
        return { success: false, message: 'Input unavailable.' };
    }

    // 3. Profanity/Abuse filter (Simple keyword check)
    const lower = content.toLowerCase();
    if (ABUSE_KEYWORDS.some((w) => lower.includes(w))) {
        console.log('[ABUSE] Keyword detected');
        return { success: true }; // Fake success (Shadow moderation)
    }

    // 4. Rate limiting (Simulated for now, usually needs Redis/DB)
    // For this MVP, we rely on the implementation simplicity.

    // 5. Submit to Notion (Published=false by default for review)
    const success = await createComment(parentSlug, content);

    if (success) {
        revalidatePath(`/post/${parentSlug}`);
        return { success: true };
    } else {
        return { success: false, message: 'System error.' };
    }
}
