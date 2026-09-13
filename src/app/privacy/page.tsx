import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, Globe, Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | RINK — Research Innovation Network Kerala',
  description:
    'Privacy Policy for the Research Innovation Network Kerala (RINK) Instruments and Services Portal, an initiative of Kerala Startup Mission (KSUM).',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen text-slate-900">
      {/* ── Hero Banner ── */}
      <div
        className="border-b border-gray-100 py-16"
        style={{ background: 'linear-gradient(135deg, #F0F6FF 0%, #EEF4FF 40%, #F8FAFF 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 justify-center font-sans" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#0A2164] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Privacy Policy</span>
          </nav>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-[#0A2164] mb-4 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Legal &amp; Data Governance
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-black text-gray-900 mb-3 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base max-w-2xl mx-auto font-sans">
            Research Innovation Network Kerala (RINK) · Kerala Startup Mission (KSUM)
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Last Updated: September 2026
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-10 space-y-10">

          {/* Section 1: Overview */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#0A2164]">
              <FileText className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-xl font-heading font-bold text-slate-900">1. Overview &amp; Scope</h2>
            </div>
            <p className="text-slate-600 leading-relaxed font-sans text-sm sm:text-[15px]">
              The <strong>Research Innovation Network Kerala (RINK) Instruments and Services Portal</strong> is an initiative 
              spearheaded by the <strong>Kerala Startup Mission (KSUM)</strong>, Government of Kerala. This portal serves as a public catalog 
              and discovery platform to bridge Kerala&apos;s premier research institutions, universities, and innovative startups with entrepreneurs, 
              researchers, and industrial partners.
            </p>
            <p className="text-slate-600 leading-relaxed font-sans text-sm sm:text-[15px]">
              This Privacy Policy explains how information is collected, used, and safeguarded when you access, browse, or interact with 
              our portal located at this domain.
            </p>
          </section>

          {/* Section 2: Information Collection */}
          <section className="space-y-3 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2.5 text-[#0A2164]">
              <Eye className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-xl font-heading font-bold text-slate-900">2. Information We Collect</h2>
            </div>
            <div className="space-y-3 text-slate-600 leading-relaxed font-sans text-sm sm:text-[15px]">
              <p>We believe in minimal data collection. We may gather information in the following contexts:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Public Directory Information:</strong> Equipment specifications, laboratory capabilities, pricing schedules, 
                  institutional affiliations, and startup service descriptions displayed on the portal are sourced from publicly available records, 
                  formal institutional submissions, or official MoU disclosures.
                </li>
                <li>
                  <strong>Direct Inquiries:</strong> If you contact us directly via email (e.g., at <a href="mailto:rink@startupmission.in" className="text-blue-600 hover:underline">rink@startupmission.in</a>) 
                  or reach out to listed institution contacts, we retain your message and contact details solely to respond to your inquiry and coordinate access requests.
                </li>
                <li>
                  <strong>Usage &amp; Performance Telemetry:</strong> Like most web applications, our servers and hosting platforms may log non-personally identifiable 
                  information such as browser type, operating system, referring URL, pages visited, and timestamps to monitor platform uptime, diagnose technical issues, 
                  and optimize site responsiveness.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: How Information is Used */}
          <section className="space-y-3 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2.5 text-[#0A2164]">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-xl font-heading font-bold text-slate-900">3. How We Use Information</h2>
            </div>
            <p className="text-slate-600 leading-relaxed font-sans text-sm sm:text-[15px]">
              Collected information is utilized strictly to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 font-sans text-sm sm:text-[15px]">
              <li>Facilitate discovery and commercialization connections between research institutions and startups.</li>
              <li>Maintain, update, and improve the searchability and filtering of instrumentation and service datasets.</li>
              <li>Comply with applicable administrative, governance, or statutory requirements of the Government of Kerala.</li>
            </ul>
            <p className="text-slate-600 leading-relaxed font-sans text-sm sm:text-[15px] mt-2">
              <strong>We do not sell, rent, or trade your personal information</strong> to any third parties for advertising or marketing purposes.
            </p>
          </section>

          {/* Section 4: Third-Party Links & External Platforms */}
          <section className="space-y-3 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2.5 text-[#0A2164]">
              <Globe className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-xl font-heading font-bold text-slate-900">4. Third-Party Websites &amp; Booking Portals</h2>
            </div>
            <p className="text-slate-600 leading-relaxed font-sans text-sm sm:text-[15px]">
              The RINK portal frequently provides external links to partner research institutions (such as STIC CUSAT, IISER TVM, IIT Palakkad), 
              individual startup websites, and official booking engines. When you navigate via external links (e.g. &ldquo;Visit Website&rdquo; or &ldquo;Booking link&rdquo;), 
              you leave the RINK portal and become subject to the respective third party&apos;s privacy policies and terms of service. 
              We encourage you to review their policies directly.
            </p>
          </section>

          {/* Section 5: Data Security */}
          <section className="space-y-3 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2.5 text-[#0A2164]">
              <Lock className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-xl font-heading font-bold text-slate-900">5. Data Security &amp; Protection</h2>
            </div>
            <p className="text-slate-600 leading-relaxed font-sans text-sm sm:text-[15px]">
              Kerala Startup Mission implements appropriate administrative and technical safeguards designed to protect the integrity 
              of platform infrastructure and prevent unauthorized disclosure, tampering, or loss of information. Communications are transmitted 
              over secure HTTPS encryption protocols.
            </p>
          </section>

          {/* Section 6: Policy Updates */}
          <section className="space-y-3 border-t border-slate-100 pt-8">
            <h2 className="text-xl font-heading font-bold text-slate-900">6. Updates to this Policy</h2>
            <p className="text-slate-600 leading-relaxed font-sans text-sm sm:text-[15px]">
              We may update this Privacy Policy from time to time to align with platform enhancements, operational changes, or statutory requirements. 
              Any revisions will be published on this page with an updated &ldquo;Last Updated&rdquo; timestamp. Continued use of the portal after such modifications 
              constitutes your acceptance of the revised policy.
            </p>
          </section>

          {/* Section 7: Contact Us */}
          <section className="border-t border-slate-100 pt-8 bg-slate-50/60 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6 sm:p-10 rounded-b-2xl">
            <h2 className="text-lg font-heading font-bold text-slate-900 mb-2">7. Contact &amp; Grievance Redressal</h2>
            <p className="text-slate-600 leading-relaxed font-sans text-sm mb-4">
              If you have any questions, suggestions, or data inquiries regarding this Privacy Policy, please contact the RINK Secretariat:
            </p>
            <div className="space-y-2 text-sm text-slate-700 font-sans">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0A2164] mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Kerala Startup Mission (KSUM)</strong><br />
                  G3B, Thejaswini, Technopark Campus, Kariyavattom,<br />
                  Thiruvananthapuram, Kerala 695581
                </span>
              </div>
              <div className="flex items-center gap-2.5 pt-2">
                <Mail className="w-4 h-4 text-[#0A2164] flex-shrink-0" />
                <span>
                  Email:{' '}
                  <a href="mailto:rink@startupmission.in" className="text-blue-600 hover:underline font-semibold">
                    rink@startupmission.in
                  </a>
                </span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
