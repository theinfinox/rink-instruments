'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Search, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Filter, 
  ShieldCheck, 
  Image as ImageIcon, 
  Split, 
  PlusCircle, 
  Zap, 
  Bot, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink,
  Code2,
  TableProperties,
  ArrowRight
} from 'lucide-react';

// ── Code Snippet Component with Copy Button ────────────────────────────────────
function CodeBlock({ code, language = 'yaml', title }: { code: string; language?: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-gray-800 bg-[#161622] shadow-xl">
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e1e2e] border-b border-gray-800 text-xs font-mono text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            <span className="ml-2 text-gray-400">{title}</span>
          </div>
          <span className="text-gray-500 text-[11px] uppercase tracking-wider">{language}</span>
        </div>
      )}
      <div className="relative p-4">
        <button
          type="button"
          onClick={handleCopy}
          className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-500 text-white shadow-md'
              : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'
          }`}
        >
          {copied ? (
            <>
              <Check size={13} /> Copied!
            </>
          ) : (
            <>
              <Copy size={13} /> Copy Code
            </>
          )}
        </button>
        <pre className="text-sm font-mono text-emerald-400 overflow-x-auto leading-relaxed pr-24">
          {code}
        </pre>
      </div>
    </div>
  );
}

// ── Visual Callout Component ──────────────────────────────────────────────────
function Callout({ 
  type = 'note', 
  title, 
  children 
}: { 
  type?: 'note' | 'tip' | 'warning' | 'purple'; 
  title?: string; 
  children: React.ReactNode 
}) {
  const styles = {
    note: 'bg-blue-50 border-blue-200 text-blue-900',
    tip: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900'
  };

  const badgeStyles = {
    note: 'bg-blue-200 text-blue-800',
    tip: 'bg-emerald-200 text-emerald-800',
    warning: 'bg-amber-200 text-amber-800',
    purple: 'bg-purple-200 text-purple-800'
  };

  return (
    <div className={`p-4 my-4 rounded-xl border ${styles[type]} shadow-xs`}>
      {title && (
        <div className="flex items-center gap-2 mb-1.5 font-bold text-sm">
          <span className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider ${badgeStyles[type]}`}>
            {type}
          </span>
          <span>{title}</span>
        </div>
      )}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

// ── Table of Contents Structure ───────────────────────────────────────────────
const TOC_SECTIONS = [
  { id: 'quick-start', label: '1. Quick Start & Workflow', icon: Sparkles },
  { id: 'sheets-and-tabs', label: '2. Sheets & Tabs Essentials', icon: Layers },
  { id: 'sanitization', label: '3. Row & Column Sanitization', icon: ShieldCheck },
  { id: 'transformations', label: '4. Transformations & Media', icon: Split },
  { id: 'merge-sources', label: '5. External Merge Sources (Forms)', icon: PlusCircle },
  { id: 'filter-taxonomy', label: '6. Dynamic Filter Taxonomy', icon: Filter },
  { id: 'web-ai-search', label: '7. Web AI & Search Indexing', icon: Bot },
  { id: 'master-template', label: '8. Master Reference Template', icon: Code2 },
  { id: 'faqs', label: '9. Troubleshooting & FAQs', icon: BookOpen },
];

