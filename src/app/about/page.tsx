import type { Metadata } from 'next';
import Link from 'next/link';
import { Target, Users, Building2, ArrowRight, Globe, MapPin, Phone, Mail, Lightbulb } from 'lucide-react';
import PartnerLogoWall from '@/components/ui/PartnerLogoWall';

export const metadata: Metadata = {
  title: 'About RINK | Kerala Startup Mission | Instruments and Services Portal',
  description: 'Learn about RINK — Research Innovation Network Kerala — Kerala Startup Mission\'s initiative connecting research institutions with startups for technology commercialization.',
};

// Inline LinkedIn SVG (lucide-react missing this icon)
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default async function AboutPage() {

  return (
    <div className="bg-white min-h-screen text-gray-900">

      {/* ── Hero ────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 py-16" style={{ background: 'linear-gradient(135deg, #F0F6FF 0%, #EEF4FF 40%, #F8FAFF 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 justify-center font-sans">
            <Link href="/" className="hover:text-[#0A2164] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">About</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-[#0A2164] mb-5">
            <Lightbulb className="w-3.5 h-3.5" />
            About RINK Instruments and Services Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-gray-900 mb-4">
            Bridging Research &amp; Entrepreneurship
          </h1>
          <p className="text-gray-600 leading-relaxed text-base max-w-2xl mx-auto font-sans">
            RINK Instruments and Services Portal is a sub-portal of the Research Innovation Network Kerala (RINK),
            an initiative by the Kerala Startup Mission (KSUM) to connect research institutions
            with startup founders and entrepreneurs.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">

        {/* ── Who It's For ─────────────────────────────────── */}
        <div>
          <div className="mb-6">
            <div className="text-xs font-bold text-[#0A2164] uppercase tracking-widest mb-2">Who Is This For?</div>
            <h2 className="text-2xl font-heading font-bold text-gray-900">Built for the Innovation Ecosystem</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Target, label: 'Startup Founders', desc: 'Find technologies ready for commercialization', color: '#0A2164' },
              { icon: Users, label: 'Student Entrepreneurs', desc: 'Identify research-based startup ideas', color: '#0284C7' },
              { icon: Building2, label: 'MSMEs & Industries', desc: 'License technologies to improve products', color: '#7C3AED' },
              { icon: Globe, label: 'Incubators & Investors', desc: 'Discover research-backed startups', color: '#EA580C' },
            ].map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="bg-gray-50 rounded-md border border-gray-100 p-5 text-center">
                <div className="w-11 h-11 rounded-md mx-auto mb-3 flex items-center justify-center bg-white border border-gray-100 shadow-sm">
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-heading font-bold text-gray-800 text-sm mb-1">{label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── About KSUM / RINK ────────────────────────────── */}
        <div className="bg-[#F8FAFF] rounded-md border border-gray-100 p-8">
          <h2 className="font-heading font-bold text-gray-900 text-2xl mb-6">About Kerala Startup Mission &amp; RINK</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#0A2164] mb-2 text-sm">Kerala Startup Mission (KSUM)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                KSUM is the nodal agency of the Government of Kerala for entrepreneurship development
                and incubation activities in the state. KSUM provides support to startups through
                funding, mentoring, incubation, and market access programs.
              </p>
              <a href="https://startupmission.in" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#0A2164] font-semibold mt-3 hover:underline">
                startupmission.in <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-[#0A2164] mb-2 text-sm">Research Innovation Network Kerala (RINK)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                RINK is KSUM&apos;s initiative to create a strong research-startup linkage ecosystem
                in Kerala. It connects research institutions with startup founders, facilitates
                technology transfer, and promotes commercialization of research innovations.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ── Partner Institutions Logo Wall ───────────────────── */}
      <PartnerLogoWall />

      {/* ── Connect With RINK ─────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-[#0A2164] uppercase tracking-widest mb-3">Contact RINK</div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3">
              Connect With Kerala&apos;s Research Ecosystem
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto font-sans leading-relaxed">
              Research Innovation Network Kerala (RINK) connects startups, industry, investors and innovators
              with Kerala&apos;s leading research and academic institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

            {/* Contact Details */}
            <div className="space-y-6">
              {/* Office */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#0A2164]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Office Address</div>
                  <div className="text-sm font-semibold text-gray-900 leading-relaxed font-sans">
                    Kerala Startup Mission<br />
                    G3B, Thejaswini, Technopark Campus<br />
                    Kariyavattom, Thiruvananthapuram<br />
                    Kerala 695581
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#0A2164]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</div>
                  <a href="tel:+914712971190" className="text-sm font-semibold text-gray-900 hover:text-[#0A2164] transition-colors">+91-471-2971190</a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#0A2164]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</div>
                  <a href="mailto:info@startupmission.in" className="text-sm font-semibold text-gray-900 hover:text-[#0A2164] transition-colors">info@startupmission.in</a>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-[#0A2164]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Website</div>
                  <a href="https://startupmission.in" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-900 hover:text-[#0A2164] transition-colors">startupmission.in</a>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://www.google.com/maps/place/Kerala+Startup+Mission/@8.5565655,76.8819826,17z/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#0A2164] text-white text-xs font-bold hover:bg-[#081A52] transition-colors font-heading"
                >
                  <MapPin className="w-3.5 h-3.5" /> View on Maps
                </a>
                <a
                  href="https://www.linkedin.com/company/research-innovation-network-kerala/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#0A66C2] text-white text-xs font-bold hover:bg-[#084fa0] transition-colors font-heading"
                >
                  <LinkedInIcon className="w-3.5 h-3.5" /> LinkedIn
                </a>
                <a
                  href="mailto:info@startupmission.in"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:border-blue-300 hover:text-[#0A2164] transition-colors font-heading"
                >
                  <Mail className="w-3.5 h-3.5" /> Email Us
                </a>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-md overflow-hidden border border-gray-100 shadow-sm aspect-[4/3] bg-gray-50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.703258765629!2d76.8819826!3d8.5565655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bef4fded0dd1%3A0x2c30e3e4ff1b9a68!2sKerala%20Startup%20Mission!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kerala Startup Mission location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Locations ─────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0A2164] text-center mb-4">
            Our Locations
          </h2>
          <p className="font-sans text-slate-700 leading-relaxed text-center mb-12 max-w-4xl mx-auto">
            Kerala Startup Mission is having its incubation centers and associated incubators all over
            Kerala. Our main head office is located at Technopark Thiruvananthapuram. Other than incubation
            facility and meet up spaces, Fab Lab, Future Lab etc are also operating under Kerala Startup Mission.
          </p>

          <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3">
            {/* Left — Map Embed */}
            <div className="lg:col-span-2">
              <iframe
                src="https://www.google.com/maps?q=Kerala%20Startup%20Mission,%20Thejaswini,%20Technopark%20Campus,%20Thiruvananthapuram&output=embed"
                className="w-full h-full min-h-[350px] lg:min-h-[400px] border-none"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kerala Startup Mission - Head Office location"
              />
            </div>

            {/* Right — Contact Details */}
            <div className="lg:col-span-1 p-8 lg:p-10 flex flex-col justify-center bg-white border-t lg:border-t-0 lg:border-l border-slate-200">
              <h3 className="font-sans font-bold text-lg text-slate-900 mb-6">
                Kerala Startup Mission - Head Office
              </h3>
              <div className="space-y-5">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#0A2164] flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-slate-700 leading-relaxed">
                    G3B, Thejaswini, Technopark Campus, Kariyavattom, Trivandrum, Kerala 695581
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#0A2164] flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-slate-700 leading-relaxed">08047180470</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#0A2164] flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-slate-700 leading-relaxed">0471-2700270</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
