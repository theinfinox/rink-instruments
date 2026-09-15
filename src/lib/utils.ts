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
  const trimmed = url.trim();
  if (!trimmed || ['na', 'n/a', 'nil', 'none', 'not specified', 'not available'].includes(trimmed.toLowerCase())) return '#';
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return trimmed;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsedUrl = new URL(withProtocol);
    if (['http:', 'https:'].includes(parsedUrl.protocol)) {
      return withProtocol;
    }
    return '#';
  } catch {
    return '#';
  }
};
