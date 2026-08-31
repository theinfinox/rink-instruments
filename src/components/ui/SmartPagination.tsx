'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface SmartPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export default function SmartPagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: SmartPaginationProps) {
  if (totalPages <= 1) return null;

  // Generate pagination items: numbers and '...'
  const getPaginationRange = (): (number | string)[] => {
    const totalPageNumbers = siblingCount * 2 + 5; // 1 + siblings + current + siblings + 1 + 2 dots

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, 'dots-right', lastPageIndex];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, 'dots-left', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, 'dots-left', ...middleRange, 'dots-right', lastPageIndex];
    }

    return [];
  };

  const paginationRange = getPaginationRange();

  const handlePageClick = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Pagination Navigation" 
      className="mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 select-none"
    >
      {/* ── Previous Button ── */}
      <button
        type="button"
        id="prev-page-btn"
        disabled={currentPage <= 1}
        onClick={() => handlePageClick(currentPage - 1)}
        className="flex items-center gap-1 px-3 py-2 border border-border rounded-lg text-xs sm:text-sm font-medium text-text-primary bg-card hover:bg-card-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent/40 hover:text-accent transition-all cursor-pointer shadow-2xs"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* ── Page Numbers & Skip Dots ── */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {paginationRange.map((item, idx) => {
          if (item === 'dots-left') {
            return (
              <button
                key={`dots-left-${idx}`}
                type="button"
                onClick={() => handlePageClick(Math.max(1, currentPage - 5))}
                title="Jump back 5 pages"
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium text-text-secondary hover:bg-card-secondary hover:text-accent border border-transparent hover:border-border transition-all cursor-pointer"
                aria-label="Jump back 5 pages"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            );
          }

          if (item === 'dots-right') {
            return (
              <button
                key={`dots-right-${idx}`}
                type="button"
                onClick={() => handlePageClick(Math.min(totalPages, currentPage + 5))}
                title="Jump forward 5 pages"
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium text-text-secondary hover:bg-card-secondary hover:text-accent border border-transparent hover:border-border transition-all cursor-pointer"
                aria-label="Jump forward 5 pages"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            );
          }

          const pageNumber = item as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={`page-${pageNumber}`}
              type="button"
              onClick={() => handlePageClick(pageNumber)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-accent text-white border border-accent shadow-sm'
                  : 'bg-card text-text-primary border border-border hover:bg-card-secondary hover:border-accent/40 hover:text-accent'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* ── Next Button ── */}
      <button
        type="button"
        id="next-page-btn"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
        className="flex items-center gap-1 px-3 py-2 border border-border rounded-lg text-xs sm:text-sm font-medium text-text-primary bg-card hover:bg-card-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent/40 hover:text-accent transition-all cursor-pointer shadow-2xs"
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
