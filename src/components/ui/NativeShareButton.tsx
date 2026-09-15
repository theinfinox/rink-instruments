'use client';

import { Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface NativeShareButtonProps {
  title: string;
  text: string;
  url: string;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost';
}

export default function NativeShareButton({ title, text, url, className, variant = 'outline' }: NativeShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        if ((err as Error).name !== 'AbortError') {
          fallbackCopy();
        }
      }
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const baseStyles = 'inline-flex items-center justify-center gap-2 px-3 py-1.5 font-medium text-sm transition-all duration-200 rounded-sm whitespace-nowrap active:scale-[0.98]';
  const variants = {
    primary: 'bg-[#0A2164] hover:bg-blue-900 text-white shadow-sm',
    outline: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#0A2164] shadow-sm',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  };

  return (
    <button
      onClick={handleShare}
      className={twMerge(clsx(baseStyles, variants[variant], className))}
      aria-label="Share"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
      <span>{copied ? 'Link Copied!' : 'Share'}</span>
    </button>
  );
}
