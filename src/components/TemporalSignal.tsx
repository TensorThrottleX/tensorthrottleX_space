'use client';

export default function TemporalSignal({ daysSince }: { daysSince: number }) {
    if (daysSince < 7) return null;

    return (
        <div className="relative py-8 pl-8 ml-3 border-l border-dashed border-neutral-800">
            <span className="absolute -left-[3px] top-[40%] w-[5px] h-[5px] bg-neutral-900 border border-neutral-800 rounded-full" />
            <p className="text-[10px] font-mono text-neutral-700 uppercase tracking-widest">
                No signals recorded for {daysSince} days
            </p>
        </div>
    );
}
