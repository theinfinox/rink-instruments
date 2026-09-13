'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, ArrowRight } from 'lucide-react';

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
}: SmartPaginationProps) {
  const [jumpPage, setJumpPage] = useState('');

  if (totalPages <= 1) return null;

  const handlePageClick = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpPage.trim(), 10);
    if (isNaN(num)) return;
    const clamped = Math.max(1, Math.min(totalPages, num));
    handlePageClick(clamped);
    setJumpPage('');
  };

  const showFirstPage = totalPages > 4 && currentPage > 1;
  const showLeftDots = totalPages > 5 && currentPage > 3;
  const showRightDots = totalPages > 5 && currentPage < totalPages - 2;
  const showLastPage = totalPages > 4 && currentPage < totalPages;

  return (
    <nav 
      aria-label="Pagination Navigation" 
      className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2 select-none"
    >
      {/* ── Previous Button ── */}
      <button
        type="button"
        id="prev-page-btn"
        disabled={currentPage <= 1}
        onClick={() => handlePageClick(currentPage - 1)}
        className="flex items-center gap-1 px-2.5 sm:px-3 py-2 border border-border rounded-xl text-xs sm:text-sm font-medium text-text-primary bg-card hover:bg-card-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent/40 hover:text-accent transition-all cursor-pointer shadow-2xs"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* ── First Page Quick Anchor (Desktop only) ── */}
      {showFirstPage && (
        <button
          type="button"
          onClick={() => handlePageClick(1)}
          className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 items-center justify-center rounded-xl text-xs sm:text-sm font-semibold bg-card text-text-primary border border-border hover:bg-card-secondary hover:border-accent/40 hover:text-accent transition-all cursor-pointer shadow-2xs"
          aria-label="Go to first page"
        >
          1
        </button>
      )}

      {/* ── Left Fast-Forward Ellipsis (Desktop only) ── */}
      {showLeftDots && (
        <button
          type="button"
          onClick={() => handlePageClick(Math.max(1, currentPage - 5))}
          title="Jump back 5 pages"
          className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 items-center justify-center rounded-xl text-xs sm:text-sm font-medium text-text-secondary hover:bg-card-secondary hover:text-accent border border-transparent hover:border-border transition-all cursor-pointer"
          aria-label="Jump back 5 pages"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      )}

      {/* ── Central Compact Minimalist Stepper Pill ── */}
      <form 
        onSubmit={handleJumpSubmit} 
        noValidate
        className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border/90 rounded-xl shadow-2xs"
      >
        <label htmlFor="stepper-page-input" className="text-xs sm:text-sm font-medium text-text-secondary select-none">
          Page
        </label>
        <input
          id="stepper-page-input"
          type="number"
          min={1}
          max={totalPages}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onBlur={() => setJumpPage('')}
          placeholder={String(currentPage)}
          className="w-11 sm:w-13 px-1 py-0.5 text-center font-bold text-accent bg-background border border-border/80 focus:border-accent focus:ring-1 focus:ring-accent rounded-lg text-xs sm:text-sm shadow-inner transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          aria-label={`Current page ${currentPage} of ${totalPages}. Enter page number to jump.`}
        />
        <span className="text-xs sm:text-sm font-medium text-text-muted select-none whitespace-nowrap">
          of {totalPages}
        </span>
        {jumpPage.trim() && (
          <button
            type="submit"
            id="stepper-submit-btn"
            title="Jump to page"
            className="ml-0.5 p-1 text-xs font-semibold rounded-md bg-accent text-white hover:bg-accent-hover transition-all cursor-pointer flex items-center justify-center shadow-2xs animate-in fade-in zoom-in-95 duration-150"
            aria-label="Execute jump"
          >
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </form>

      {/* ── Right Fast-Forward Ellipsis (Desktop only) ── */}
      {showRightDots && (
        <button
          type="button"
          onClick={() => handlePageClick(Math.min(totalPages, currentPage + 5))}
          title="Jump forward 5 pages"
          className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 items-center justify-center rounded-xl text-xs sm:text-sm font-medium text-text-secondary hover:bg-card-secondary hover:text-accent border border-transparent hover:border-border transition-all cursor-pointer"
          aria-label="Jump forward 5 pages"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      )}

      {/* ── Last Page Quick Anchor (Desktop only) ── */}
      {showLastPage && (
        <button
          type="button"
          onClick={() => handlePageClick(totalPages)}
          className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 items-center justify-center rounded-xl text-xs sm:text-sm font-semibold bg-card text-text-primary border border-border hover:bg-card-secondary hover:border-accent/40 hover:text-accent transition-all cursor-pointer shadow-2xs"
          aria-label="Go to last page"
        >
          {totalPages}
        </button>
      )}

      {/* ── Next Button ── */}
      <button
        type="button"
        id="next-page-btn"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
        className="flex items-center gap-1 px-2.5 sm:px-3 py-2 border border-border rounded-xl text-xs sm:text-sm font-medium text-text-primary bg-card hover:bg-card-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent/40 hover:text-accent transition-all cursor-pointer shadow-2xs"
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
