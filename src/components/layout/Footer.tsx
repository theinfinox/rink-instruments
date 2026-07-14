import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Institutions', href: '/#institutions' },
  { label: 'Browse Technologies', href: '/technologies' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* ── Left: Logo ── */}
          <div className="flex items-center">
            <div className="relative h-12 w-48 sm:w-60 flex-shrink-0">
              <Image
                src="/images/rink_logo.png"
                alt="Research Innovation Network Kerala"
                fill
                className="object-contain object-left"
              />
            </div>
          </div>

          {/* ── Center: Navigation Directory ── */}
          <div className="md:px-6 md:border-x md:border-slate-200">
            <h4 className="font-serif text-base font-bold text-slate-900 mb-4">
              Explore
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-[#0A2164] transition-colors font-sans"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: Contact ── */}
          <div>
            <h4 className="font-serif text-base font-bold text-slate-900 mb-4">
              For more details
            </h4>
            <div className="flex items-start gap-2.5 mb-3">
              <MapPin className="w-4 h-4 text-[#0A2164] mt-0.5 flex-shrink-0" />
              <address className="not-italic text-sm text-slate-600 leading-relaxed font-sans">
                Kerala Startup Mission, G3B, Thejaswini,
                Technopark Campus, Kariyavattom,
                Thiruvananthapuram, Kerala
              </address>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#0A2164] flex-shrink-0" />
              <a
                href="mailto:rink@startupmission.in"
                className="text-sm font-semibold text-[#0A2164] hover:underline font-sans"
              >
                rink@startupmission.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Copyright Strip ── */}
      <div className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <p className="text-xs text-slate-500 text-center font-sans">
            © 2026 Research Innovation Network Kerala (RINK). An initiative of Kerala Startup Mission.
          </p>
        </div>
      </div>
    </footer>
  );
}
