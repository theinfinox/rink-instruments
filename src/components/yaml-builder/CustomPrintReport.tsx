'use client';

import React from 'react';
import { RinkConfig } from './types';
import { 
  ShieldCheck, 
  Layers, 
  PlusCircle, 
  Filter, 
  Bot, 
  Split, 
  Image as ImageIcon,
  CheckCircle2,
  FileCode,
  Calendar,
  Globe,
  Database
} from 'lucide-react';

export default function CustomPrintReport({ 
  config, 
  yamlCode 
}: { 
  config: RinkConfig; 
  yamlCode: string; 
}) {
  const sheets = config.sheets || [];
  const totalTabs = sheets.reduce((acc, s) => acc + (s.tabs?.length || 0), 0);
  const totalMergeSources = sheets.reduce((acc, s) => 
    acc + (s.tabs?.reduce((tAcc, t) => tAcc + (t.mergeSources?.length || 0), 0) || 0), 0
  );
  const totalTaxonomies = sheets.reduce((acc, s) => acc + (s.filterTaxonomy?.length || 0), 0);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white text-gray-900 font-sans p-8 max-w-5xl mx-auto space-y-8">
      {/* ── Global Print Stylesheet ─────────────────────────────────── */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 15mm 15mm 15mm;
          }
          html, body {
            background: white !important;
            color: #111827 !important;
            font-size: 11pt !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          #custom-print-report-root, #custom-print-report-root * {
            visibility: visible;
          }
          #custom-print-report-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
          }
          .print-avoid-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .print-page-break {
            break-before: page !important;
            page-break-before: always !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ── Official Document Header ────────────────────────────────── */}
      <div className="border-b-2 border-indigo-900 pb-5 print-avoid-break">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-900 text-white">
                RINK KERALA
              </span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Technical Specification
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-1.5 tracking-tight">
              Data Pipeline & Architecture Blueprint
            </h1>
            <p className="text-xs text-gray-600 mt-0.5">
              Automated Google Sheets Ingestion, Sanitization, Union Mapping & Taxonomy Protocol
            </p>
          </div>

          <div className="text-right text-xs space-y-1">
            <p className="font-mono text-gray-500 flex items-center justify-end gap-1">
              <Calendar size={12} /> {currentDate}
            </p>
            <p className="font-mono text-indigo-700 font-bold flex items-center justify-end gap-1">
              <Globe size={12} /> {config.frontendBaseUrl || 'https://rink-inst.vercel.app'}
            </p>
            <p className="text-[10px] text-gray-400 font-mono">Doc ID: SPEC-{Date.now().toString(36).toUpperCase()}</p>
          </div>
        </div>

        {/* Executive Metrics Bar */}
        <div className="grid grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-100 text-center">
          <div className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-100">
            <span className="text-[10px] font-bold text-blue-900 uppercase">Data Sources</span>
            <p className="text-lg font-black text-blue-700">{sheets.length} Sheets</p>
          </div>
          <div className="bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100">
            <span className="text-[10px] font-bold text-indigo-900 uppercase">Worksheet Tabs</span>
            <p className="text-lg font-black text-indigo-700">{totalTabs} Tabs</p>
          </div>
          <div className="bg-purple-50/70 p-2.5 rounded-lg border border-purple-100">
            <span className="text-[10px] font-bold text-purple-900 uppercase">Merge Sources</span>
            <p className="text-lg font-black text-purple-700">{totalMergeSources} Forms</p>
          </div>
          <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-900 uppercase">Dynamic Filters</span>
            <p className="text-lg font-black text-emerald-700">{totalTaxonomies} Taxonomies</p>
          </div>
        </div>
      </div>

      {/* ── Section 1: Executive Source Inventory Matrix ─────────────── */}
      <section className="space-y-3 print-avoid-break">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-1.5">
          <Database size={16} className="text-blue-700" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
            1. Source Sheets & Output Endpoints Matrix
          </h2>
        </div>

        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-100 text-gray-800 font-bold uppercase tracking-wider border-b border-gray-300">
              <tr>
                <th className="px-3 py-2">Sheet Target</th>
                <th className="px-3 py-2">Spreadsheet ID</th>
                <th className="px-3 py-2">Worksheet Tabs</th>
                <th className="px-3 py-2">Output JSON Endpoint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {sheets.map((sheet, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-3 py-2 font-bold font-mono text-blue-900">{sheet.name}</td>
                  <td className="px-3 py-2 font-mono text-gray-600 truncate max-w-[200px]">{sheet.spreadsheetId}</td>
                  <td className="px-3 py-2">
                    {sheet.tabs?.map(t => (
                      <span key={t.gid} className="inline-block bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-mono mr-1 mb-0.5 border border-gray-200">
                        {t.name} (GID: {t.gid})
                      </span>
                    ))}
                  </td>
                  <td className="px-3 py-2 font-mono text-emerald-700 font-semibold">/{sheet.name}.json</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 2: Detailed Ingestion & Transformation Rules ──────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-1.5 print-avoid-break">
          <Layers size={16} className="text-indigo-700" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
            2. Detailed Tab Ingestion, Sanitization & Transformation Rules
          </h2>
        </div>

        <div className="space-y-4">
          {sheets.map((sheet, sIdx) => (
            <div key={sIdx} className="border border-gray-300 rounded-xl p-4 space-y-3 print-avoid-break bg-white">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-indigo-900 text-white text-xs flex items-center justify-center font-mono">
                    {sIdx + 1}
                  </span>
                  Sheet Target: <span className="font-mono text-indigo-800">{sheet.name}</span>
                </h3>
                <span className="text-[11px] font-mono text-gray-500">Spreadsheet: {sheet.spreadsheetId}</span>
              </div>

              {/* Tabs Grid */}
              <div className="space-y-3">
                {sheet.tabs?.map((tab, tIdx) => (
                  <div key={tIdx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 font-mono">
                          Tab: {tab.name}
                        </span>
                        <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                          GID: {tab.gid}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Active Ingestion
                      </span>
                    </div>

                    {/* Vector Transformation Flow for Print */}
                    <div className="p-2 bg-white rounded border border-gray-200 text-[11px] font-mono flex flex-wrap items-center gap-1 text-gray-700">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded">Raw GID:{tab.gid}</span>
                      <span>➔</span>
                      {tab.skipFirstRows ? (
                        <>
                          <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">Skip {tab.skipFirstRows} Rows</span>
                          <span>➔</span>
                        </>
                      ) : null}
                      {tab.excludeRowsWhere?.length ? (
                        <>
                          <span className="bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded">Filter ({tab.excludeRowsWhere.length} rule)</span>
                          <span>➔</span>
                        </>
                      ) : null}
                      {tab.splitColumns?.length ? (
                        <>
                          <span className="bg-cyan-100 text-cyan-900 px-1.5 py-0.5 rounded">Split ({tab.splitColumns.map(s => s.column).join(', ')})</span>
                          <span>➔</span>
                        </>
                      ) : null}
                      {tab.imageColumns ? (
                        <>
                          <span className="bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded">WebP Image Conv</span>
                          <span>➔</span>
                        </>
                      ) : null}
                      <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-bold">Compiled Dataset</span>
                    </div>

                    {/* Tab Parameters Matrix */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-gray-500 font-semibold">Exclusion Rules:</span>
                        <p className="text-gray-800 font-mono">
                          {tab.excludeColumns?.length ? `Columns: ${tab.excludeColumns.join(', ')}` : 'No columns excluded'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold">Auto-ID Generation:</span>
                        <p className="text-gray-800 font-mono">
                          {tab.autoGenerateId?.enabled ? `${tab.autoGenerateId.prefix}_${tab.autoGenerateId.start}+` : 'Disabled'}
                        </p>
                      </div>
                    </div>

                    {/* Merge Sources (Google Forms) */}
                    {tab.mergeSources && tab.mergeSources.length > 0 && (
                      <div className="mt-2 p-2.5 bg-purple-50 rounded border border-purple-200 space-y-2">
                        <div className="flex items-center justify-between text-purple-950 font-bold text-[11px]">
                          <span>🟣 External Merge Source: {tab.mergeSources[0].name || 'Google Form Responses'}</span>
                          <span className="font-mono text-[10px]">GID: {tab.mergeSources[0].gid}</span>
                        </div>

                        {tab.mergeSources[0].onlyIncludeMapped && (
                          <p className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                            <ShieldCheck size={11} /> Only Include Mapped Columns active (All unmapped form noise dropped).
                          </p>
                        )}

                        {tab.mergeSources[0].columnMapping && (
                          <table className="w-full text-left text-[10px] font-mono bg-white border border-purple-200 rounded">
                            <thead className="bg-purple-100 text-purple-900">
                              <tr>
                                <th className="px-2 py-0.5">Source Form Header</th>
                                <th className="px-2 py-0.5">➔</th>
                                <th className="px-2 py-0.5">Canonical Target Field</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-purple-100">
                              {Object.entries(tab.mergeSources[0].columnMapping).map(([src, target], mIdx) => (
                                <tr key={mIdx}>
                                  <td className="px-2 py-0.5 text-gray-700">{src}</td>
                                  <td className="px-2 py-0.5 text-purple-400">➔</td>
                                  <td className="px-2 py-0.5 text-purple-900 font-bold">{target}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                        {tab.mergeSources[0].defaults && (
                          <p className="text-[10px] text-purple-900">
                            <strong>Injected Defaults:</strong> {JSON.stringify(tab.mergeSources[0].defaults)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Dynamic Filter Taxonomy Box */}
              {sheet.filterTaxonomy && sheet.filterTaxonomy.length > 0 && (
                <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200 text-xs space-y-1.5">
                  <span className="font-bold text-indigo-950 flex items-center gap-1 text-[11px]">
                    <Filter size={12} className="text-indigo-700" />
                    Dynamic Filter Taxonomy Specification (/filters.json):
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {sheet.filterTaxonomy.map((tax, taxIdx) => (
                      <div key={taxIdx} className="bg-white p-2 rounded border border-indigo-100">
                        <p className="font-bold text-gray-900 font-mono">{tax.title} ({tax.id})</p>
                        {tax.linkType === 'join' && tax.joinSource ? (
                          <p className="text-emerald-800 text-[10px] mt-0.5">
                            Cross-Tab Join on Tab GID {tax.joinSource.gid} via <code className="font-mono">{tax.joinSource.foreignKey}</code>
                          </p>
                        ) : (
                          <p className="text-gray-600 text-[10px] mt-0.5">
                            Direct Categorization ({Object.keys(tax.groups || {}).length} zones/groups)
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Verified YAML Configuration Source ────────────── */}
      <section className="space-y-2 print-page-break">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-1.5">
          <FileCode size={16} className="text-emerald-700" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
            3. Master Verified YAML Configuration (Appendix)
          </h2>
        </div>
        <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-900 font-mono text-[9pt] leading-snug overflow-x-auto whitespace-pre-wrap">
          {yamlCode}
        </div>
      </section>

      {/* ── Official Footer & Sign-Off ───────────────────────────────── */}
      <div className="border-t-2 border-gray-300 pt-4 text-center text-xs text-gray-500 space-y-1 print-avoid-break">
        <p className="font-bold text-gray-700">
          Kerala Startup Mission (KSUM) • Research Innovation Network Kerala (RINK)
        </p>
        <p className="text-[10px] text-gray-400">
          Generated via RINK Config Studio • Certified Validated Pipeline Specification
        </p>
      </div>

    </div>
  );
}
