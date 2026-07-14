import type { Metadata } from 'next';
import { MapPin, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact RINK | Research Innovation Network Kerala',
  description:
    'Contact the RINK Technology Transfer Portal — an initiative of Research Innovation Network Kerala (RINK) under Kerala Startup Mission (KSUM).',
};

export default function ContactPage() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Left Column — About & Contact Info */}
        <div className="bg-white lg:bg-transparent lg: rounded-md">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#0A2164] mb-6">
            Contact RINK
          </h1>

          <p className="font-sans text-slate-700 leading-relaxed mb-4 max-w-xl">
            The RINK Technology Transfer Portal, an initiative of Research Innovation Network Kerala (RINK)
            under Kerala Startup Mission (KSUM), showcases commercially viable technologies from Kerala&apos;s
            leading research institutions.
          </p>

          <a
            href="https://rink.startupmission.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0A2164] border border-[#0A2164] px-6 py-2 rounded-md inline-block mt-4 mb-10 font-sans font-semibold hover:bg-[#0A2164] hover:text-white transition-colors"
          >
            Learn More
          </a>

          {/* Contact details */}
          <div className="space-y-5">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[#0A2164] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-sans font-bold text-slate-900 mb-1">Kerala Startup Mission — Head Office</div>
                <address className="not-italic font-sans text-slate-700 leading-relaxed">
                  G3B, Thejaswini, Technopark Campus, Kariyavattom,
                  Thiruvananthapuram, Kerala 695581
                </address>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-[#0A2164] flex-shrink-0 mt-0.5" />
              <a
                href="mailto:rink@startupmission.in"
                className="font-sans text-[#0A2164] font-semibold hover:underline leading-relaxed"
              >
                rink@startupmission.in
              </a>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-[#0A2164] flex-shrink-0 mt-0.5" />
              <div className="font-sans text-slate-700 leading-relaxed">
                <a href="tel:08047180470" className="hover:text-[#0A2164] hover:underline block">080 4718 0470</a>
                <a href="tel:04712700270" className="hover:text-[#0A2164] hover:underline block">0471-2700270</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Google Maps */}
        <div className="w-full h-full min-h-[450px] rounded-md border border-slate-200 overflow-hidden shadow-sm">
          <iframe
            src="https://www.google.com/maps?q=Kerala%20Startup%20Mission,%20Thejaswini,%20Technopark%20Campus,%20Thiruvananthapuram&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Kerala Startup Mission location"
            className="w-full h-full min-h-[450px]"
          />
        </div>

      </div>
    </section>
  );
}
