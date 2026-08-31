import React, { useState, useRef, KeyboardEvent } from 'react';
import Tooltip from './Tooltip';
import { TaxonomyCategory, TabConfig } from './types';

// ─── Tag Bubble Input ────────────────────────────────────────────────────────
function TagInput({ tags, onChange, placeholder }: { tags: string[], onChange: (t: string[]) => void, placeholder?: string }) {
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const val = raw.trim();
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
    }
    setInputVal('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === ' ' && inputVal.trim()) {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const items = pasted.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
    const newTags = [...tags];
    items.forEach(item => { if (!newTags.includes(item)) newTags.push(item); });
    onChange(newTags);
  };

  return (
    <div
      className="flex flex-wrap gap-1 border border-gray-300 rounded p-1.5 min-h-[38px] cursor-text bg-white focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition-all"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map(tag => (
        <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(tags.filter(t => t !== tag)); }}
            className="text-indigo-400 hover:text-indigo-700 focus:outline-none leading-none cursor-pointer"
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputVal}
        onChange={e => setInputVal(e.target.value)}
        onKeyDown={handleKey}
        onPaste={handlePaste}
        onBlur={() => { if (inputVal.trim()) addTag(inputVal); }}
        className="outline-none text-sm flex-1 min-w-[100px] bg-transparent placeholder:text-gray-400"
        placeholder={tags.length === 0 ? (placeholder || 'Type and press , or Enter...') : ''}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TaxonomyBuilder({ 
  taxonomy, 
  availableColumns = [], 
  columnRegistry = {},
  sheetSpreadsheetId,
  tabs = [], 
  onChange 
}: {
  taxonomy?: TaxonomyCategory[],
  availableColumns?: string[],
  columnRegistry?: Record<string, string[]>,
  sheetSpreadsheetId?: string,
  tabs?: TabConfig[],
  onChange: (tax?: TaxonomyCategory[]) => void
}) {
  const currentTaxonomy = taxonomy || [];

  const getColumnsForGid = (gid?: number) => {
    if (gid !== undefined && sheetSpreadsheetId && columnRegistry[`${sheetSpreadsheetId}_${gid}`]) {
      return columnRegistry[`${sheetSpreadsheetId}_${gid}`];
    }
    return availableColumns;
  };

  const addCategoryPrompt = () => {
    const id = prompt('Enter the column ID to filter by (e.g. district, tag):');
    if (id && !currentTaxonomy.find(c => c.id === id)) {
      const title = id.charAt(0).toUpperCase() + id.slice(1);
      onChange([...currentTaxonomy, { id, title, groups: {} }]);
    }
  };

  const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    if (!currentTaxonomy.find(c => c.id === id)) {
      const title = id.charAt(0).toUpperCase() + id.slice(1);
      const defaultGid = tabs.length > 0 ? tabs[0].gid : undefined;
      onChange([...currentTaxonomy, { id, title, gid: defaultGid, groups: {} }]);
    }
    e.target.value = '';
  };

  const addStandaloneValues = (categoryId: string) => {
    onChange(currentTaxonomy.map(c =>
      c.id === categoryId && !c.groups['']
        ? { ...c, groups: { '': [], ...c.groups } }
        : c
    ));
  };

  const addGroup = (categoryId: string) => {
    const name = prompt(`Enter group name (e.g. South Zone):`);
    if (name && name !== '') {
      onChange(currentTaxonomy.map(c =>
        c.id === categoryId && !c.groups[name]
          ? { ...c, groups: { ...c.groups, [name]: [] } }
          : c
      ));
    }
  };

  const setGroupTags = (categoryId: string, group: string, tags: string[]) => {
    onChange(currentTaxonomy.map(c =>
      c.id === categoryId
        ? { ...c, groups: { ...c.groups, [group]: tags } }
        : c
    ));
  };

  const removeCategory = (categoryId: string) => {
    const newTax = currentTaxonomy.filter(c => c.id !== categoryId);
    onChange(newTax.length > 0 ? newTax : undefined);
  };

  const removeGroup = (categoryId: string, group: string) => {
    onChange(currentTaxonomy.map(c => {
      if (c.id === categoryId) {
        const newGroups = { ...c.groups };
        delete newGroups[group];
        return { ...c, groups: newGroups };
      }
      return c;
    }));
  };

  const renameCategoryTitle = (categoryId: string, oldTitle: string) => {
    const newTitle = prompt('Enter new UI title for this filter:', oldTitle);
    if (!newTitle || newTitle === oldTitle) return;
    onChange(currentTaxonomy.map(c => c.id === categoryId ? { ...c, title: newTitle } : c));
  };

  const renameCategoryId = (oldId: string) => {
    const newId = prompt('Enter new column header to filter by:', oldId);
    if (!newId || newId === oldId || currentTaxonomy.find(c => c.id === newId)) return;
    onChange(currentTaxonomy.map(c => c.id === oldId ? { ...c, id: newId } : c));
  };

  const renameGroup = (categoryId: string, oldGroup: string) => {
    if (oldGroup === '') return;
    const newGroup = prompt(`Enter new group name:`, oldGroup);
    if (!newGroup || newGroup === oldGroup) return;
    onChange(currentTaxonomy.map(c => {
      if (c.id === categoryId && !c.groups[newGroup]) {
        const newGroups = { ...c.groups };
        newGroups[newGroup] = newGroups[oldGroup];
        delete newGroups[oldGroup];
        return { ...c, groups: newGroups };
      }
      return c;
    }));
  };

  const updateJoinSource = (
    categoryId: string,
    field: keyof NonNullable<TaxonomyCategory['joinSource']>,
    value: unknown
  ) => {
    onChange(currentTaxonomy.map(c => {
      if (c.id !== categoryId) return c;
      const currentJoin = c.joinSource || {
        gid: tabs[0]?.gid || 0,
        foreignKey: '',
        groupByColumn: '',
        displayColumn: '',
        groupByDelimiter: ',',
        autoDiscover: true,
      };
      return {
        ...c,
        joinSource: {
          ...currentJoin,
          [field]: value,
        }
      };
    }));
  };

  const toggleLinkType = (categoryId: string, current?: 'join') => {
    onChange(currentTaxonomy.map(c => {
      if (c.id !== categoryId) return c;
      if (current === 'join') {
        const { linkType, joinSource, ...rest } = c as typeof c & { linkType?: 'join'; joinSource?: unknown };
        return rest as typeof c;
      }
      return {
        ...c,
        linkType: 'join' as const,
        joinSource: c.joinSource || {
          gid: tabs[0]?.gid || 0,
          foreignKey: '',
          groupByColumn: '',
          displayColumn: '',
          groupByDelimiter: ',',
          autoDiscover: true,
        }
      };
    }));
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
      <div className="mb-4">
        {availableColumns.length > 0 ? (
          <select
            onChange={handleSelectCategory}
            defaultValue=""
            className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer truncate max-w-full"
          >
            <option value="" disabled>+ Select Filter Category...</option>
            {availableColumns.map(col => (
              <option key={col} value={col} disabled={currentTaxonomy.some(c => c.id === col)}>{col}</option>
            ))}
          </select>
        ) : (
          <button
            onClick={addCategoryPrompt}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer"
          >
            + Add Filter Category
          </button>
        )}
      </div>

      <div className="space-y-4">
        {currentTaxonomy.map(category => {
          const catColumns = getColumnsForGid(category.gid);
          const lookupColumns = getColumnsForGid(category.joinSource?.gid);

          return (
            <div key={category.id} className="border border-indigo-100 bg-white p-4 rounded relative shadow-sm">
              <button
                type="button"
                onClick={() => removeCategory(category.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xs font-medium cursor-pointer"
              >
                Remove Category
              </button>

              {/* Title & Column ID */}
              <h4 className="font-bold text-indigo-900 mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                Title:
                <button
                  type="button"
                  onClick={() => renameCategoryTitle(category.id, category.title)}
                  className="text-indigo-600 hover:text-indigo-800 border-b border-dashed border-indigo-300 cursor-pointer transition-colors"
                  title="Click to rename UI Title"
                >
                  {category.title}
                </button>

                <span className="text-gray-400 font-normal text-xs">|</span>
                Column ID:
                {catColumns.length > 0 ? (
                  <select
                    onChange={(e) => {
                      const newId = e.target.value;
                      if (!newId || newId === category.id || currentTaxonomy.find(c => c.id === newId)) return;
                      onChange(currentTaxonomy.map(c => c.id === category.id ? { ...c, id: newId } : c));
                    }}
                    value={category.id}
                    className="bg-indigo-100 hover:bg-indigo-200 px-1.5 py-0.5 rounded text-indigo-800 cursor-pointer transition-colors text-sm font-mono border-none focus:ring-0 truncate max-w-[150px]"
                  >
                    <option value={category.id}>{category.id}</option>
                    {catColumns.filter(c => c !== category.id).map(col => (
                      <option key={col} value={col} disabled={currentTaxonomy.some(c => c.id === col)}>{col}</option>
                    ))}
                  </select>
                ) : (
                  <button
                    type="button"
                    onClick={() => renameCategoryId(category.id)}
                    className="bg-indigo-100 hover:bg-indigo-200 px-1.5 py-0.5 rounded text-indigo-800 cursor-pointer transition-colors"
                  >
                    <code>{category.id}</code>
                  </button>
                )}
                <Tooltip text="The exact column header in Google Sheets that will be used to filter." />
              </h4>

              {/* GID Tab Selector */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-purple-700">Source Tab (GID):</span>
                {tabs.length > 0 ? (
                  <select
                    value={category.gid ?? ''}
                    onChange={(e) => {
                      const gid = e.target.value ? parseInt(e.target.value) : undefined;
                      onChange(currentTaxonomy.map(c => c.id === category.id ? { ...c, gid } : c));
                    }}
                    className="bg-purple-50 border border-purple-200 text-purple-800 px-2 py-1 rounded text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-400 truncate max-w-full"
                  >
                    <option value="">-- Select tab --</option>
                    {tabs.map(t => (
                      <option key={t.gid} value={t.gid}>{t.name} (GID: {t.gid})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    placeholder="Enter GID (e.g. 5695880)"
                    value={category.gid ?? ''}
                    onChange={(e) => {
                      const gid = e.target.value ? parseInt(e.target.value) : undefined;
                      onChange(currentTaxonomy.map(c => c.id === category.id ? { ...c, gid } : c));
                    }}
                    className="border border-purple-200 bg-purple-50 rounded px-2 py-1 text-xs font-mono w-40 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                )}
                {!category.gid && (
                  <span className="text-xs text-amber-600 font-medium">⚠ No GID set — filter may scan wrong tab</span>
                )}
                <Tooltip text="Which tab's rows should this filter read from?" />
              </div>

              {/* Link Type Toggle */}
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">Filter Mode:</span>
                <button
                  type="button"
                  onClick={() => toggleLinkType(category.id, category.linkType)}
                  className={`px-2 py-1 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                    category.linkType === 'join'
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.linkType === 'join' ? '🔗 Cross-Tab Join' : '📋 Direct Column'}
                </button>
                <span className="text-xs text-gray-400">
                  {category.linkType === 'join'
                    ? 'Groups auto-built from another tab via a shared key'
                    : 'Values matched directly from this tab'}
                </span>
              </div>

              {/* Join Source Config (only when linkType === join) */}
              {category.linkType === 'join' && (
                <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded space-y-2">
                  <p className="text-xs font-bold text-emerald-800 mb-1">🔗 Join Configuration</p>

                  {/* Lookup Tab GID */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-700 w-32 shrink-0">Lookup Tab:</span>
                    {tabs.length > 0 ? (
                      <select
                        value={category.joinSource?.gid ?? ''}
                        onChange={e => updateJoinSource(category.id, 'gid', parseInt(e.target.value))}
                        className="bg-white border border-emerald-300 text-emerald-900 px-2 py-1 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-400 flex-1 truncate max-w-full"
                      >
                        <option value="">-- Select lookup tab --</option>
                        {tabs.map(t => (
                          <option key={t.gid} value={t.gid}>{t.name} (GID: {t.gid})</option>
                        ))}
                      </select>
                    ) : (
                      <input type="number" placeholder="Lookup tab GID"
                        value={category.joinSource?.gid ?? ''}
                        onChange={e => updateJoinSource(category.id, 'gid', parseInt(e.target.value))}
                        className="border border-emerald-300 bg-white rounded px-2 py-1 text-xs font-mono flex-1 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    )}
                    <Tooltip text="The tab containing the lookup records (e.g. institution list)." />
                  </div>

                  {/* Foreign Key (Smart Combobox) */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-700 w-32 shrink-0">Foreign Key:</span>
                    <input 
                      type="text" 
                      list={`join-fk-${category.id}`}
                      placeholder="Column in lookup tab (e.g. provider_key)"
                      value={category.joinSource?.foreignKey ?? ''}
                      onChange={e => updateJoinSource(category.id, 'foreignKey', e.target.value)}
                      className="border border-emerald-300 bg-white rounded px-2 py-1 text-xs font-mono flex-1 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                    <datalist id={`join-fk-${category.id}`}>
                      {lookupColumns.map(col => <option key={col} value={col} />)}
                    </datalist>
                    <Tooltip text="Column in the lookup tab that matches the main data's filter column." />
                  </div>

                  {/* Group By Column (Smart Combobox) */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-700 w-32 shrink-0">Group By:</span>
                    <input 
                      type="text" 
                      list={`join-gb-${category.id}`}
                      placeholder="Column whose values become group names (e.g. institution_type)"
                      value={category.joinSource?.groupByColumn ?? ''}
                      onChange={e => updateJoinSource(category.id, 'groupByColumn', e.target.value)}
                      className="border border-emerald-300 bg-white rounded px-2 py-1 text-xs font-mono flex-1 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                    <datalist id={`join-gb-${category.id}`}>
                      {lookupColumns.map(col => <option key={col} value={col} />)}
                    </datalist>
                    <Tooltip text="Column in lookup tab to auto-group by (e.g. institution_type → 'State University')." />
                  </div>

                  {/* Display Column (Smart Combobox) */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-700 w-32 shrink-0">Display Name:</span>
                    <input 
                      type="text" 
                      list={`join-dn-${category.id}`}
                      placeholder="Column shown to user (e.g. institution_name)"
                      value={category.joinSource?.displayColumn ?? ''}
                      onChange={e => updateJoinSource(category.id, 'displayColumn', e.target.value)}
                      className="border border-emerald-300 bg-white rounded px-2 py-1 text-xs font-mono flex-1 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                    <datalist id={`join-dn-${category.id}`}>
                      {lookupColumns.map(col => <option key={col} value={col} />)}
                    </datalist>
                    <Tooltip text="Column in lookup tab shown as the filter label to users." />
                  </div>

                  {/* Delimiter + autoDiscover */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-700">Delimiter:</span>
                      <input type="text" placeholder=","
                        value={category.joinSource?.groupByDelimiter ?? ','}
                        onChange={e => updateJoinSource(category.id, 'groupByDelimiter', e.target.value)}
                        className="border border-emerald-300 bg-white rounded px-2 py-1 text-xs font-mono w-12 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                      <Tooltip text="If groupByColumn has multiple values per row (e.g. comma-separated), set the delimiter." />
                    </div>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={category.joinSource?.autoDiscover !== false}
                        onChange={e => updateJoinSource(category.id, 'autoDiscover', e.target.checked)}
                        className="accent-emerald-600"
                      />
                      <span className="text-xs text-emerald-700 font-medium">Auto-discover groups</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Groups & Values */}
              <div className="space-y-3 mb-3">
                {Object.keys(category.groups).length > 0 && (
                  <div className="space-y-3">
                    {category.linkType === 'join' && (
                      <p className="text-xs text-gray-500 italic">Manual override groups (optional — auto-discovered groups from joinSource are merged in at sync time)</p>
                    )}
                    {Object.keys(category.groups).map(group => (
                      <div key={group} className="bg-gray-50 p-3 rounded border border-gray-200">
                        {group !== '' && (
                          <div className="flex items-center justify-between mb-2">
                            <button 
                              type="button"
                              onClick={() => renameGroup(category.id, group)}
                              className="text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors cursor-pointer"
                              title="Click to rename group"
                            >
                              {group}
                            </button>
                            <button 
                              type="button"
                              onClick={() => removeGroup(category.id, group)}
                              className="text-gray-400 hover:text-red-500 text-sm cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        {group === '' && (
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500 italic">Standalone values (no group)</span>
                            <button 
                              type="button"
                              onClick={() => removeGroup(category.id, group)}
                              className="text-gray-400 hover:text-red-500 text-xs cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                        <TagInput
                          tags={category.groups[group]}
                          onChange={(tags) => setGroupTags(category.id, group, tags)}
                          placeholder={group === '' ? 'Add standalone values...' : category.linkType === 'join' ? 'Add foreign key values (e.g. ini_iit)...' : 'Add values (comma or Enter)...'}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                {!Object.keys(category.groups).includes('') && category.linkType !== 'join' && (
                  <button 
                    type="button"
                    onClick={() => addStandaloneValues(category.id)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded font-medium border border-gray-200 transition-colors cursor-pointer"
                  >
                    + Add Values (no group)
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => addGroup(category.id)}
                  className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-medium border border-indigo-200 transition-colors cursor-pointer"
                >
                  {category.linkType === 'join' ? '+ Manual Override Group' : '+ Add Named Group'}
                </button>
              </div>
            </div>
          );
        })}
        {currentTaxonomy.length === 0 && (
          <p className="text-sm text-gray-500 italic">No taxonomy filters defined.</p>
        )}
      </div>
    </div>
  );
}
