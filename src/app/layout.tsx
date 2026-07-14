import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'RINK Technology Transfer Portal | Research Innovation Network Kerala',
  description:
    'Connecting Research • Innovation • Commercialization. Discover and license commercializable technologies developed by Kerala research institutions.',
  keywords: 'Kerala startup, research technology, technology transfer, KSUM, RINK, CTCRI, CPCRI, NIIST, commercialization, innovation',
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
    title: 'RINK Technology Transfer Portal',
    description: 'Connecting Research • Innovation • Commercialization — Kerala Startup Mission',
    type: 'website',
  },
};

export const revalidate = 60;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="flex flex-col min-h-screen bg-background text-text-primary relative pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
