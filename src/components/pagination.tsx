'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utils/cn';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

interface ModernPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  showItemCount?: boolean;
  className?: string;
}

export function PagePagination({
  currentPage,
  totalItems,
  itemsPerPage,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSize = true,
  showItemCount = true,
  className,
}: ModernPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { totalPages, startItem, endItem, hasItems } = useMemo(() => {
    const pages = Math.ceil(totalItems / itemsPerPage);
    const start = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return {
      totalPages: pages,
      startItem: start,
      endItem: end,
      hasItems: totalItems > 0,
    };
  }, [currentPage, totalItems, itemsPerPage]);

  const navigateToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const handlePageSizeChange = useCallback(
    (newSize: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('limit', newSize);
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const getVisiblePages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];

    // Always show first page
    pages.push(1);

    if (currentPage <= 4) {
      // Show pages 2, 3, 4, 5, ellipsis, last
      pages.push(2, 3, 4, 5);
      if (totalPages > 6) pages.push('ellipsis');
      if (totalPages > 5) pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Show first, ellipsis, last 4 pages
      if (totalPages > 5) pages.push('ellipsis');
      for (let i = Math.max(2, totalPages - 3); i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, ellipsis, current-1, current, current+1, ellipsis, last
      pages.push('ellipsis');
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  if (!hasItems) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <p className="text-muted-foreground text-sm">No items to display</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      {/* Pagination controls */}
      {totalPages > 1 && (
        <Pagination className="mx-auto w-auto">
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${currentPage - 1}`}
                className={cn(currentPage === 1 && 'pointer-events-none opacity-50')}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {getVisiblePages.map((page, index) => (
              <PaginationItem key={`pagination-page-${index}`}>
                {page === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink href={`?page=${page}`} isActive={page === currentPage}>
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                href={`?page=${currentPage + 1}`}
                className={cn(
                  currentPage === totalPages && 'pointer-events-none opacity-50',
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Items info and page size selector */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        {showItemCount && (
          <p className="text-muted-foreground text-sm">
            <span className="font-medium">{startItem.toLocaleString()}</span>
            &nbsp;to&nbsp;
            <span className="font-medium">{endItem.toLocaleString()}</span>&nbsp;-&nbsp;
            <span className="font-medium">{totalItems.toLocaleString()}</span>
          </p>
        )}

        {showPageSize && pageSizeOptions.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm whitespace-nowrap">
              Per page
            </span>
            <Select value={itemsPerPage.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-20 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
