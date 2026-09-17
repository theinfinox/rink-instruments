import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, ExternalLink, Phone } from 'lucide-react';

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

            <div className="flex items-start gap-2.5 mt-3">
              <Phone className="w-4 h-4 text-[#0A2164] mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm font-semibold text-[#0A2164] font-sans flex flex-col gap-1">
                <a href="tel:08047180470" className="hover:underline py-0.5">08047180470</a>
                <a href="tel:0471-2700270" className="hover:underline py-0.5">0471-2700270</a>
              </div>
            </div>

            <div className="flex flex-row gap-4 items-center mt-5">
              <a href="https://www.linkedin.com/company/research-innovation-network-kerala/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#0A2164] transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M8 11v5"></path><path d="M8 8v.01"></path><path d="M12 16v-5"></path><path d="M16 16v-3a2 2 0 1 0 -4 0"></path><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z"></path>
                </svg>
              </a>
              <a href="https://www.facebook.com/keralastartupmission" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#0A2164] transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://x.com/startup_mission" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#0A2164] transition-colors" aria-label="X (Twitter)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 3H21l-6.6 7.513L22 21h-6.933l-4.533-5.487L5.6 21H3l7.066-8.044L2 3h7l4.067 4.933L18.244 3zM16.6 19h1.8L7.4 5H5.6l11 14z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Copyright Strip (Clearance for mobile bottom nav) ── */}
      <div className="border-t border-slate-200 bg-slate-50/50 pb-24 md:pb-5 pt-4 sm:pt-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-sans text-center sm:text-left">
          <p className="leading-relaxed">
            <span className="block sm:inline">© 2026 Research Innovation Network Kerala (RINK).</span>{' '}
            <span className="block sm:inline mt-0.5 sm:mt-0 text-slate-400 sm:text-inherit">An initiative of Kerala Startup Mission.</span>
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