export default function YamlBuilderDocsPage() {
  const [activeSection, setActiveSection] = useState('quick-start');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Track scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      // Section intersection detection
      const sectionElements = TOC_SECTIONS.map(s => document.getElementById(s.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(TOC_SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredToc = TOC_SECTIONS.filter(s =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* ⚡ Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* 🧭 Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/yaml-builder"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-gray-200 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Visual Builder
          </Link>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              RINK YAML Config Builder Manual
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/yaml-builder"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-3.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Zap size={13} /> Open Visual Builder
          </Link>
        </div>
      </header>

      {/* 📖 Main 2-Column Documentation Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex gap-8">
        
        {/* 📚 Left Sticky Sidebar (Table of Contents) */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-20 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
            {/* Search within Docs */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics / parameters..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Navigation List */}
            <nav className="space-y-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
                Table of Contents
              </p>
              {filteredToc.map(section => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold border-l-3 border-indigo-600 shadow-xs'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                    <span className="truncate">{section.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* Quick Helper Box */}
            <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 text-xs text-indigo-900">
              <p className="font-bold flex items-center gap-1.5 text-indigo-950">
                <Sparkles size={14} className="text-indigo-600" /> Pro Tip
              </p>
              <p className="mt-1 text-indigo-700 leading-relaxed">
                Use the <strong>⚡ Fetch All Tabs & Sources</strong> button in the visual builder to auto-load all column headers directly from Google Sheets!
              </p>
            </div>
          </div>
        </aside>

        {/* 📄 Center Documentation Reader Pane */}
        <main className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-12">
          
          {/* Hero Header */}
          <div className="border-b border-gray-200 pb-6">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
              <BookOpen size={12} /> Official Developer & Editor Guide
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              RINK YAML Config Builder Manual
            </h1>
            <p className="text-base text-gray-600 mt-2 leading-relaxed">
              Complete reference and architectural manual for designing, configuring, sanitizing, and syncing Google Sheets data pipelines using <code className="bg-gray-100 text-blue-600 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">sheets.yaml</code>.
            </p>
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* SECTION 1: Quick Start */}
          {/* ──────────────────────────────────────────────────────────── */}
          <section id="quick-start" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <Sparkles className="text-blue-600" size={22} />
              1. Quick Start & Workflow
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              The <strong>RINK YAML Builder</strong> is a bidirectional visual configuration studio. It lets you visually configure ingestion pipelines, column mappings, secondary intake forms, and dynamic filter taxonomies, generating clean, production-ready <code className="text-blue-600 font-mono">sheets.yaml</code> code.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h4 className="font-bold text-sm text-blue-950">Import or Build</h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Paste your existing <code className="font-mono">sheets.yaml</code> into the text box, or click <strong>+ Add Sheet</strong> to start from scratch.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h4 className="font-bold text-sm text-indigo-950">Visual Customization</h4>
                <p className="text-xs text-indigo-800 leading-relaxed">
                  Fetch live columns, set exclusions, map secondary Google Forms, and configure multi-level taxonomy filters.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                <h4 className="font-bold text-sm text-purple-950">Export to Cron</h4>
                <p className="text-xs text-purple-800 leading-relaxed">
                  Click <strong>Copy Code</strong> and paste into <code className="font-mono">rink-git-cron/config/sheets.yaml</code> to sync automatically.
                </p>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* SECTION 2: Sheets & Tabs */}
          {/* ──────────────────────────────────────────────────────────── */}
          <section id="sheets-and-tabs" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <Layers className="text-indigo-600" size={22} />
              2. Sheets & Tabs Essentials
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every data source is declared under the <code className="font-mono text-indigo-600">sheets</code> list. A sheet contains a Google Spreadsheet ID and one or more worksheet <code className="font-mono text-indigo-600">tabs</code>.
            </p>

            <div className="overflow-hidden border border-gray-200 rounded-xl my-4">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Property</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-700">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-mono font-bold text-indigo-600">name</td>
                    <td className="px-4 py-2.5 font-mono">string</td>
                    <td className="px-4 py-2.5">Output endpoint name (e.g. <code className="font-mono">instrument</code> outputs to <code className="font-mono">/instrument.json</code>).</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-mono font-bold text-indigo-600">spreadsheetId</td>
                    <td className="px-4 py-2.5 font-mono">string</td>
                    <td className="px-4 py-2.5">The unique ID from your Google Sheets URL (<code className="font-mono">/d/SPREADSHEET_ID/edit</code>).</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-mono font-bold text-indigo-600">tabs[].name</td>
                    <td className="px-4 py-2.5 font-mono">string</td>
                    <td className="px-4 py-2.5">Exact name of the tab sheet (e.g. <code className="font-mono">Main Data</code>).</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-mono font-bold text-indigo-600">tabs[].gid</td>
                    <td className="px-4 py-2.5 font-mono">number</td>
                    <td className="px-4 py-2.5">Worksheet tab ID found at the end of the Google Sheet URL (<code className="font-mono">#gid=5695880</code>).</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Callout type="tip" title="⚡ Bulk Column Fetcher">
              Clicking <strong>⚡ Fetch All Tabs & Sources</strong> in a Sheet Card executes parallel API queries across all primary tabs and secondary merge sources, populating smart autocomplete dropdowns across the entire editor.
            </Callout>
          </section>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* SECTION 3: Row & Column Sanitization */}
          {/* ──────────────────────────────────────────────────────────── */}
          <section id="sanitization" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <ShieldCheck className="text-emerald-600" size={22} />
              3. Row & Column Sanitization
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Google Sheets often contain instructional sample rows, internal notes, or draft entries that should never leak into public APIs.
            </p>

            {/* Sanitization Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                <h4 className="font-bold text-sm text-gray-900 font-mono flex items-center gap-1.5">
                  <span className="text-blue-600">skipFirstRows</span>: N
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Ignores the first $N$ data rows immediately below the header. Essential if Row 2 contains sample/instructional placeholder text (e.g., <em>&quot;Sample: Type institution here&quot;</em>).
                </p>
                <CodeBlock 
                  title="skipFirstRows Example"
                  code={`tabs:
  - name: Main Data
    gid: 5695880
    skipFirstRows: 1  # 👈 Skips row 2 (sample data)`}
                />
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                <h4 className="font-bold text-sm text-gray-900 font-mono flex items-center gap-1.5">
                  <span className="text-emerald-600">excludeColumns</span>: [...]
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Removes sensitive or internal columns (e.g., staff notes, private emails, internal scores) from entering the compiled JSON payload.
                </p>
                <CodeBlock 
                  title="excludeColumns Example"
                  code={`excludeColumns:
  - internal_notes
  - reviewer_score
  - staff_email`}
                />
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                <h4 className="font-bold text-sm text-gray-900 font-mono flex items-center gap-1.5">
                  <span className="text-amber-600">excludeRowsWhere</span>: [...]
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Conditionally drops rows matching a key-value condition. Perfect for dropping duplicate table header rows or unapproved draft submissions.
                </p>
                <CodeBlock 
                  title="excludeRowsWhere Example"
                  code={`excludeRowsWhere:
  - column: id
    equals: id            # Drops repeated header rows
  - column: approval_status
    equals: 'Draft'       # Drops draft items`}
                />
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                <h4 className="font-bold text-sm text-gray-900 font-mono flex items-center gap-1.5">
                  <span className="text-purple-600">hierarchical_rows</span>: true
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Enables parent-child row detection. Child rows with blank leading columns automatically inherit metadata (e.g., institution name, address) from the previous row.
                </p>
                <CodeBlock 
                  title="hierarchical_rows Example"
                  code={`hierarchical_rows: true`}
                />
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* SECTION 4: Transformations & Media */}
          {/* ──────────────────────────────────────────────────────────── */}
          <section id="transformations" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <Split className="text-cyan-600" size={22} />
              4. Transformations & Media
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Transform raw text cells into structured JSON arrays and auto-convert cloud drive media into optimized WebP assets.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Split size={16} className="text-cyan-600" />
                  Array Splitting (<code className="font-mono text-cyan-700">splitColumns</code>)
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Converts comma-separated string cells (e.g. <code className="font-mono">&quot;microscope, biology, lab&quot;</code>) into native JSON arrays: <code className="font-mono">[&quot;microscope&quot;, &quot;biology&quot;, &quot;lab&quot;]</code>.
                </p>
                <CodeBlock
                  title="splitColumns Config"
                  code={`splitColumns:
  - column: tag
    delimiter: ','`}
                />
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <ImageIcon size={16} className="text-indigo-600" />
                  Google Drive Image Optimization (<code className="font-mono text-indigo-700">imageColumns</code>)
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Directs the cron engine to scan Google Drive links in specific columns, download the images, optimize them to WebP format, and generate local static asset paths (e.g., <code className="font-mono">/assets/instrument/inst_100001_image_link.webp</code>).
                </p>
                <CodeBlock
                  title="imageColumns Config"
                  code={`imageColumns:
  - image_link
  - logo_link`}
                />
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <PlusCircle size={16} className="text-emerald-600" />
                  Collision-Proof ID Generator (<code className="font-mono text-emerald-700">autoGenerateId</code>)
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Generates deterministic, sequential IDs for rows that lack an ID column.
                </p>
                <CodeBlock
                  title="autoGenerateId Config"
                  code={`autoGenerateId:
  enabled: true
  field: id
  prefix: inst
  start: 100001   # Generates inst_100001, inst_100002, etc.`}
                />
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* SECTION 5: External Merge Sources */}
          {/* ──────────────────────────────────────────────────────────── */}
          <section id="merge-sources" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <PlusCircle className="text-purple-600" size={22} />
              5. External Merge Sources (Google Forms Intake)
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong>Paradigm A (Extension / Union Mapping)</strong> allows you to append records from separate spreadsheets (like live Google Form response sheets) directly into your primary dataset at compile time.
            </p>

            {/* Architecture Card */}
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-3">
              <h4 className="font-bold text-sm text-purple-950 flex items-center gap-2">
                <ShieldCheck size={16} className="text-purple-600" />
                Key Merge Source Features
              </h4>
              <ul className="text-xs text-purple-900 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><strong><code className="font-mono">onlyIncludeMapped: true</code></strong> — Discards all raw form metadata (timestamps, emails, score) so only explicitly mapped fields enter the API.</li>
                <li><strong><code className="font-mono">columnMapping</code></strong> — Maps raw form question headers to canonical primary keys (e.g. <code className="font-mono">instrumentation_details ➔ instruments</code>).</li>
                <li><strong><code className="font-mono">defaults</code></strong> — Injects fallback tags (e.g. <code className="font-mono">source_type: intake_form</code>, <code className="font-mono">approval_status: Approved</code>).</li>
                <li><strong><code className="font-mono">autoGenerateId</code></strong> — Namespaces secondary IDs (e.g. <code className="font-mono">inst_form_200001+</code>) to prevent collisions with primary rows.</li>
              </ul>
            </div>

            <CodeBlock
              title="Full Merge Source Configuration"
              code={`mergeSources:
  - name: Intake Form Responses
    spreadsheetId: 1yECxIL-BGmUiIIfLFeZWVT1Ot_qxaeE4clITiIugHE8
    gid: 0
    hierarchical_rows: true
    onlyIncludeMapped: true              # 👈 1-click unmapped noise cleanup
    skipFirstRows: 1                     # 👈 Skips test submissions
    excludeRowsWhere:
      - column: instrumentation_details
        equals: Name of the Instrument   # 👈 Drops repeated header row
    columnMapping:
      instrumentation_details: instruments
      institution_or_startup_name: institution_name
      column_12: tag
      column_13: image_link
      column_14: specifications
    defaults:
      source_type: intake_form
      approval_status: Approved
    autoGenerateId:
      enabled: true
      field: id
      prefix: inst_form
      start: 200001                      # 👈 Distinct numbering namespace`}
            />
          </section>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* SECTION 6: Dynamic Filter Taxonomy */}
          {/* ──────────────────────────────────────────────────────────── */}
          <section id="filter-taxonomy" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <Filter className="text-indigo-600" size={22} />
              6. Dynamic Filter Taxonomy
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Eliminate hardcoded frontend filter menus! <code className="font-mono text-indigo-600">filterTaxonomy</code> cross-references live sheet data and automatically builds a structured <code className="font-mono">filters.json</code> endpoint during sync.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                <h4 className="font-bold text-sm text-gray-900">Mode 1: Direct Grouping</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Groups values in a specific column into named categories (e.g. 14 Kerala districts partitioned into 4 geographic zones).
                </p>
                <CodeBlock
                  title="Direct Taxonomy Config"
                  code={`filterTaxonomy:
  - id: standardized_district
    title: Districts
    gid: 5695880
    groups:
      South Zone:
        - Thiruvananthapuram
        - Kollam
        - Pathanamthitta
      Central Zone:
        - Ernakulam
        - Thrissur`}
                />
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                <h4 className="font-bold text-sm text-gray-900">Mode 2: Relational Cross-Tab Join</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Links main rows to a secondary lookup tab (e.g. Institution List) via a foreign key, auto-discovering categories from the lookup tab.
                </p>
                <CodeBlock
                  title="Relational Join Config"
                  code={`filterTaxonomy:
  - id: correct_provider_key
    title: Institution Type
    gid: 5695880
    linkType: join
    joinSource:
      gid: 1583764603                  # Lookup tab
      foreignKey: correct_provider_key
      groupByColumn: reason_classification
      displayColumn: institution_name
      groupByDelimiter: ','
      autoDiscover: true`}
                />
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* SECTION 7: Web AI & Search Indexing */}
          {/* ──────────────────────────────────────────────────────────── */}
          <section id="web-ai-search" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <Bot className="text-blue-600" size={22} />
              7. Web AI & Search Indexing
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Configures the Static Web AI API and AI Search integration for LLMs (ChatGPT, Claude, Gemini) and the server-side Orama search index.
            </p>

            <CodeBlock
              title="AI Search Config"
              code={`tabs:
  - name: Main Data
    gid: 5695880
    aiSearch:
      enabled: true
      titleColumns:
        - instruments
        - instruments1
      metadataColumns:
        - institution_name
        - district
        - tag`}
            />

            <Callout type="note" title="🤖 What the Cron Generates">
              When <code className="font-mono">aiSearch.enabled: true</code>, the sync engine automatically produces:
              <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                <li><code className="font-mono">public/api/[sheet]/llms.txt</code> — Machine-readable summary for AI agents.</li>
                <li><code className="font-mono">public/api/[sheet]/[id].json</code> — Standalone single-record endpoints with deep-link prompts.</li>
                <li><code className="font-mono">public/API_DIRECTORY.md</code> — Interactive API sitemap.</li>
              </ul>
            </Callout>
          </section>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* SECTION 8: Master Reference Template */}
          {/* ──────────────────────────────────────────────────────────── */}
          <section id="master-template" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <Code2 className="text-emerald-600" size={22} />
              8. Master Reference Template
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              A complete, fully annotated <code className="font-mono text-emerald-600">sheets.yaml</code> template containing all available features:
            </p>

            <CodeBlock
              title="Full Annotated sheets.yaml Template"
              code={`frontendBaseUrl: https://rink-inst.vercel.app

sheets:
  - name: instrument
    spreadsheetId: 1DMW9DfaLEMvNoL29Yvj7HR4e1SIGpn_QXvEhPdI4U8k
    tabs:
      - name: Main Data
        gid: 5695880
        skipFirstRows: 0
        excludeRowsWhere:
          - column: id
            equals: id
        splitColumns:
          - column: tag
            delimiter: ','
        imageColumns: image_link
        excludeColumns:
          - test
          - warnings
        mergeSources:
          - name: Intake Form Responses
            spreadsheetId: 1yECxIL-BGmUiIIfLFeZWVT1Ot_qxaeE4clITiIugHE8
            gid: 0
            hierarchical_rows: true
            onlyIncludeMapped: true
            skipFirstRows: 1
            excludeRowsWhere:
              - column: instrumentation_details
                equals: Name of the Instrument
            columnMapping:
              instrumentation_details: instruments
              institution_or_startup_name: institution_name
              column_12: tag
              column_13: image_link
              column_14: specifications
            defaults:
              source_type: intake_form
              approval_status: Approved
            autoGenerateId:
              enabled: true
              field: id
              prefix: inst_form
              start: 200001

      - name: Instituitiion list
        gid: 1583764603
        aiSearch:
          enabled: false
        imageColumns:
          - logo_link

      - name: mou
        gid: 1204232309

    filterTaxonomy:
      - id: standardized_district
        title: Districts
        gid: 5695880
        groups:
          South Zone:
            - Thiruvananthapuram
            - Kollam
            - Pathanamthitta
          Central Zone:
            - Ernakulam
            - Thrissur
            - Alappuzha
            - Kottayam
            - Idukki
          North-Central Zone:
            - Palakkad
            - Malappuram
          North Zone:
            - Kozhikode
            - Kannur
            - Wayanad
            - Kasaragod

      - id: correct_provider_key
        title: Institution Type
        gid: 5695880
        linkType: join
        joinSource:
          gid: 1583764603
          foreignKey: correct_provider_key
          groupByColumn: reason_classification
          displayColumn: institution_name
          groupByDelimiter: ','
          autoDiscover: true
        groups: {}`}
            />
          </section>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* SECTION 9: Troubleshooting & FAQs */}
          {/* ──────────────────────────────────────────────────────────── */}
          <section id="faqs" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <BookOpen className="text-purple-600" size={22} />
              9. Troubleshooting & FAQs
            </h2>

            <div className="space-y-3">
              {[
                {
                  q: 'Why are extra metadata columns from my Google Form leaking into JSON?',
                  a: 'Make sure "Only Include Mapped Columns" (onlyIncludeMapped: true) is checked in your Merge Source. This automatically excludes any form question that is not explicitly in your Column Mapping.'
                },
                {
                  q: 'How do I drop sample or instructional rows below the table header?',
                  a: 'Use the "Skip Initial Data Rows" counter (skipFirstRows: 1). If Row 2 in your Google Sheet contains instructions like "e.g. Sample Microscope", setting skipFirstRows: 1 ignores it completely.'
                },
                {
                  q: 'How does composite caching work?',
                  a: 'The cron calculates an MD5 composite hash of the primary CSV, all secondary merge CSVs, and your sheets.yaml config. If none of these change, sync execution skips in 0ms to save CPU and network bandwidth.'
                },
                {
                  q: 'What if an intake form submission has an image on Google Drive?',
                  a: 'Add that column to imageColumns in the Merge Source. The engine will download the drive file, convert it to WebP format, and write it to /assets/[sheet]/[id]_[col].webp.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronDown size={16} className="text-indigo-600" /> : <ChevronRight size={16} className="text-gray-400" />}
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-gray-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Footer Back to Builder Action */}
          <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Ready to build or update your configuration?</h3>
              <p className="text-xs text-gray-500 mt-0.5">Jump back to the visual builder with your new configuration rules.</p>
            </div>
            <Link
              href="/yaml-builder"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all cursor-pointer"
            >
              <Zap size={16} /> Open Visual Builder
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}
