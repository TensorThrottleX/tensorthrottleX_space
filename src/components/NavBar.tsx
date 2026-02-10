'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
    { name: 'Feed', href: '/feed' },
    { name: 'Experiments', href: '/experiments' },
    { name: 'Projects', href: '/projects' },
    { name: 'Notes', href: '/notes' },
];

export default function NavBar() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'circOut' }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pb-4 bg-gradient-to-b from-[#050505]/90 to-transparent backdrop-blur-[2px]"
        >
            <ul className="flex items-center gap-1 bg-neutral-900/50 backdrop-blur-md border border-neutral-800/50 rounded-full px-2 py-1.5 shadow-xl shadow-black/20">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`relative px-4 py-1.5 text-xs font-medium transition-colors duration-200 rounded-full block ${isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-neutral-800 rounded-full -z-10"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </motion.nav>
    );
}
