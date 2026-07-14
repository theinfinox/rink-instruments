import Link from 'next/link';
import { Mail, MapPin, ArrowRight } from 'lucide-react';

// Inline LinkedIn SVG (lucide-react version may not include it)
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/Kerala+Startup+Mission/@8.5565655,76.8819826,17z/';
const LINKEDIN_URL = 'https://www.linkedin.com/company/research-innovation-network-kerala/';

export default function ConnectWithRINK() {
  return (
    <section className="relative py-20 bg-white overflow-hidden border-b border-gray-100">
      {/* Subtle blueprint network backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center">
        <svg viewBox="0 0 1000 400" fill="none" className="w-full h-full text-[#0A2164]" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="1" />
          <circle cx="800" cy="200" r="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="800" cy="200" r="50" stroke="currentColor" strokeWidth="1" />
          <line x1="320" y1="200" x2="700" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="8 4" />
          <circle cx="500" cy="200" r="8" fill="currentColor" />
          <circle cx="200" cy="200" r="5" fill="currentColor" />
          <circle cx="800" cy="200" r="5" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section label */}
        <div className="text-xs font-bold text-[#0A2164] uppercase tracking-widest mb-4 text-center">
          Connect With RINK
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 text-center mb-4">
          Connect With Kerala&apos;s Research Ecosystem
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 leading-relaxed max-w-2xl mx-auto mb-14 text-sm sm:text-base font-sans">
          Research Innovation Network Kerala (RINK) connects startups, industry, investors, and
          innovators with Kerala&apos;s leading research and academic institutions. Explore technologies,
          discover institutional expertise, and engage with Kerala&apos;s innovation ecosystem.
        </p>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left: Action Cards */}
          <div className="flex flex-col gap-4">
            {/* Contact Us */}
            <a
              href="mailto:rink@startupmission.in"
              className="group flex items-center gap-5 p-5 bg-white rounded-md border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200"
              id="connect-contact-link"
            >
              <div className="w-12 h-12 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0A2164] transition-colors duration-200">
                <Mail className="w-5 h-5 text-[#0A2164] group-hover:text-white transition-colors duration-200" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900 mb-0.5 font-heading">Contact Us</div>
                <div className="text-xs text-gray-500 font-sans">Reach the RINK team for technology licensing, partnerships, and collaborations</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0A2164] group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
            </a>

            {/* View Location */}
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 p-5 bg-white rounded-md border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200"
              id="connect-location-link"
            >
              <div className="w-12 h-12 rounded-md bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-colors duration-200">
                <MapPin className="w-5 h-5 text-green-600 group-hover:text-white transition-colors duration-200" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900 mb-0.5 font-heading">View Location</div>
                <div className="text-xs text-gray-500 font-sans leading-relaxed">
                  Kerala Startup Mission · G3B, Thejaswini, Technopark Campus<br />
                  Kariyavattom, Thiruvananthapuram, Kerala 695581
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
            </a>

            {/* LinkedIn */}
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 p-5 bg-white rounded-md border border-gray-100 shadow-sm hover:shadow-md hover:border-[#0A66C2]/30 transition-all duration-200"
              id="connect-linkedin-link"
            >
              <div className="w-12 h-12 rounded-md bg-[#EFF6FF] border border-[#0A66C2]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0A66C2] transition-colors duration-200">
              <LinkedInIcon className="w-5 h-5 text-[#0A66C2] group-hover:text-white transition-colors duration-200" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900 mb-0.5 font-heading">Follow on LinkedIn</div>
                <div className="text-xs text-gray-500 font-sans">Stay updated on new technologies, partnerships, and RINK announcements</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0A66C2] group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
            </a>
          </div>

          {/* Right: Map + Address Card */}
          <div className="rounded-md overflow-hidden border border-gray-100 shadow-sm h-full min-h-[340px] flex flex-col">
            {/* Embedded map iframe */}
            <div className="flex-1 relative">
              <iframe
                title="Kerala Startup Mission Location"
                src="https://maps.google.com/maps?q=Kerala+Startup+Mission,+G3B,+Thejaswini,+Technopark+Campus,+Thiruvananthapuram&output=embed&z=16"
                width="100%"
                height="100%"
                className="absolute inset-0 w-full h-full min-h-[240px]"
                style={{ border: 0, minHeight: '240px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Address strip */}
            <div className="bg-gray-50 border-t border-gray-100 px-5 py-4 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#0A2164] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-gray-900 mb-0.5">Kerala Startup Mission</div>
                <div className="text-xs text-gray-500 leading-relaxed font-sans">
                  G3B, Thejaswini, Technopark Campus<br />
                  Kariyavattom, Thiruvananthapuram, Kerala 695581
                </div>
              </div>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex-shrink-0 text-[11px] font-bold text-[#0A2164] hover:text-[#081A52] transition-colors whitespace-nowrap"
              >
                Open Maps →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-12 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-gray-900 font-heading mb-1">Ready to commercialize a technology?</div>
            <div className="text-xs text-gray-500 font-sans">Browse all technologies and connect with the right institution.</div>
          </div>
          <Link
            href="/technologies"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#0A2164] text-white font-bold text-sm hover:bg-[#081A52] transition-colors font-heading shadow-sm"
            id="connect-browse-btn"
          >
            Browse Technologies <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
