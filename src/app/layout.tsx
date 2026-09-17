import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NextTopLoader from 'nextjs-toploader';
import CommandPalette from '@/components/ui/CommandPalette';

import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || 'instruments.startupmission.in';
  const protocol = headersList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: 'RINK Instruments and Services Portal | Research Innovation Network Kerala',
    description:
      'Discover and license instruments and services from Kerala’s leading research institutions and startups — Kerala Startup Mission.',
    keywords: 'Kerala startup, research technology, KSUM, RINK, CTCRI, CPCRI, NIIST',
    icons: {
      icon: [
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon.ico', sizes: 'any' }
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ]
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title: 'RINK Instruments and Services Portal',
      description: 'Connecting Research • Innovation • Commercialization — Kerala Startup Mission',
      type: 'website',
    },
  };
}

export const revalidate = 60;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${plusJakartaSans.variable} ${playfairDisplay.variable}`}>
      <head>
      </head>
      <body suppressHydrationWarning className="flex flex-col min-h-screen bg-background text-text-primary relative pt-16">
        <NextTopLoader color="#2563eb" showSpinner={false} />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <CommandPalette />
      </body>
    </html>
  );
}
