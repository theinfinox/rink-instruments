import React, { useState } from 'react';
import TabCard from './TabCard';
import TaxonomyBuilder from './TaxonomyBuilder';
import Tooltip from './Tooltip';
import { SheetConfig } from './types';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function SheetCard({ 
  sheet, 
  onChange, 
  onRemove,
  isExpanded = true,
  onToggleExpand
}: { 
  sheet: SheetConfig, 
  onChange: (s: SheetConfig) => void, 
  onRemove: () => void,
  isExpanded?: boolean,
  onToggleExpand?: () => void
}) {
  const [sheetColumns, setSheetColumns] = useState<string[]>([]);

  const addTab = () => {
    onChange({
      ...sheet,
      tabs: [...(sheet.tabs || []), { name: 'New Tab', gid: 0 }]
    });
  };

  const updateTab = (index: number, updatedTab: import('./types').TabConfig) => {
    const newTabs = [...sheet.tabs];
    newTabs[index] = updatedTab;
    onChange({ ...sheet, tabs: newTabs });
  };

  const removeTab = (index: number) => {
    const newTabs = [...sheet.tabs];
    newTabs.splice(index, 1);
    onChange({ ...sheet, tabs: newTabs });
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${isExpanded ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-200'} relative transition-all duration-300 hover:shadow-md mt-4 overflow-hidden`}>
      
      {/* Accordion Header */}
      <div 
        className={`p-4 flex items-center justify-between cursor-pointer select-none transition-colors ${isExpanded ? 'bg-blue-50/50 border-b border-blue-100' : 'hover:bg-gray-50'}`}
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-400">
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          <h3 className="font-semibold text-lg text-gray-800">
            {sheet.name || 'Untitled Sheet'}
          </h3>
          {!isExpanded && sheet.spreadsheetId && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded font-mono truncate max-w-[200px]">
              {sheet.spreadsheetId}
            </span>
          )}
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if(confirm('Are you sure you want to delete this sheet?')) onRemove();
          }}
          className="text-red-500 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded-md text-sm font-medium transition-all"
        >
          Delete
        </button>
      </div>

      {/* Accordion Body */}
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                Sheet Name <span className="text-red-500 ml-1">*</span>
                <Tooltip text="A friendly name for this dataset (e.g. 'Instruments')." />
              </label>
          <input 
            type="text" 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={sheet.name}
            onChange={(e) => onChange({...sheet, name: e.target.value})}
            placeholder="e.g. Lab Equipment"
            required
          />
        </div>
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            Spreadsheet ID <span className="text-red-500 ml-1">*</span>
            <Tooltip text="The long string of characters in the Google Sheet URL." />
          </label>
          <input 
            type="text" 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
            value={sheet.spreadsheetId}
            onChange={(e) => onChange({...sheet, spreadsheetId: e.target.value})}
            placeholder="1BxiMVs0XRX5nZy..."
            required
          />
        </div>
      </div>

      <div className="mb-6 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-md font-semibold text-gray-800">Tabs Configuration</h3>
          <button 
            onClick={addTab}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded"
          >
            + Add Tab
          </button>
        </div>
        {sheet.tabs?.map((tab, index) => (
          <TabCard 
            key={index} 
            tab={tab}
            spreadsheetId={sheet.spreadsheetId}
            onColumnsFetched={setSheetColumns}
            onChange={(t) => updateTab(index, t)}
            onRemove={() => removeTab(index)}
          />
        ))}
      </div>

          <div className="border-t border-gray-100 pt-6 mt-6">
            <div className="flex items-center mb-4">
              <h3 className="text-md font-semibold text-gray-800">Dynamic Filter Taxonomy</h3>
              <Tooltip text="Visually build the nested dropdown menus for the frontend sidebar." />
            </div>
            <TaxonomyBuilder 
              taxonomy={sheet.filterTaxonomy} 
              availableColumns={sheetColumns}
              tabs={sheet.tabs || []}
              onChange={(tax) => onChange({...sheet, filterTaxonomy: tax})} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
