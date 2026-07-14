'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { House, Building2, LayoutGrid, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const NAV_LINKS = [
  { label: 'Home',          href: '/',               icon: House },
  { label: 'Institutions',  href: '/#institutions',  icon: Building2 },
  { label: 'Sectors',       href: '/#sectors',       icon: LayoutGrid },
  { label: 'Contact',       href: '/contact',        icon: Phone },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      {/* ── TOP NAVIGATION BAR ── */}
      <nav
        className={clsx(
          'sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-shadow duration-300',
          scrolled && 'shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center flex-shrink-0 select-none" id="navbar-logo">
              <div className="relative h-10 sm:h-12 w-48 sm:w-60">
                <Image
                  src="/images/rink_logo.png"
                  alt="Research Innovation Network Kerala"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 font-sans',
                      pathname === link.href
                        ? 'text-[#0A2164] bg-blue-50'
                        : 'text-gray-600 hover:text-[#0A2164] hover:bg-blue-50'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/technologies"
                className="ml-1 px-4 py-2 text-sm font-semibold rounded-lg bg-[#0A2164] text-white hover:bg-[#081A52] transition-colors duration-150 font-heading"
              >
                Browse Technologies
              </Link>
              
            </div>

            {/* ── Mobile actions ── */}
            <div className="flex items-center gap-2 md:hidden">
              
              <Link
                href="/technologies"
                className="px-3 py-2 text-xs font-bold rounded-lg bg-[#0A2164] text-white hover:bg-[#081A52] transition-colors font-heading"
              >
                Browse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-stretch">
          {NAV_LINKS.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label}
                className={clsx(
                  'flex flex-col items-center justify-center flex-1 gap-1 py-3 min-h-[64px] transition-all duration-200 select-none relative',
                  isActive
                    ? 'text-[#0A2164]'
                    : 'text-gray-500 hover:text-[#0A2164]'
                )}
              >
                {isActive && (
                  <span className="absolute top-0 inset-x-4 h-1 bg-[#0A2164] rounded-b-md shadow-[0_2px_8px_rgba(10,33,100,0.4)]" />
                )}
                <Icon
                  className={clsx(
                    'w-6 h-6 transition-all duration-200 mt-1',
                    isActive && 'scale-110'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={clsx(
                  'text-[11px] font-bold tracking-wide transition-colors',
                  isActive ? 'text-[#0A2164]' : 'text-gray-500'
                )}>
                  {link.label}
                </span>
              </Link>
            );
          })}

          {/* Technologies shortcut */}
          <Link
            href="/technologies"
            aria-label="Browse Technologies"
            className={clsx(
              'flex flex-col items-center justify-center flex-1 gap-1 py-3 min-h-[64px] transition-all duration-200 select-none relative',
              pathname.startsWith('/technologies')
                ? 'text-[#0A2164]'
                : 'text-gray-500 hover:text-[#0A2164]'
            )}
          >
            {pathname.startsWith('/technologies') && (
              <span className="absolute top-0 inset-x-4 h-1 bg-[#0A2164] rounded-b-md shadow-[0_2px_8px_rgba(10,33,100,0.4)]" />
            )}
            <svg
              className={clsx(
                'w-6 h-6 mt-1 transition-all duration-200',
                pathname.startsWith('/technologies') && 'scale-110'
              )}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={pathname.startsWith('/technologies') ? 2.5 : 2}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9h6M9 13h6M9 17h4" />
            </svg>
            <span className={clsx(
              'text-[11px] font-bold tracking-wide',
              pathname.startsWith('/technologies') ? 'text-[#0A2164]' : 'text-gray-500'
            )}>
              Technologies
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
