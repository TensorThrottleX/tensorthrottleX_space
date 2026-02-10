import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import BackgroundVideo from '@/components/BackgroundVideo';
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
      <body className="min-h-screen antialiased bg-[#050505] text-[#e5e5e5] selection:bg-green-500/30">
        <BackgroundVideo />
        <Header />
        <NavBar />
        <main className="relative z-10 w-full min-h-screen pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
