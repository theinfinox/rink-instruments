'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  fallbackUrl: string;
  label?: string;
  className?: string;
}

export default function SmartBack({ fallbackUrl, label = 'Back', className = '' }: Props) {
  const router = useRouter();
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    // window.history.length is > 2 if there's actual history within the app
    // Sometimes it's > 1, so we check > 1 for safety
    if (window.history.length > 1) {
      setHasHistory(true);
    }
  }, []);

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasHistory) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <a
      href={fallbackUrl}
      onClick={handleBack}
      className={`inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#0A2164] transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4 mr-1" />
      {label}
    </a>
  );
}
