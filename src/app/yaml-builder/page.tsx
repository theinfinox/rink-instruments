'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import * as yaml from 'js-yaml';
import { Copy, Check, Plus, Upload, BookOpen, Printer, FileText, Code2, Sparkles } from 'lucide-react';
import SheetCard from '@/components/yaml-builder/SheetCard';
import PipelineManualView, { printVisualManualOnly } from '@/components/yaml-builder/PipelineManualView';
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
  const [activeRightTab, setActiveRightTab] = useState<'yaml' | 'manual'>('yaml');

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
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">RINK Config Builder</h1>
              <Link 
                href="/yaml-builder/docs"
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer"
              >
                <BookOpen size={14} /> Manual & Guide
              </Link>
            </div>
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

        {/* Right Side: YAML Preview & Dynamic Architecture Manual */}
        <div className={`w-full ${activeRightTab === 'manual' ? 'lg:w-1/2' : 'lg:w-5/12'} flex flex-col h-[calc(100vh-4rem)] sticky top-8 transition-all duration-300`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 bg-gray-900 p-2.5 rounded-t-xl border border-gray-800">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-gray-800/80 p-0.5 rounded-lg border border-gray-700">
              <button
                type="button"
                onClick={() => setActiveRightTab('yaml')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeRightTab === 'yaml'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Code2 size={13} /> YAML Code
              </button>
              <button
                type="button"
                onClick={() => setActiveRightTab('manual')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeRightTab === 'manual'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles size={13} /> Visual Manual
              </button>
            </div>

            {/* Action Buttons: Generate PDF & Copy Code */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => printVisualManualOnly('visual-manual-print-container')}
                title="Generate PDF of Visual Manual"
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer"
              >
                <Printer size={13} />
                <span className="hidden sm:inline">Generate PDF</span>
              </button>

              <button 
                type="button"
                onClick={handleCopy}
                className={`flex items-center text-xs px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
                  copied 
                    ? 'bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? (
                  <><Check size={13} className="mr-1" /> Copied!</>
                ) : (
                  <><Copy size={13} className="mr-1" /> Copy Code</>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[#1e1e2e] rounded-b-xl p-5 overflow-auto shadow-2xl border border-t-0 border-gray-800">
            <div className={activeRightTab === 'yaml' ? 'block' : 'hidden'}>
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap break-all leading-relaxed">
                {generatedYaml}
              </pre>
            </div>
            
            <div className={activeRightTab === 'manual' ? 'block' : 'hidden'}>
              <div className="text-gray-900 bg-gray-50/50 p-4 rounded-xl">
                <PipelineManualView config={config} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
