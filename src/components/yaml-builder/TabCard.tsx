import React, { useState } from 'react';
import Tooltip from './Tooltip';
import { TabConfig } from './types';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import MergeSourceCard from './MergeSourceCard';

export default function TabCard({ 
  tab, 
  spreadsheetId, 
  columnRegistry = {},
  onRegisterColumns,
  onChange, 
  onRemove, 
  onColumnsFetched 
}: { 
  tab: TabConfig, 
  spreadsheetId: string, 
  columnRegistry?: Record<string, string[]>,
  onRegisterColumns?: (sheetId: string, gid: number | string, cols: string[]) => void,
  onChange: (t: TabConfig) => void, 
  onRemove: () => void,
  onColumnsFetched?: (cols: string[]) => void
}) {
  const [localColumns, setLocalColumns] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read from global column registry if available, else fall back to local state
  const tabColumns = columnRegistry[`${spreadsheetId}_${tab.gid || 0}`] || localColumns;

  const fetchColumns = async () => {
    if (!spreadsheetId) {
      setError('Enter Spreadsheet ID first');
      return;
    }
    setIsFetching(true);
    setError(null);
    try {
      const res = await fetch(`/api/sheet-metadata?spreadsheetId=${spreadsheetId}&gid=${tab.gid || 0}`);
      const data = await res.json();
      if (res.ok && data.columns) {
        setLocalColumns(data.columns);
        if (onColumnsFetched) onColumnsFetched(data.columns);
        if (onRegisterColumns) onRegisterColumns(spreadsheetId, tab.gid || 0, data.columns);
      } else {
        setError(data.error || 'Failed to fetch columns');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsFetching(false);
    }
  };

  const renderMultiSelect = (
    label: string, 
    tooltip: string, 
    values: string[] | undefined, 
    onUpdate: (newVals: string[] | undefined) => void,
    fieldId: string
  ) => {
    const currentVals = Array.isArray(values) ? values : (values ? [(values as string)] : []);
    
    return (
      <div className="space-y-1.5">
        <label className="flex items-center text-xs font-medium text-gray-700">
          {label} <Tooltip text={tooltip} />
        </label>
        
        <div className="flex items-center gap-2">
          {/* Smart Combobox */}
          <div className="relative flex-1">
            <input 
              type="text" 
              list={`list-${tab.gid}-${fieldId}`}
              className="block w-full border border-gray-300 rounded p-1.5 text-xs bg-white focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 font-mono"
              placeholder="+ Type or pick column to add..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const val = target.value.trim();
                  if (val && !currentVals.includes(val)) {
                    onUpdate([...currentVals, val]);
                    target.value = '';
                  }
                }
              }}
              onChange={(e) => {
                const val = e.target.value.trim();
                // Auto-add if exact match selected from datalist
                if (tabColumns.includes(val) && !currentVals.includes(val)) {
                  onUpdate([...currentVals, val]);
                  e.target.value = '';
                }
              }}
            />
            <datalist id={`list-${tab.gid}-${fieldId}`}>
              {tabColumns.map(col => (
                <option key={col} value={col} disabled={currentVals.includes(col)} />
              ))}
            </datalist>
          </div>

          {tabColumns.length > 0 && (
            <select
              className="border border-gray-300 rounded p-1.5 text-xs bg-gray-50 text-gray-700 hover:bg-gray-100 cursor-pointer max-w-[150px] truncate"
              onChange={(e) => {
                const val = e.target.value;
                if (val && !currentVals.includes(val)) {
                  onUpdate([...currentVals, val]);
                }
                e.target.value = '';
              }}
              defaultValue=""
            >
              <option value="" disabled>+ Dropdown...</option>
              {tabColumns.map(col => (
                <option key={col} value={col} disabled={currentVals.includes(col)}>{col}</option>
              ))}
            </select>
          )}
        </div>

        {/* Selected Chips */}
        {currentVals.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentVals.map(val => (
              <span key={val} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium bg-blue-100 text-blue-800 border border-blue-200">
                {val}
                <button 
                  type="button" 
                  onClick={() => {
                    const newVals = currentVals.filter(v => v !== val);
                    onUpdate(newVals.length > 0 ? newVals : undefined);
                  }} 
                  className="text-blue-500 hover:text-blue-700 font-bold focus:outline-none cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-4 relative transition-all">
      <button 
        type="button"
        onClick={onRemove}
        className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xs font-medium cursor-pointer"
      >
        Remove Tab
      </button>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="flex items-center text-xs font-medium text-gray-700">
            Tab Name <span className="text-red-500 ml-1">*</span>
            <Tooltip text="The exact name of the tab in Google Sheets (e.g. 'Main Data')" />
          </label>
          <input 
            type="text" 
            className="mt-1 block w-full border border-gray-300 rounded p-1.5 text-sm bg-white transition-colors focus:ring-blue-500 focus:border-blue-500"
            value={tab.name}
            onChange={(e) => onChange({...tab, name: e.target.value})}
            required
            placeholder="Main Data"
          />
        </div>
        <div>
          <label className="flex items-center text-xs font-medium text-gray-700">
            GID <span className="text-red-500 ml-1">*</span>
            <Tooltip text="The ID number at the end of the Google Sheet URL when viewing this tab (e.g. gid=12345)" />
          </label>
          <div className="flex mt-1 gap-2">
            <input 
              type="number" 
              className="block w-full border border-gray-300 rounded p-1.5 text-sm font-mono bg-white transition-colors focus:ring-blue-500 focus:border-blue-500"
              value={tab.gid}
              onChange={(e) => onChange({...tab, gid: parseInt(e.target.value) || 0})}
              required
            />
            <button
              type="button"
              onClick={fetchColumns}
              disabled={isFetching}
              className="whitespace-nowrap flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 rounded border border-indigo-200 text-xs font-medium transition-colors cursor-pointer"
            >
              {isFetching ? <Loader2 className="animate-spin" size={14} /> : 'Fetch Columns'}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          {tabColumns.length > 0 && (
            <p className="text-xs text-green-700 font-medium mt-1">✓ Loaded {tabColumns.length} columns</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Hierarchical CSV Config */}
        <div className="border border-green-100 bg-green-50/30 p-3 rounded-md mt-2 transition-all">
          <div className="flex items-center justify-between">
            <label className="flex items-center text-xs font-bold text-green-900">
              Hierarchical Rows (Parent/Child)
              <Tooltip text="If checked, enables parent/child row detection. Child rows with blank leading columns inherit metadata from the previous row." />
            </label>
            <input 
              type="checkbox" 
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
              checked={tab.hierarchical_rows || false}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange({...tab, hierarchical_rows: true});
                } else {
                  const newTab = { ...tab };
                  delete newTab.hierarchical_rows;
                  onChange(newTab);
                }
              }}
            />
          </div>
        </div>

        {/* Exclude Columns */}
        {renderMultiSelect('Exclude Columns', 'Column headers to completely hide from the public API (e.g. internal_notes, pricing)', tab.excludeColumns, (v) => onChange({...tab, excludeColumns: v}), 'exclude-cols')}

        {/* Image Columns */}
        {renderMultiSelect('Image Columns', 'Column headers containing Google Drive image links to auto-convert to WebP.', Array.isArray(tab.imageColumns) ? tab.imageColumns : (tab.imageColumns ? [tab.imageColumns as string] : undefined), (v) => onChange({...tab, imageColumns: v}), 'img-cols')}

        {/* Exclude Rows Where (Smart Combobox) */}
        <div className="border border-orange-100 bg-orange-50/30 p-3 rounded-md mt-2 transition-all">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center text-xs font-bold text-orange-900">
              Exclude Rows (Conditional)
              <Tooltip text="Skip importing rows if a specific column matches a specific value." />
            </label>
            <button 
              type="button"
              onClick={() => {
                const newRules = [...(tab.excludeRowsWhere || []), { column: '', equals: '' }];
                onChange({...tab, excludeRowsWhere: newRules});
              }}
              className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-800 px-2 py-1 rounded font-medium cursor-pointer"
            >
              + Add Rule
            </button>
          </div>
          
          {tab.excludeRowsWhere?.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-2 mt-2">
              <div className="w-1/2">
                <input 
                  type="text"
                  list={`exclude-rule-cols-${tab.gid}-${idx}`}
                  placeholder="Column (e.g. status)"
                  className="w-full border border-orange-200 rounded p-1.5 text-xs bg-white font-mono"
                  value={rule.column}
                  onChange={(e) => {
                    const newRules = [...tab.excludeRowsWhere!];
                    newRules[idx] = { ...newRules[idx], column: e.target.value };
                    onChange({...tab, excludeRowsWhere: newRules});
                  }}
                />
                <datalist id={`exclude-rule-cols-${tab.gid}-${idx}`}>
                  {tabColumns.map(col => <option key={col} value={col} />)}
                </datalist>
              </div>

              <span className="text-xs text-gray-500 font-mono">==</span>

              <input 
                type="text"
                placeholder="Value (e.g. draft)"
                className="w-1/2 border border-orange-200 rounded p-1.5 text-xs bg-white"
                value={rule.equals}
                onChange={(e) => {
                  const newRules = [...tab.excludeRowsWhere!];
                  newRules[idx] = { ...newRules[idx], equals: e.target.value };
                  onChange({...tab, excludeRowsWhere: newRules});
                }}
              />
              <button 
                type="button"
                onClick={() => {
                  const newRules = [...tab.excludeRowsWhere!];
                  newRules.splice(idx, 1);
                  onChange({...tab, excludeRowsWhere: newRules.length > 0 ? newRules : undefined});
                }}
                className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
              >✕</button>
            </div>
          ))}
        </div>

        {/* Split Columns (Smart Combobox) */}
        <div className="border border-blue-100 bg-blue-50/30 p-3 rounded-md mt-2 transition-all">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center text-xs font-bold text-blue-900">
              Split Columns (Array Generation)
              <Tooltip text="Convert a comma-separated string in a cell into a real JSON array." />
            </label>
            <button 
              type="button"
              onClick={() => {
                const newSplit = [...(tab.splitColumns || []), { column: '', delimiter: ',' }];
                onChange({...tab, splitColumns: newSplit});
              }}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded font-medium cursor-pointer"
            >
              + Add Split
            </button>
          </div>
          
          {tab.splitColumns?.map((split, idx) => (
            <div key={idx} className="flex items-center gap-2 mt-2">
              <div className="w-2/3">
                <input 
                  type="text"
                  list={`split-rule-cols-${tab.gid}-${idx}`}
                  placeholder="Column (e.g. tags)"
                  className="w-full border border-blue-200 rounded p-1.5 text-xs bg-white font-mono"
                  value={split.column}
                  onChange={(e) => {
                    const newSplit = [...tab.splitColumns!];
                    newSplit[idx] = { ...newSplit[idx], column: e.target.value };
                    onChange({...tab, splitColumns: newSplit});
                  }}
                />
                <datalist id={`split-rule-cols-${tab.gid}-${idx}`}>
                  {tabColumns.map(col => <option key={col} value={col} />)}
                </datalist>
              </div>

              <input 
                type="text"
                placeholder="Delimiter (,)"
                className="w-1/3 border border-blue-200 rounded p-1.5 text-xs font-mono text-center bg-white"
                value={split.delimiter}
                onChange={(e) => {
                  const newSplit = [...tab.splitColumns!];
                  newSplit[idx] = { ...newSplit[idx], delimiter: e.target.value };
                  onChange({...tab, splitColumns: newSplit});
                }}
              />
              <button 
                type="button"
                onClick={() => {
                  const newSplit = [...tab.splitColumns!];
                  newSplit.splice(idx, 1);
                  onChange({...tab, splitColumns: newSplit.length > 0 ? newSplit : undefined});
                }}
                className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
              >✕</button>
            </div>
          ))}
        </div>

        {/* AI Search Config */}
        <div className="border border-indigo-100 bg-indigo-50/30 p-3 rounded-md mt-2 transition-all">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center text-xs font-bold text-indigo-900">
              Include in AI Search (llms.txt)
              <Tooltip text="If checked, this tab's data will be compressed into the llms.txt file for ChatGPT/Claude to read." />
            </label>
            <input 
              type="checkbox" 
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
              checked={tab.aiSearch === undefined || tab.aiSearch.enabled !== false}
              onChange={(e) => {
                if (e.target.checked) {
                  const newAiSearch = tab.aiSearch ? { ...tab.aiSearch, enabled: true } : { enabled: true };
                  onChange({...tab, aiSearch: newAiSearch});
                } else {
                  onChange({...tab, aiSearch: { enabled: false }});
                }
              }}
            />
          </div>
          
          {(tab.aiSearch === undefined || tab.aiSearch.enabled !== false) && (
            <div className="space-y-3 mt-3">
              {renderMultiSelect('Title Columns', 'First valid column found is used as the item title.', tab.aiSearch?.titleColumns, (v) => {
                const newAiSearch = { 
                  ...(tab.aiSearch || { enabled: true }), 
                  titleColumns: v
                };
                onChange({...tab, aiSearch: newAiSearch});
              }, 'ai-title')}
              
              {renderMultiSelect('Metadata Columns', 'Exposed as key-value pairs for LLMs.', tab.aiSearch?.metadataColumns, (v) => {
                const newAiSearch = { 
                  ...(tab.aiSearch || { enabled: true }), 
                  metadataColumns: v
                };
                onChange({...tab, aiSearch: newAiSearch});
              }, 'ai-meta')}
            </div>
          )}
        </div>

        {/* Auto Generate ID Config */}
        <div className="border border-green-100 bg-green-50/30 p-3 rounded-md mt-2 transition-all">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center text-xs font-bold text-green-900">
              Auto Generate IDs
              <Tooltip text="If checked, the backend will automatically generate unique stable IDs for records without one." />
            </label>
            <input 
              type="checkbox" 
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
              checked={tab.autoGenerateId?.enabled || false}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange({...tab, autoGenerateId: { enabled: true, field: 'id', prefix: 'item', start: 100001 }});
                } else {
                  const { autoGenerateId, ...rest } = tab;
                  onChange(rest);
                }
              }}
            />
          </div>
          
          {tab.autoGenerateId?.enabled && (
            <div className="space-y-3 mt-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Target Field</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white font-mono"
                  value={tab.autoGenerateId.field || 'id'}
                  onChange={(e) => {
                    onChange({...tab, autoGenerateId: { ...tab.autoGenerateId!, field: e.target.value }});
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Prefix</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white font-mono"
                    value={tab.autoGenerateId.prefix}
                    onChange={(e) => {
                      onChange({...tab, autoGenerateId: { ...tab.autoGenerateId!, prefix: e.target.value }});
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Starting Number</label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white font-mono"
                    value={tab.autoGenerateId.start}
                    onChange={(e) => {
                      onChange({...tab, autoGenerateId: { ...tab.autoGenerateId!, start: parseInt(e.target.value) || 0 }});
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 🟣 Merge Sources (Extension / Union Mapping) */}
        <div className="border border-purple-200 bg-purple-50/20 p-3 rounded-md mt-2 transition-all">
          <div className="flex items-center justify-between mb-1">
            <div>
              <label className="flex items-center text-xs font-bold text-purple-950">
                Merge External Sources (Google Forms / Secondary Sheets)
                <Tooltip text="Seamlessly merge secondary sheets (such as Google Form intake responses) into this tab with visual column mapping and defaults." />
              </label>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Appends records from another spreadsheet (e.g. intake forms) into this dataset at compile time.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newSources = [
                  ...(tab.mergeSources || []),
                  {
                    name: 'Intake Form Responses',
                    spreadsheetId: '',
                    gid: 0,
                    columnMapping: {},
                    defaults: { source_type: 'intake_form', approval_status: 'Approved' },
                    autoGenerateId: { enabled: true, prefix: 'inst_form', start: 200001 }
                  }
                ];
                onChange({ ...tab, mergeSources: newSources });
              }}
              className="flex items-center gap-1 text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-2.5 py-1 rounded font-medium transition-colors cursor-pointer shrink-0"
            >
              <Plus size={13} /> Add Merge Source
            </button>
          </div>

          {tab.mergeSources && tab.mergeSources.length > 0 ? (
            <div className="space-y-3 mt-3">
              {tab.mergeSources.map((source, sIdx) => (
                <MergeSourceCard
                  key={sIdx}
                  source={source}
                  primaryColumns={tabColumns}
                  columnRegistry={columnRegistry}
                  onRegisterColumns={onRegisterColumns}
                  onChange={(updatedSource) => {
                    const newSources = [...tab.mergeSources!];
                    newSources[sIdx] = updatedSource;
                    onChange({ ...tab, mergeSources: newSources });
                  }}
                  onRemove={() => {
                    const newSources = tab.mergeSources!.filter((_, idx) => idx !== sIdx);
                    onChange({
                      ...tab,
                      mergeSources: newSources.length > 0 ? newSources : undefined
                    });
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic mt-1">No secondary merge sources configured for this tab.</p>
          )}
        </div>
      </div>
    </div>
  );
}
