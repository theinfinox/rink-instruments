import React, { useState } from 'react';
import Tooltip from './Tooltip';
import { MergeSourceConfig } from './types';
import { Loader2, ArrowRight, Plus, Trash2 } from 'lucide-react';

const COMMON_TARGET_COLUMNS = [
  'instruments',
  'institution_name',
  'district',
  'tag',
  'image_link',
  'specifications',
  'address',
  'name_of_facility',
  'enquiry_mail',
  'enquiry_contact_number',
  'website_booking_link',
  'acronym',
  'provider_key'
];

export default function MergeSourceCard({
  source,
  primaryColumns = [],
  columnRegistry = {},
  onRegisterColumns,
  onChange,
  onRemove
}: {
  source: MergeSourceConfig;
  primaryColumns?: string[];
  columnRegistry?: Record<string, string[]>;
  onRegisterColumns?: (sheetId: string, gid: number | string, cols: string[]) => void;
  onChange: (updated: MergeSourceConfig) => void;
  onRemove: () => void;
}) {
  const [localColumns, setLocalColumns] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read from columnRegistry if available, else local state
  const sourceColumns = columnRegistry[`${source.spreadsheetId}_${source.gid || 0}`] || localColumns;

  const fetchSourceColumns = async () => {
    if (!source.spreadsheetId) {
      setError('Enter Source Spreadsheet ID first');
      return;
    }
    setIsFetching(true);
    setError(null);
    try {
      const res = await fetch(`/api/sheet-metadata?spreadsheetId=${source.spreadsheetId}&gid=${source.gid || 0}`);
      const data = await res.json();
      if (res.ok && data.columns) {
        setLocalColumns(data.columns);
        if (onRegisterColumns) onRegisterColumns(source.spreadsheetId, source.gid || 0, data.columns);
      } else {
        setError(data.error || 'Failed to fetch columns');
      }
    } catch (err) {
      setError('Network error fetching columns');
    } finally {
      setIsFetching(false);
    }
  };

  // ── Column Mapping Handlers ─────────────────────────────────────
  const mappingEntries = Object.entries(source.columnMapping || {});

  const updateMappingKey = (oldKey: string, newKey: string, targetVal: string) => {
    const newMapping = { ...(source.columnMapping || {}) };
    if (oldKey !== newKey) {
      delete newMapping[oldKey];
    }
    if (newKey.trim()) {
      newMapping[newKey.trim()] = targetVal;
    }
    onChange({ ...source, columnMapping: Object.keys(newMapping).length > 0 ? newMapping : undefined });
  };

  const updateMappingVal = (sourceKey: string, newVal: string) => {
    const newMapping = { ...(source.columnMapping || {}) };
    newMapping[sourceKey] = newVal.trim();
    onChange({ ...source, columnMapping: newMapping });
  };

  const removeMapping = (sourceKey: string) => {
    const newMapping = { ...(source.columnMapping || {}) };
    delete newMapping[sourceKey];
    onChange({ ...source, columnMapping: Object.keys(newMapping).length > 0 ? newMapping : undefined });
  };

  const addMappingRow = () => {
    const newMapping = { ...(source.columnMapping || {}) };
    const defaultKey = sourceColumns.find(col => !newMapping[col]) || `source_col_${mappingEntries.length + 1}`;
    newMapping[defaultKey] = 'instruments';
    onChange({ ...source, columnMapping: newMapping });
  };

  // ── Defaults Handlers ───────────────────────────────────────────
  const defaultEntries = Object.entries(source.defaults || {});

  const updateDefaultKey = (oldKey: string, newKey: string, val: string) => {
    const newDefaults = { ...(source.defaults || {}) };
    if (oldKey !== newKey) {
      delete newDefaults[oldKey];
    }
    if (newKey.trim()) {
      newDefaults[newKey.trim()] = val;
    }
    onChange({ ...source, defaults: Object.keys(newDefaults).length > 0 ? newDefaults : undefined });
  };

  const updateDefaultVal = (key: string, val: string) => {
    const newDefaults = { ...(source.defaults || {}) };
    newDefaults[key] = val;
    onChange({ ...source, defaults: newDefaults });
  };

  const removeDefault = (key: string) => {
    const newDefaults = { ...(source.defaults || {}) };
    delete newDefaults[key];
    onChange({ ...source, defaults: Object.keys(newDefaults).length > 0 ? newDefaults : undefined });
  };

  const addDefaultRow = () => {
    const newDefaults = { ...(source.defaults || {}) };
    newDefaults['source_type'] = 'intake_form';
    onChange({ ...source, defaults: newDefaults });
  };

  // Target suggestions: combine primary tab columns + common canonical keys
  const targetSuggestions = Array.from(new Set([...primaryColumns, ...COMMON_TARGET_COLUMNS]));

  return (
    <div className="bg-purple-50/40 p-4 rounded-lg border border-purple-200 mt-3 relative transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800">
            External Merge Source
          </span>
          <span className="text-sm font-semibold text-gray-800">
            {source.name || 'Untitled Merge Source'}
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
        >
          <Trash2 size={13} /> Remove
        </button>
      </div>

      {/* Source Basic Identity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="flex items-center text-xs font-medium text-gray-700">
            Source Label
            <Tooltip text="Human-readable label for this intake form or external sheet." />
          </label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded p-1.5 text-sm bg-white focus:ring-purple-500 focus:border-purple-500"
            value={source.name || ''}
            onChange={(e) => onChange({ ...source, name: e.target.value })}
            placeholder="e.g. Intake Form Responses"
          />
        </div>

        <div>
          <label className="flex items-center text-xs font-medium text-gray-700">
            Spreadsheet ID <span className="text-red-500 ml-1">*</span>
            <Tooltip text="Google Spreadsheet ID of the external sheet or form responses." />
          </label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded p-1.5 text-sm font-mono bg-white focus:ring-purple-500 focus:border-purple-500"
            value={source.spreadsheetId}
            onChange={(e) => onChange({ ...source, spreadsheetId: e.target.value })}
            placeholder="1yECxIL-BGmUiI..."
            required
          />
        </div>

        <div>
          <label className="flex items-center text-xs font-medium text-gray-700">
            GID <span className="text-red-500 ml-1">*</span>
            <Tooltip text="Worksheet tab ID (e.g. 0)" />
          </label>
          <div className="flex mt-1 gap-2">
            <input
              type="number"
              className="block w-full border border-gray-300 rounded p-1.5 text-sm font-mono bg-white focus:ring-purple-500 focus:border-purple-500"
              value={source.gid}
              onChange={(e) => onChange({ ...source, gid: parseInt(e.target.value) || 0 })}
              required
            />
            <button
              type="button"
              onClick={fetchSourceColumns}
              disabled={isFetching}
              className="whitespace-nowrap flex items-center gap-1 bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 rounded border border-purple-300 text-xs font-medium transition-colors cursor-pointer"
            >
              {isFetching ? <Loader2 className="animate-spin" size={13} /> : 'Fetch Columns'}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          {sourceColumns.length > 0 && (
            <p className="text-xs text-green-700 mt-1">✓ Loaded {sourceColumns.length} form columns</p>
          )}
        </div>
      </div>

      {/* 🔄 Visual Column Mapping */}
      <div className="bg-white p-3 rounded-md border border-purple-100 mb-3 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center text-xs font-bold text-purple-950">
            Column Mapping (Source Header ➔ Target Field)
            <Tooltip text="Maps external/form headers to canonical keys in the primary tab (e.g. instrumentation_details -> instruments)." />
          </label>
          <button
            type="button"
            onClick={addMappingRow}
            className="flex items-center gap-1 text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-2.5 py-1 rounded font-medium transition-colors cursor-pointer"
          >
            <Plus size={13} /> Add Mapping
          </button>
        </div>

        {mappingEntries.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No column mappings added. Headers with identical names will map automatically.</p>
        ) : (
          <div className="space-y-2 mt-2">
            {mappingEntries.map(([srcKey, targetVal], idx) => (
              <div key={idx} className="flex items-center gap-2">
                {/* Source Column Smart Combobox */}
                <div className="w-1/2 flex items-center gap-1">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      list={`src-cols-${source.gid}-${idx}`}
                      className="w-full border border-gray-300 rounded p-1.5 text-xs font-mono bg-white"
                      placeholder="Source header (e.g. column_13)"
                      value={srcKey}
                      onChange={(e) => updateMappingKey(srcKey, e.target.value, targetVal)}
                    />
                    <datalist id={`src-cols-${source.gid}-${idx}`}>
                      {sourceColumns.map(col => (
                        <option key={col} value={col} />
                      ))}
                    </datalist>
                  </div>

                  {sourceColumns.length > 0 && (
                    <select
                      className="border border-gray-200 rounded p-1.5 text-xs bg-gray-50 text-gray-600 max-w-[100px] truncate"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          updateMappingKey(srcKey, e.target.value, targetVal);
                        }
                      }}
                    >
                      <option value="" disabled>Pick...</option>
                      {sourceColumns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  )}
                </div>

                <ArrowRight size={14} className="text-purple-400 shrink-0" />

                {/* Target Canonical Column Smart Combobox */}
                <div className="w-1/2 flex items-center gap-1">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      list={`target-cols-${source.gid}-${idx}`}
                      className="w-full border border-gray-300 rounded p-1.5 text-xs font-mono bg-white"
                      placeholder="Target key (e.g. instruments)"
                      value={targetVal}
                      onChange={(e) => updateMappingVal(srcKey, e.target.value)}
                    />
                    <datalist id={`target-cols-${source.gid}-${idx}`}>
                      {targetSuggestions.map(col => (
                        <option key={col} value={col} />
                      ))}
                    </datalist>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeMapping(srcKey)}
                    className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ⚙️ Default Values & Injections */}
      <div className="bg-white p-3 rounded-md border border-purple-100 mb-3 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center text-xs font-bold text-purple-950">
            Default Values (Static Fallback Injection)
            <Tooltip text="Injected into merged rows if the mapped field is blank or missing (e.g. source_type = intake_form)." />
          </label>
          <button
            type="button"
            onClick={addDefaultRow}
            className="flex items-center gap-1 text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-2.5 py-1 rounded font-medium transition-colors cursor-pointer"
          >
            <Plus size={13} /> Add Default
          </button>
        </div>

        {defaultEntries.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No default injections configured.</p>
        ) : (
          <div className="space-y-2 mt-2">
            {defaultEntries.map(([defKey, defVal], idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  className="w-1/2 border border-gray-300 rounded p-1.5 text-xs font-mono"
                  placeholder="Key (e.g. approval_status)"
                  value={defKey}
                  onChange={(e) => updateDefaultKey(defKey, e.target.value, defVal)}
                />
                <span className="text-xs font-mono text-gray-400">=</span>
                <input
                  type="text"
                  className="w-1/2 border border-gray-300 rounded p-1.5 text-xs"
                  placeholder="Value (e.g. Approved)"
                  value={defVal}
                  onChange={(e) => updateDefaultVal(defKey, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeDefault(defKey)}
                  className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🆔 Auto Generate ID Config */}
      <div className="bg-white p-3 rounded-md border border-purple-100 mb-3 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center text-xs font-bold text-purple-950">
            Namespaced Auto-ID Generation
            <Tooltip text="Ensures newly merged records receive safe, collision-proof IDs (e.g. inst_form_200001)." />
          </label>
          <input
            type="checkbox"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
            checked={source.autoGenerateId?.enabled ?? true}
            onChange={(e) => {
              if (e.target.checked) {
                onChange({
                  ...source,
                  autoGenerateId: { enabled: true, field: 'id', prefix: 'inst_form', start: 200001 }
                });
              } else {
                const { autoGenerateId, ...rest } = source;
                onChange(rest);
              }
            }}
          />
        </div>

        {(source.autoGenerateId?.enabled ?? true) && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Prefix</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-1.5 text-xs font-mono bg-white"
                value={source.autoGenerateId?.prefix ?? 'inst_form'}
                onChange={(e) =>
                  onChange({
                    ...source,
                    autoGenerateId: {
                      enabled: true,
                      field: source.autoGenerateId?.field || 'id',
                      prefix: e.target.value,
                      start: source.autoGenerateId?.start ?? 200001
                    }
                  })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Starting Number</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded p-1.5 text-xs font-mono bg-white"
                value={source.autoGenerateId?.start ?? 200001}
                onChange={(e) =>
                  onChange({
                    ...source,
                    autoGenerateId: {
                      enabled: true,
                      field: source.autoGenerateId?.field || 'id',
                      prefix: source.autoGenerateId?.prefix ?? 'inst_form',
                      start: parseInt(e.target.value) || 200001
                    }
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* 🚫 Exclude Rows & Hierarchical Rows */}
      <div className="bg-white p-3 rounded-md border border-purple-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center text-xs font-bold text-purple-950">
            Hierarchical Rows (Parent/Child)
            <Tooltip text="If checked, blank leading columns in form entries will inherit values from the previous row." />
          </label>
          <input
            type="checkbox"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
            checked={source.hierarchical_rows || false}
            onChange={(e) => {
              if (e.target.checked) {
                onChange({ ...source, hierarchical_rows: true });
              } else {
                const newSource = { ...source };
                delete newSource.hierarchical_rows;
                onChange(newSource);
              }
            }}
          />
        </div>

        {/* Conditional Exclude Rows */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="flex items-center text-xs font-bold text-purple-950">
              Exclude Rows (Conditional)
              <Tooltip text="Drop header rows or draft submissions (e.g. exclude where instrumentation_details == Name of the Instrument)." />
            </label>
            <button
              type="button"
              onClick={() => {
                const newRules = [...(source.excludeRowsWhere || []), { column: '', equals: '' }];
                onChange({ ...source, excludeRowsWhere: newRules });
              }}
              className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-0.5 rounded font-medium cursor-pointer"
            >
              + Add Rule
            </button>
          </div>

          {source.excludeRowsWhere?.map((rule, rIdx) => (
            <div key={rIdx} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Column header"
                className="w-1/2 border border-gray-300 rounded p-1.5 text-xs font-mono"
                value={rule.column}
                onChange={(e) => {
                  const newRules = [...source.excludeRowsWhere!];
                  newRules[rIdx] = { ...newRules[rIdx], column: e.target.value };
                  onChange({ ...source, excludeRowsWhere: newRules });
                }}
              />
              <span className="text-xs text-gray-400 font-mono">==</span>
              <input
                type="text"
                placeholder="Value to drop"
                className="w-1/2 border border-gray-300 rounded p-1.5 text-xs"
                value={rule.equals}
                onChange={(e) => {
                  const newRules = [...source.excludeRowsWhere!];
                  newRules[rIdx] = { ...newRules[rIdx], equals: e.target.value };
                  onChange({ ...source, excludeRowsWhere: newRules });
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const newRules = [...source.excludeRowsWhere!];
                  newRules.splice(rIdx, 1);
                  onChange({ ...source, excludeRowsWhere: newRules.length > 0 ? newRules : undefined });
                }}
                className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
