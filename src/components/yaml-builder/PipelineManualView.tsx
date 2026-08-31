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
  AlertCircle
} from 'lucide-react';

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
    <div className="space-y-6 text-gray-900 printable-manual font-sans">
      
      {/* 📊 Executive Pipeline Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white p-5 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base font-bold text-white tracking-wide">Live Pipeline Architecture Manual</h3>
          </div>
          <p className="text-xs text-indigo-200 mt-1">
            Auto-synthesized from your active YAML configuration rules.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyMarkdown}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer"
        >
          {copiedMd ? (
            <>
              <Check size={13} className="text-emerald-400" /> Copied Markdown!
            </>
          ) : (
            <>
              <Copy size={13} /> Copy Manual (MD)
            </>
          )}
        </button>
      </div>

      {/* 🔢 Metric Pill Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs text-center">
          <p className="text-xs text-gray-500 font-medium">Sheets</p>
          <p className="text-xl font-extrabold text-blue-600">{sheets.length}</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs text-center">
          <p className="text-xs text-gray-500 font-medium">Worksheet Tabs</p>
          <p className="text-xl font-extrabold text-indigo-600">{totalTabs}</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs text-center">
          <p className="text-xs text-gray-500 font-medium">Merge Sources</p>
          <p className="text-xl font-extrabold text-purple-600">{totalMergeSources}</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs text-center">
          <p className="text-xs text-gray-500 font-medium">Taxonomies</p>
          <p className="text-xl font-extrabold text-emerald-600">{totalTaxonomies}</p>
        </div>
      </div>

      {/* 📑 Sheet-by-Sheet Visual Architecture */}
      <div className="space-y-6">
        {sheets.map((sheet, sIdx) => (
          <div key={sIdx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            
            {/* Sheet Title Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                  {sIdx + 1}
                </span>
                <h4 className="text-base font-bold text-gray-900">
                  Sheet: <span className="text-blue-600 font-mono">{sheet.name}</span>
                </h4>
              </div>
              <span className="text-[11px] font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200 truncate max-w-[260px]">
                ID: {sheet.spreadsheetId}
              </span>
            </div>

            {/* Tabs Vector Flow Diagram */}
            <div className="space-y-4">
              {sheet.tabs?.map((tab, tIdx) => {
                const hasMergeSources = tab.mergeSources && tab.mergeSources.length > 0;

                return (
                  <div key={tIdx} className="bg-gray-50/70 p-4 rounded-xl border border-gray-200 space-y-3">
                    
                    {/* Tab Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers size={15} className="text-indigo-600" />
                        <span className="text-xs font-bold text-gray-900 font-mono">
                          Tab: {tab.name}
                        </span>
                        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                          GID: {tab.gid}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={11} /> Ready to Compile
                      </span>
                    </div>

                    {/* 🔀 Vector Flow Chart representation */}
                    <div className="p-3 bg-white rounded-lg border border-indigo-100 space-y-2 text-xs">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Data Transformation Flow:
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded border border-blue-200 font-mono">
                          📥 Google Sheet (GID: {tab.gid})
                        </span>

                        {tab.skipFirstRows ? (
                          <>
                            <ArrowRight size={12} className="text-gray-400" />
                            <span className="bg-amber-50 text-amber-800 px-2 py-1 rounded border border-amber-200 font-mono">
                              ⏭️ Skip First {tab.skipFirstRows} Row(s)
                            </span>
                          </>
                        ) : null}

                        {tab.excludeRowsWhere?.length ? (
                          <>
                            <ArrowRight size={12} className="text-gray-400" />
                            <span className="bg-rose-50 text-rose-800 px-2 py-1 rounded border border-rose-200 font-mono">
                              ✂️ Filter ({tab.excludeRowsWhere.length} rule)
                            </span>
                          </>
                        ) : null}

                        {tab.splitColumns?.length ? (
                          <>
                            <ArrowRight size={12} className="text-gray-400" />
                            <span className="bg-cyan-50 text-cyan-800 px-2 py-1 rounded border border-cyan-200 font-mono">
                              🔀 Split ({tab.splitColumns.map(s => s.column).join(', ')})
                            </span>
                          </>
                        ) : null}

                        {tab.imageColumns ? (
                          <>
                            <ArrowRight size={12} className="text-gray-400" />
                            <span className="bg-purple-50 text-purple-800 px-2 py-1 rounded border border-purple-200 font-mono">
                              🖼️ Drive ➔ WebP
                            </span>
                          </>
                        ) : null}

                        <ArrowRight size={12} className="text-gray-400" />
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded border border-emerald-200 font-mono font-bold">
                          ✅ Output JSON
                        </span>
                      </div>
                    </div>

                    {/* Rules Summary Pills */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {tab.excludeColumns?.length ? (
                        <div className="bg-rose-50 text-rose-800 px-2.5 py-1 rounded border border-rose-200">
                          <strong>Excluded Columns:</strong> {tab.excludeColumns.join(', ')}
                        </div>
                      ) : null}

                      {tab.hierarchical_rows ? (
                        <div className="bg-teal-50 text-teal-800 px-2.5 py-1 rounded border border-teal-200">
                          <strong>Hierarchical Rows:</strong> Enabled
                        </div>
                      ) : null}

                      {tab.autoGenerateId?.enabled ? (
                        <div className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200 font-mono">
                          <strong>Auto-ID:</strong> {tab.autoGenerateId.prefix}_{tab.autoGenerateId.start}+
                        </div>
                      ) : null}
                    </div>

                    {/* Merged Sources (Google Forms Intake) */}
                    {hasMergeSources && (
                      <div className="mt-3 p-3 bg-purple-50/60 rounded-lg border border-purple-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
                          <PlusCircle size={14} className="text-purple-600" />
                          <span>External Merge Ingestion (Google Forms / Secondary Sheets)</span>
                        </div>

                        {tab.mergeSources!.map((mSrc, mIdx) => (
                          <div key={mIdx} className="bg-white p-3 rounded border border-purple-200 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-purple-900 font-mono">
                                🔗 {mSrc.name || 'Untitled Merge Source'}
                              </span>
                              <span className="font-mono text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                                GID: {mSrc.gid}
                              </span>
                            </div>

                            {/* Clean unmapped noise status */}
                            {mSrc.onlyIncludeMapped && (
                              <p className="text-emerald-700 flex items-center gap-1 font-semibold text-[11px]">
                                <ShieldCheck size={13} /> Only Include Mapped Columns active (Unmapped noise discarded)
                              </p>
                            )}

                            {/* Mappings Table */}
                            {mSrc.columnMapping && Object.keys(mSrc.columnMapping).length > 0 && (
                              <div className="overflow-x-auto mt-1">
                                <table className="w-full text-left text-[11px] font-mono">
                                  <thead className="bg-purple-50 text-purple-900">
                                    <tr>
                                      <th className="px-2 py-1">Source Form Header</th>
                                      <th className="px-2 py-1">➔</th>
                                      <th className="px-2 py-1">Target Canonical Key</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-purple-100">
                                    {Object.entries(mSrc.columnMapping).map(([src, target], mapIdx) => (
                                      <tr key={mapIdx}>
                                        <td className="px-2 py-1 text-gray-700">{src}</td>
                                        <td className="px-2 py-1 text-purple-400">➔</td>
                                        <td className="px-2 py-1 text-purple-700 font-bold">{target}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {/* Injected Defaults */}
                            {mSrc.defaults && Object.keys(mSrc.defaults).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                                <span className="text-gray-500 font-medium">Injected Defaults:</span>
                                {Object.entries(mSrc.defaults).map(([k, v], dIdx) => (
                                  <span key={dIdx} className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-mono">
                                    {k}={v}
                                  </span>
                                ))}
                              </div>
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
              <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-200 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                  <Filter size={14} className="text-indigo-600" />
                  <span>Dynamic Filter Taxonomies (Compiled into /filters.json)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {sheet.filterTaxonomy.map((tax, taxIdx) => (
                    <div key={taxIdx} className="bg-white p-3 rounded-lg border border-indigo-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{tax.title}</span>
                        <span className="font-mono text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                          {tax.id}
                        </span>
                      </div>
                      
                      {tax.linkType === 'join' && tax.joinSource ? (
                        <p className="text-emerald-700 text-[11px] leading-relaxed">
                          🔗 <strong>Relational Join:</strong> Links to Lookup Tab (GID: {tax.joinSource.gid}) via <code className="font-mono">{tax.joinSource.foreignKey}</code> to auto-group by <code className="font-mono">{tax.joinSource.groupByColumn}</code>.
                        </p>
                      ) : (
                        <p className="text-gray-600 text-[11px] leading-relaxed">
                          📋 <strong>Direct Filter:</strong> {Object.keys(tax.groups || {}).length} predefined named group(s).
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

    </div>
  );
}
