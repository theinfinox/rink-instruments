'use client';

import React, { useState } from 'react';
import { RinkConfig, SheetConfig, TabConfig, MergeSourceConfig, TaxonomyCategory } from './types';
import { 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Split, 
  Image as ImageIcon, 
  PlusCircle, 
  Filter, 
  Bot, 
  Copy, 
  Check, 
  FileText, 
  Sparkles,
  ExternalLink,
  Table,
  CheckCircle2,
  AlertCircle,
  Printer
} from 'lucide-react';

/**
 * Isolated Print Function:
 * Renders ONLY the Visual Manual content (from top to bottom) into an invisible
 * sandboxed iframe and opens the browser PDF / Print dialog with zero outer UI chrome.
 */
export function printVisualManualOnly(containerId = 'visual-manual-print-container', docTitle = 'RINK Pipeline Architecture Manual') {
  if (typeof window === 'undefined') return;

  const targetEl = document.getElementById(containerId);
  if (!targetEl) {
    console.warn(`Print container #${containerId} not found in DOM.`);
    return;
  }

  // 1. Create or retrieve isolated print iframe
  let iframe = document.getElementById('visual-manual-print-iframe') as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'visual-manual-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.zIndex = '-9999';
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  // 2. Clone active Tailwind & font stylesheets from main document
  const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(el => el.outerHTML)
    .join('\n');

  // 3. Write isolated HTML document
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${docTitle}</title>
        ${headStyles}
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 15mm 15mm 15mm;
          }
          html, body {
            background: white !important;
            color: #111827 !important;
            height: auto !important;
            overflow: visible !important;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-avoid-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .print-page-break {
            break-before: page !important;
            page-break-before: always !important;
          }
        </style>
      </head>
      <body class="bg-white p-6">
        ${targetEl.innerHTML}
      </body>
    </html>
  `);
  doc.close();

  // 4. Trigger print once resources are rendered
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  }, 250);
}

export default function PipelineManualView({ config }: { config: RinkConfig }) {
  const [copiedMd, setCopiedMd] = useState(false);

  const sheets = config.sheets || [];
  const totalTabs = sheets.reduce((acc, s) => acc + (s.tabs?.length || 0), 0);
  const totalMergeSources = sheets.reduce((acc, s) => 
    acc + (s.tabs?.reduce((tAcc, t) => tAcc + (t.mergeSources?.length || 0), 0) || 0), 0
  );
  const totalTaxonomies = sheets.reduce((acc, s) => acc + (s.filterTaxonomy?.length || 0), 0);

  // Generate clean Markdown Documentation representation
  const generateMarkdownReport = () => {
    let md = `# 📊 Data Pipeline Architecture Manual\n\n`;
    md += `**Frontend Base URL**: ${config.frontendBaseUrl || 'Not configured'}\n`;
    md += `**Total Sheets**: ${sheets.length} | **Total Tabs**: ${totalTabs} | **Merge Sources**: ${totalMergeSources} | **Dynamic Filter Taxonomies**: ${totalTaxonomies}\n\n`;
    md += `---\n\n`;

    sheets.forEach((sheet, sIdx) => {
      md += `## ${sIdx + 1}. Sheet: \`${sheet.name}\`\n`;
      md += `- **Spreadsheet ID**: \`${sheet.spreadsheetId}\`\n`;
      md += `- **Output JSON**: \`/${sheet.name}.json\`\n\n`;

      if (sheet.tabs && sheet.tabs.length > 0) {
        md += `### Worksheet Tabs:\n`;
        sheet.tabs.forEach((tab, tIdx) => {
          md += `#### ${sIdx + 1}.${tIdx + 1}. Tab: \`${tab.name}\` (GID: \`${tab.gid}\`)\n`;
          if (tab.skipFirstRows) md += `- ⏭️ **Row Offset**: Skips top \`${tab.skipFirstRows}\` data row(s) below header.\n`;
          if (tab.hierarchical_rows) md += `- 🌳 **Hierarchical Rows**: Enabled (blank leading cells inherit parent metadata).\n`;
          if (tab.excludeColumns?.length) md += `- 🚫 **Excluded Columns**: \`${tab.excludeColumns.join(', ')}\`\n`;
          if (tab.excludeRowsWhere?.length) {
            md += `- ✂️ **Row Drop Rules**:\n`;
            tab.excludeRowsWhere.forEach(r => md += `  - Drop where \`${r.column}\` == \`${r.equals}\`\n`);
          }
          if (tab.splitColumns?.length) {
            md += `- 🔀 **Array Splitters**:\n`;
            tab.splitColumns.forEach(s => md += `  - Column \`${s.column}\` split by delimiter \`${s.delimiter}\`\n`);
          }
          if (tab.imageColumns) {
            const imgCols = Array.isArray(tab.imageColumns) ? tab.imageColumns.join(', ') : tab.imageColumns;
            md += `- 🖼️ **WebP Image Conversion**: \`${imgCols}\`\n`;
          }
          if (tab.autoGenerateId?.enabled) {
            md += `- 🆔 **Auto-ID Generator**: Prefix \`${tab.autoGenerateId.prefix}_\`, Starting at \`${tab.autoGenerateId.start}\`\n`;
          }

          // Merge Sources in Tab
          if (tab.mergeSources && tab.mergeSources.length > 0) {
            md += `\n**External Merge Sources (Appended at Compile Time)**:\n`;
            tab.mergeSources.forEach(m => {
              md += `- **${m.name || 'External Form'}** (\`Spreadsheet: ${m.spreadsheetId}\`, \`GID: ${m.gid}\`)\n`;
              if (m.onlyIncludeMapped) md += `  - 🧹 **Unmapped Noise Filter**: Only mapped columns + defaults enter output.\n`;
              if (m.skipFirstRows) md += `  - ⏭️ **Row Offset**: Skips top \`${m.skipFirstRows}\` submission row(s).\n`;
              if (m.columnMapping && Object.keys(m.columnMapping).length > 0) {
                md += `  - 🔄 **Column Mappings**:\n`;
                Object.entries(m.columnMapping).forEach(([src, target]) => {
                  md += `    - \`${src}\` ➔ \`${target}\`\n`;
                });
              }
              if (m.defaults && Object.keys(m.defaults).length > 0) {
                md += `  - ⚙️ **Static Defaults**: \`${JSON.stringify(m.defaults)}\`\n`;
              }
              if (m.autoGenerateId?.enabled) {
                md += `  - 🆔 **Namespaced IDs**: \`${m.autoGenerateId.prefix}_${m.autoGenerateId.start}+\`\n`;
              }
            });
          }
          md += `\n`;
        });
      }

      // Filter Taxonomy in Sheet
      if (sheet.filterTaxonomy && sheet.filterTaxonomy.length > 0) {
        md += `### Dynamic Filter Taxonomies:\n`;
        sheet.filterTaxonomy.forEach(tax => {
          if (tax.linkType === 'join' && tax.joinSource) {
            md += `- 🔗 **${tax.title}** (\`${tax.id}\`): Relational Join on Tab GID \`${tax.joinSource.gid}\` via Foreign Key \`${tax.joinSource.foreignKey}\` (Grouped by \`${tax.joinSource.groupByColumn}\`, Displayed as \`${tax.joinSource.displayColumn}\`)\n`;
          } else {
            md += `- 📋 **${tax.title}** (\`${tax.id}\`): Direct Categorization with \`${Object.keys(tax.groups || {}).length}\` defined group(s).\n`;
          }
        });
        md += `\n`;
      }
      md += `---\n\n`;
    });

    return md;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  if (sheets.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-500 space-y-2">
        <p className="font-semibold text-gray-700">No Sheets Configured</p>
        <p className="text-xs">Add a sheet on the left or paste your YAML to see the auto-generated visual architecture manual.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-900 font-sans">
      
      {/* 📄 Print Trigger & Action Bar */}
      <div className="no-print bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white p-4 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-wide">Visual Pipeline Architecture Manual</h3>
          </div>
          <p className="text-[11px] text-indigo-200 mt-0.5">
            Auto-synthesized visual vector flows and data ingestion rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => printVisualManualOnly('visual-manual-print-container')}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Printer size={13} /> Generate PDF / Print
          </button>

          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer"
          >
            {copiedMd ? (
              <>
                <Check size={13} className="text-emerald-400" /> Copied MD!
              </>
            ) : (
              <>
                <Copy size={13} /> Copy MD
              </>
            )}
          </button>
        </div>
      </div>

      {/* 🖨️ Isolated Full-Height Printable Container */}
      <div id="visual-manual-print-container" className="space-y-6 bg-white p-2 rounded-xl">
        
        {/* Printable Official Header */}
        <div className="border-b-2 border-indigo-900 pb-4 print-avoid-break">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-900 text-white font-mono">
                RINK KERALA
              </span>
              <h2 className="text-xl font-extrabold text-gray-900 mt-1">
                Data Pipeline Architecture Specification
              </h2>
              <p className="text-xs text-gray-500">
                Automated Google Sheets Ingestion, Union Mapping & Taxonomy Protocol
              </p>
            </div>
            <div className="text-right text-xs text-gray-500 space-y-0.5 font-mono">
              <p>{new Date().toLocaleDateString()}</p>
              <p className="text-indigo-700 font-bold">{config.frontendBaseUrl || 'https://rink-inst.vercel.app'}</p>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-100 text-center">
            <div className="bg-blue-50 p-2 rounded border border-blue-100">
              <span className="text-[10px] font-bold text-blue-900 uppercase">Sheets</span>
              <p className="text-base font-extrabold text-blue-700">{sheets.length}</p>
            </div>
            <div className="bg-indigo-50 p-2 rounded border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-900 uppercase">Tabs</span>
              <p className="text-base font-extrabold text-indigo-700">{totalTabs}</p>
            </div>
            <div className="bg-purple-50 p-2 rounded border border-purple-100">
              <span className="text-[10px] font-bold text-purple-900 uppercase">Merge Sources</span>
              <p className="text-base font-extrabold text-purple-700">{totalMergeSources}</p>
            </div>
            <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-900 uppercase">Taxonomies</span>
              <p className="text-base font-extrabold text-emerald-700">{totalTaxonomies}</p>
            </div>
          </div>
        </div>

        {/* 📑 Sheet-by-Sheet Visual Architecture */}
        <div className="space-y-6">
          {sheets.map((sheet, sIdx) => (
            <div key={sIdx} className="bg-white p-4 rounded-xl border border-gray-300 space-y-4 print-avoid-break">
              
              {/* Sheet Title Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-xs font-bold flex items-center justify-center font-mono">
                    {sIdx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900">
                    Sheet Target: <span className="text-blue-700 font-mono">{sheet.name}</span>
                  </h4>
                </div>
                <span className="text-[11px] font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200 truncate max-w-[260px]">
                  ID: {sheet.spreadsheetId}
                </span>
              </div>

              {/* Tabs Flow Diagrams */}
              <div className="space-y-3">
                {sheet.tabs?.map((tab, tIdx) => {
                  const hasMergeSources = tab.mergeSources && tab.mergeSources.length > 0;

                  return (
                    <div key={tIdx} className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200 space-y-2.5 text-xs">
                      
                      {/* Tab Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers size={14} className="text-indigo-600" />
                          <span className="text-xs font-bold text-gray-900 font-mono">
                            Tab: {tab.name}
                          </span>
                          <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                            GID: {tab.gid}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          Active Ingestion
                        </span>
                      </div>

                      {/* 🔀 Vector Flow Chart representation */}
                      <div className="p-2.5 bg-white rounded-lg border border-indigo-100 space-y-1.5 text-xs">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Data Transformation Flow:
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-mono">
                            📥 Google Sheet (GID: {tab.gid})
                          </span>

                          {tab.skipFirstRows ? (
                            <>
                              <span className="text-gray-400">➔</span>
                              <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 font-mono font-bold">
                                ⏭️ Skip {tab.skipFirstRows} Row(s)
                              </span>
                            </>
                          ) : null}

                          {tab.excludeRowsWhere?.length ? (
                            <>
                              <span className="text-gray-400">➔</span>
                              <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200 font-mono">
                                ✂️ Filter ({tab.excludeRowsWhere.length} rule)
                              </span>
                            </>
                          ) : null}

                          {tab.splitColumns?.length ? (
                            <>
                              <span className="text-gray-400">➔</span>
                              <span className="bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded border border-cyan-200 font-mono">
                                🔀 Split ({tab.splitColumns.map(s => s.column).join(', ')})
                              </span>
                            </>
                          ) : null}

                          {tab.imageColumns ? (
                            <>
                              <span className="text-gray-400">➔</span>
                              <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200 font-mono">
                                🖼️ WebP Image Conv
                              </span>
                            </>
                          ) : null}

                          <span className="text-gray-400">➔</span>
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-mono font-bold">
                            ✅ /{sheet.name}.json
                          </span>
                        </div>
                      </div>

                      {/* Rules Summary Pills */}
                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        {tab.excludeColumns?.length ? (
                          <div className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200 font-mono">
                            <strong>Excluded Columns:</strong> {tab.excludeColumns.join(', ')}
                          </div>
                        ) : null}

                        {tab.hierarchical_rows ? (
                          <div className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                            <strong>Hierarchical Rows:</strong> Enabled
                          </div>
                        ) : null}

                        {tab.autoGenerateId?.enabled ? (
                          <div className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                            <strong>Auto-ID:</strong> {tab.autoGenerateId.prefix}_{tab.autoGenerateId.start}+
                          </div>
                        ) : null}
                      </div>

                      {/* Merged Sources (Google Forms Intake) */}
                      {hasMergeSources && tab.mergeSources && tab.mergeSources.length > 0 && (
                        <div className="mt-2 p-2.5 bg-purple-50/70 rounded-lg border border-purple-200 space-y-2">
                          {tab.mergeSources.map((mSrc, mIdx) => (
                            <div key={mIdx} className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-bold text-purple-950">
                                <span>🟣 External Merge Source: {mSrc.name || 'Google Form Responses'}</span>
                                <span className="font-mono text-[10px]">GID: {mSrc.gid}</span>
                              </div>

                              {mSrc.onlyIncludeMapped && (
                                <p className="text-emerald-800 flex items-center gap-1 font-semibold text-[10px]">
                                  <ShieldCheck size={12} /> Only Include Mapped Columns active (All unmapped form noise dropped).
                                </p>
                              )}

                              {mSrc.columnMapping && Object.keys(mSrc.columnMapping).length > 0 && (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left text-[10px] font-mono bg-white border border-purple-200 rounded">
                                    <thead className="bg-purple-100 text-purple-900">
                                      <tr>
                                        <th className="px-2 py-0.5">Source Form Header</th>
                                        <th className="px-2 py-0.5">➔</th>
                                        <th className="px-2 py-0.5">Canonical Target Field</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-purple-100">
                                      {Object.entries(mSrc.columnMapping).map(([src, target], mapIdx) => (
                                        <tr key={mapIdx}>
                                          <td className="px-2 py-0.5 text-gray-700">{src}</td>
                                          <td className="px-2 py-0.5 text-purple-400">➔</td>
                                          <td className="px-2 py-0.5 text-purple-900 font-bold">{target}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              {mSrc.defaults && Object.keys(mSrc.defaults).length > 0 && (
                                <p className="text-[10px] text-purple-900">
                                  <strong>Injected Defaults:</strong> {JSON.stringify(mSrc.defaults)}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* Dynamic Filter Taxonomy Section */}
              {sheet.filterTaxonomy && sheet.filterTaxonomy.length > 0 && (
                <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-200 space-y-1.5 text-xs">
                  <span className="font-bold text-indigo-950 flex items-center gap-1 text-[11px]">
                    <Filter size={13} className="text-indigo-700" />
                    Dynamic Filter Taxonomies (/filters.json):
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    {sheet.filterTaxonomy.map((tax, taxIdx) => (
                      <div key={taxIdx} className="bg-white p-2 rounded border border-indigo-100 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900 font-mono">{tax.title}</span>
                          <span className="font-mono text-[10px] bg-indigo-100 text-indigo-800 px-1 py-0.2 rounded">
                            {tax.id}
                          </span>
                        </div>
                        
                        {tax.linkType === 'join' && tax.joinSource ? (
                          <p className="text-emerald-800 text-[10px]">
                            Cross-Tab Join on Tab GID {tax.joinSource.gid} via <code className="font-mono">{tax.joinSource.foreignKey}</code>
                          </p>
                        ) : (
                          <p className="text-gray-600 text-[10px]">
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

        {/* Print Sign-Off */}
        <div className="border-t border-gray-200 pt-3 text-center text-[10px] text-gray-400 font-mono print-avoid-break">
          Generated by RINK Config Studio • Certified Validated Pipeline Specification
        </div>

      </div>

    </div>
  );
}
