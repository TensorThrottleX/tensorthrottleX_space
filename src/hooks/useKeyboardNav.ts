import { useEffect, useState } from 'react';

/**
 * Hook for Vim-style (j/k) keyboard navigation in a list.
 * Returns the currently active index.
 */
export function useKeyboardNav(itemCount: number) {
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    // Reset selection when list length changes (e.g. filtering)
    useEffect(() => {
        setActiveIndex(-1);
    }, [itemCount]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore modifier keys
            if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;

            // Ignore if typing in an input
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }

            if (e.key === 'j') {
                setActiveIndex((prev: number) => {
                    const next = prev + 1;
                    return next < itemCount ? next : prev;
                });
            }

            if (e.key === 'k') {
                setActiveIndex((prev: number) => {
                    const next = prev - 1;
                    return next >= 0 ? next : 0;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [itemCount]);

    return activeIndex;
}
