import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';

interface PaginationProps {
  page: number;
  limit?: number;
  totalDocs: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BasePagination: React.FC<PaginationProps> = ({
  page,
  limit = 10,
  totalDocs,
  totalPages,
  onPageChange,
}) => {
  const visiblePages = 5;

  const getPageNumbers = () => {
    let startPage = Math.max(1, page - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    return [...Array(endPage - startPage + 1)].map((_, i) => startPage + i);
  };

  return (
    <div className="flex items-center justify-between rounded-b-xl border border-gray-200 bg-white p-4 sm:px-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hiển thị <span className="font-medium">{(page - 1) * limit + 1}</span>{' '}
          -
          <span className="font-medium">
            {Math.min(page * limit, totalDocs)}
          </span>{' '}
          trong
          <span className="font-medium"> {totalDocs}</span> kết quả
        </p>
        <nav
          aria-label="Pagination"
          className="isolate inline-flex -space-x-px rounded-md shadow-xs"
        >
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            <ChevronLeftIcon className="size-5" aria-hidden="true" />
          </button>
          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold
                ${
                  pageNumber === page
                    ? 'bg-success-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                } ring-1 ring-gray-300 ring-inset  focus:z-20 focus:outline-offset-0 md:inline-flex dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            <ChevronRightIcon className="size-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default BasePagination;
