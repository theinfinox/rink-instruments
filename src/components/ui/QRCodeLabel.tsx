'use client';

import React, { useRef, useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import Image from 'next/image';

interface QRCodeLabelProps {
  url: string;
  title: string;
  institution: string;
  location?: string;
  itemId: string;
  itemType: 'Instrument' | 'Service';
}

export default function QRCodeLabel({ url, title, institution, location, itemId, itemType }: QRCodeLabelProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [generatedDate, setGeneratedDate] = useState('');

  useEffect(() => {
    setGeneratedDate(new Date().toLocaleString('en-IN', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }));
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      // Increased pixelRatio to 8 for ultra-high resolution (3600x4800px) ideal for crisp printing
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 8 });
      const link = document.createElement('a');
      link.download = `rink-label-${itemId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Hidden container that holds the high-res layout for download */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div 
          ref={cardRef} 
          className="w-[450px] bg-white flex flex-col items-center justify-between p-8 font-sans"
          style={{ 
            aspectRatio: '3/4',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
            border: '2px solid #E2E8F0', // slate-200
            borderRadius: '24px'
          }}
        >
          {/* Header */}
          <div className="w-full text-center flex flex-col items-center gap-3">
            <Image 
              src="/images/rink_logo.png" 
              alt="RINK Logo" 
              width={120} 
              height={40} 
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
            <div className="w-full h-px bg-slate-100 mt-2 mb-2"></div>
            <h1 className="text-2xl font-bold text-[#0A2164] uppercase tracking-wide">
              {itemType}
            </h1>
            <h2 className="text-xl font-bold text-slate-800 line-clamp-2 leading-tight">
              {title}
            </h2>
          </div>

          {/* QR Code Container */}
          <div className="relative my-6 p-4 bg-white rounded-xl shadow-[0_0_20px_rgba(10,33,100,0.05)] border border-blue-50">
            <QRCodeSVG
              value={url}
              size={220}
              level="H"
              bgColor="#ffffff"
              fgColor="#0A2164"
              imageSettings={{
                src: "/images/rink_logo.png",
                height: 20,
                width: 86,
                excavate: true,
              }}
            />
          </div>

          {/* Footer Metadata */}
          <div className="w-full text-center space-y-1.5 flex flex-col items-center">
            <div className="text-lg font-semibold text-slate-700">
              {institution}
            </div>
            {location && (
              <div className="text-sm text-slate-500 font-medium">
                {location}
              </div>
            )}
            <div className="mt-4 inline-block bg-blue-50 text-[#0A2164] px-4 py-1.5 rounded-full font-mono text-sm font-bold border border-blue-100">
              ID: {itemId}
            </div>
            {generatedDate && (
              <div className="pt-4 text-[10px] text-slate-300 font-medium tracking-wide uppercase">
                Generated on {generatedDate}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visible UI Preview */}
      <div className="w-full max-w-[320px] mx-auto bg-slate-50/40 rounded-2xl p-4 sm:p-5 border border-slate-200/50 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-col gap-4">
        
        {/* Content & Action Row */}
        <div className="flex flex-row sm:flex-col items-center justify-between gap-4">
          <div className="flex flex-col sm:items-center text-left sm:text-center gap-1.5 flex-1">
            <h3 className="font-serif text-sm font-bold text-slate-800 leading-snug">
              {itemType === 'Service' ? 'Service Label' : 'Equipment Label'}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium leading-tight max-w-[140px] sm:max-w-none">
              High-resolution printable asset tag
            </p>
          </div>
          
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 relative pointer-events-none opacity-95 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
            <QRCodeSVG
              value={url}
              size={80}
              level="H"
              bgColor="#ffffff"
              fgColor="#0A2164"
              imageSettings={{
                src: "/images/rink_logo.png",
                height: 7,
                width: 30,
                excavate: true,
              }}
            />
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-slate-200 text-[#0A2164] font-semibold text-sm transition-all hover:bg-slate-50 hover:border-[#0A2164]/30 active:scale-[0.98] disabled:opacity-70 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Generating...' : 'Download PNG'}</span>
        </button>
      </div>
    </div>
  );
}
