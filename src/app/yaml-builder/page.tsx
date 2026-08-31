'use client';

import React, { useState, useRef } from 'react';
import * as yaml from 'js-yaml';
import { Copy, Check, Plus, Upload } from 'lucide-react';
import SheetCard from '@/components/yaml-builder/SheetCard';
import { RinkConfig, SheetConfig } from '@/components/yaml-builder/types';

const defaultConfig: RinkConfig = {
  frontendBaseUrl: "",
  sheets: []
};

export default function YamlBuilderPage() {
  const [yamlInput, setYamlInput] = useState('');
  const [config, setConfig] = useState<RinkConfig>(defaultConfig);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // UX State: All sheets closed by default (-1)
  const [expandedSheetIndex, setExpandedSheetIndex] = useState<number>(-1);
  const endOfListRef = useRef<HTMLDivElement>(null);

  // Parse YAML to JS Object
  const handleParse = (input: string) => {
    setYamlInput(input);
    try {
      if (!input.trim()) {
        setConfig(defaultConfig);
        setError(null);
        return;
      }
      const parsed = yaml.load(input) as RinkConfig;
      setConfig(parsed || defaultConfig);
      setError(null);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError('An unknown error occurred parsing YAML');
    }
  };

  // Convert JS Object to YAML
  const generatedYaml = yaml.dump(config, {
    indent: 2,
    lineWidth: -1, 
    noRefs: true,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addSheet = () => {
    const newSheetIndex = config.sheets?.length || 0;
    setConfig(prev => ({
      ...prev,
      sheets: [...(prev.sheets || []), { name: 'New Sheet', spreadsheetId: '', tabs: [] }]
    }));
    setExpandedSheetIndex(newSheetIndex);
    
    // Smooth scroll to bottom after state updates
    setTimeout(() => {
      endOfListRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const updateSheet = (index: number, updatedSheet: SheetConfig) => {
    const newSheets = [...config.sheets];
    newSheets[index] = updatedSheet;
    setConfig({ ...config, sheets: newSheets });
  };
  
  const removeSheet = (index: number) => {
    const newSheets = [...config.sheets];
    newSheets.splice(index, 1);
    setConfig({ ...config, sheets: newSheets });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 transition-all duration-500">
        
        {/* Left Side: Visual Editor */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">RINK Config Builder</h1>
            <p className="text-gray-600 mb-4 flex items-center text-sm">
              <Upload size={16} className="mr-2 text-gray-400" />
              Import your existing <code className="bg-gray-100 text-blue-600 px-1.5 py-0.5 ml-1 mr-1 rounded text-xs font-semibold">sheets.yaml</code> or build one from scratch.
            </p>
            
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm transition-all shadow-inner bg-gray-50 hover:bg-white"
              placeholder="Paste your sheets.yaml here to load existing configuration..."
              value={yamlInput}
              onChange={(e) => handleParse(e.target.value)}
            />
            {error && <p className="text-red-600 mt-2 text-sm flex items-center"><span className="mr-1">⚠️</span> {error}</p>}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Global Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Frontend Base URL (Optional)</label>
              <input 
                type="text" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={config.frontendBaseUrl || ''}
                onChange={(e) => setConfig({...config, frontendBaseUrl: e.target.value})}
                placeholder="https://your-domain.com"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">Google Sheets Data Sources</h2>
              <button 
                onClick={addSheet}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Plus size={16} className="mr-1" /> Add Sheet
              </button>
            </div>
            
            {config.sheets?.map((sheet, index) => (
              <SheetCard 
                key={index} 
                sheet={sheet} 
                onChange={(updated) => updateSheet(index, updated)}
                onRemove={() => removeSheet(index)}
                isExpanded={expandedSheetIndex === index}
                onToggleExpand={() => setExpandedSheetIndex(expandedSheetIndex === index ? -1 : index)}
              />
            ))}
            <div ref={endOfListRef} className="h-4" />
            
            {(!config.sheets || config.sheets.length === 0) && (
              <div className="text-center p-8 bg-white border border-dashed border-gray-300 rounded-lg text-gray-500">
                Click &quot;+ Add Sheet&quot; to begin building your config, or paste an existing YAML on the left.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: YAML Preview */}
        <div className="w-full lg:w-1/3 flex flex-col h-[calc(100vh-4rem)] sticky top-8">
          <div className="flex items-center justify-between mb-4 bg-gray-900 p-3 rounded-t-xl border border-gray-800">
            <h2 className="text-lg font-bold text-white ml-2 flex items-center">
              Generated YAML
            </h2>
            <button 
              onClick={handleCopy}
              className={`flex items-center text-sm px-4 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
                copied 
                  ? 'bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white'
              }`}
            >
              {copied ? (
                <><Check size={16} className="mr-1.5" /> Copied!</>
              ) : (
                <><Copy size={16} className="mr-1.5" /> Copy Code</>
              )}
            </button>
          </div>
          <div className="flex-1 bg-[#1e1e2e] rounded-b-xl p-5 overflow-auto shadow-2xl border border-t-0 border-gray-800">
            <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap break-all leading-relaxed">
              {generatedYaml}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}
