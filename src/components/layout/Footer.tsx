import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, ExternalLink } from 'lucide-react';

const EXPLORE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Instruments', href: '/instruments' },
  { label: 'Services', href: '/services' },
  { label: 'Institutions', href: '/#institutions' },
  { label: 'Startups', href: '/#startups' },
  { label: 'Districts', href: '/services#districts' },
  { label: 'About RINK', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 divide-y divide-slate-100 md:divide-y-0">

          {/* ── Left: Logo & Overview ── */}
          <div className="flex flex-col justify-start">
            <Link href="/" className="relative h-10 w-44 sm:h-12 sm:w-56 flex-shrink-0 mb-3 block" aria-label="RINK Home">
              <Image
                src="/images/rink_logo.png"
                alt="Research Innovation Network Kerala"
                fill
                className="object-contain object-left"
              />
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed font-sans mb-4 max-w-md">
              Research Innovation Network Kerala (RINK) is an initiative by Kerala Startup Mission connecting research institutions with startups to commercialize deep-tech innovation.
            </p>
            <div>
              <a
                href="https://rink.startupmission.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50/80 text-xs font-semibold text-[#0A2164] hover:bg-blue-100/80 transition-colors border border-blue-200/60 font-sans group shadow-2xs"
              >
                <span>Visit Official RINK Portal</span>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-[#0A2164] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* ── Center: Navigation Directory (Clean 2-col on mobile & tablet) ── */}
          <div className="pt-6 md:pt-0 md:px-6 md:border-x md:border-slate-200">
            <h4 className="font-serif text-sm sm:text-base font-bold text-slate-900 mb-3.5">
              Explore
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-x-8">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-slate-600 hover:text-[#0A2164] transition-colors font-sans block py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="col-span-2 pt-2 mt-1 border-t border-slate-100">
                <a
                  href="https://rink.startupmission.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0A2164] hover:underline transition-colors font-sans group py-1"
                >
                  <span>Official Page of RINK</span>
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-[#0A2164] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* ── Right: Contact ── */}
          <div className="pt-6 md:pt-0">
            <h4 className="font-serif text-sm sm:text-base font-bold text-slate-900 mb-3.5">
              For more details
            </h4>
            <div className="flex items-start gap-2.5 mb-3">
              <MapPin className="w-4 h-4 text-[#0A2164] mt-0.5 flex-shrink-0" />
              <address className="not-italic text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                Kerala Startup Mission, G3B, Thejaswini,
                Technopark Campus, Kariyavattom,
                Thiruvananthapuram, Kerala
              </address>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#0A2164] flex-shrink-0" />
              <a
                href="mailto:rink@startupmission.in"
                className="text-xs sm:text-sm font-semibold text-[#0A2164] hover:underline font-sans py-1"
              >
                rink@startupmission.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Copyright Strip (Clearance for mobile bottom nav) ── */}
      <div className="border-t border-slate-200 bg-slate-50/50 pb-24 md:pb-5 pt-4 sm:pt-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-sans text-center sm:text-left">
          <p className="leading-relaxed">
            © 2026 Research Innovation Network Kerala (RINK). An initiative of Kerala Startup Mission.
          </p>
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              href="/privacy"
              className="text-slate-600 hover:text-[#0A2164] transition-colors underline-offset-4 hover:underline font-medium py-1 px-2"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

