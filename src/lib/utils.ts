import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CDN_HOST = process.env.NEXT_PUBLIC_CDN_BASE_URL || 'https://rink-git-cron.vercel.app';

export const getImageUrl = (url: string | null | undefined) => {
  if (!url) return '/placeholder-image.jpg';
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Clean up any double slashes between host and path
  const host = CDN_HOST.replace(/\/$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${host}${path}`;
};

export const getSafeUrl = (url: string | null | undefined): string => {
  if (!url) return '#';
  try {
    const parsedUrl = new URL(url, 'https://fallback.com');
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsedUrl.protocol)) {
      return url;
    }
    return '#';
  } catch {
    return '#';
  }
};
