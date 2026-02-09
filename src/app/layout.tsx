import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'TensorThrottleX',
  description: 'Experiment hub — raw, chronological, minimal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">
        <Sidebar />
        <div className="md:pl-[var(--sidebar-width)]">
          <Header />
          <main className="max-w-2xl mx-auto px-6 py-8 md:py-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
