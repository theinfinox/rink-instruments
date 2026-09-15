'use client';

import React, { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
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

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
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
            <QRCode
              value={url}
              size={220}
              level="H"
              bgColor="#ffffff"
              fgColor="#0A2164"
            />
            {/* Center Logo Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white p-1.5 rounded-lg shadow-sm border border-slate-100 flex items-center justify-center">
                <Image 
                  src="/images/rink_logo.png" 
                  alt="RINK" 
                  width={40} 
                  height={14} 
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="w-full text-center space-y-1.5">
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
          </div>
        </div>
      </div>

      {/* Visible UI Preview */}
      <div className="w-full max-w-[280px] bg-slate-50/50 rounded-2xl p-5 border border-slate-200/60 shadow-sm flex flex-col items-center">
        <h3 className="font-serif text-sm font-bold text-slate-700 mb-4 text-center">
          Print Equipment Label
        </h3>
        
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 mb-5 relative pointer-events-none opacity-90 scale-95 origin-center">
          <QRCode
            value={url}
            size={120}
            level="H"
            bgColor="#ffffff"
            fgColor="#0A2164"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-white p-0.5 rounded shadow-sm flex items-center justify-center">
                <Image 
                  src="/images/rink_logo.png" 
                  alt="RINK" 
                  width={24} 
                  height={8} 
                  className="object-contain"
                />
              </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0A2164] text-white font-medium text-sm transition-all hover:bg-blue-900 active:scale-95 disabled:opacity-70"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Generating...' : 'Download Label'}</span>
        </button>
      </div>
    </div>
  );
}
