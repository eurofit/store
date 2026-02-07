'use client';

import {
  searchBrand as searchBrandAction,
  SearchBrandResult,
} from '@/actions/search/search-brand';
import { useClickAway } from '@/hooks/use-click-away';
import { useToggle } from '@/hooks/use-toggle';
import { cn } from '@/utils/cn';
import { useMutation } from '@tanstack/react-query';
import { ImageOff, Search } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { ImageWithRetry } from './image-with-retry';
import { buttonVariants } from './ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { Spinner } from './ui/spinner';

export function BrandSearch() {
  const [brands, setBrands] = React.useState<NonNullable<SearchBrandResult>['brands']>(
    [],
  );
  const [totalBrands, setTotalBrands] =
    React.useState<NonNullable<SearchBrandResult>['totalBrands']>(0);

  const { value: open, setOn, setOff } = useToggle();

  const { mutate: searchBrand, isPending: isSearching } = useMutation({
    mutationKey: ['brands-search'],
    mutationFn: searchBrandAction,
    onSuccess: (data) => {
      if (data) {
        setBrands(data.brands);
        setTotalBrands(data.totalBrands);
      }
    },
    onError: () => {
      setBrands([]);
      setTotalBrands(0);
      toast.error('Failed to search brands. Please try again.');
    },
  });

  const debouncedSearch = useDebouncedCallback(searchBrand, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;

    debouncedSearch.cancel();

    const trimmedQuery = query.trim();

    if (trimmedQuery === '' || trimmedQuery.length < 2) {
      setBrands([]);
      setTotalBrands(0);
      return;
    }

    debouncedSearch(trimmedQuery);
  };

  const ref = useClickAway<HTMLDivElement>(setOff);

  return (
    <search ref={ref} className="relative w-full max-w-md">
      <InputGroup className="bg-background">
        <InputGroupAddon>
          {isSearching ? <Spinner aria-hidden="true" /> : <Search aria-hidden="true" />}
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          placeholder="Search brands…"
          autoComplete="off"
          onFocus={setOn}
          onChange={handleChange}
        />
        {totalBrands > 0 && (
          <InputGroupAddon align="inline-end">
            <span className="font-variant-numeric-tabular-nums">
              {totalBrands} {totalBrands === 1 ? 'result' : 'results'}
            </span>
          </InputGroupAddon>
        )}
      </InputGroup>
      {open && brands.length > 0 && (
        <div
          data-open={open}
          className="bg-popover data-open:animate-in data-[open=false]:zoom-out-95 data-[state=false]:fade-out-0 data-[open=false]:animate-out text-popover-foreground absolute top-full right-0 left-0 z-99999999 mt-2 overflow-hidden overscroll-contain rounded-md border p-4 shadow-lg"
        >
          {brands.map(({ id, title, slug, image }) => (
            <Link
              key={id}
              href={`/brands/${slug}`}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'h-auto w-full items-center justify-start p-3',
              )}
            >
              <div className="flex w-full items-center gap-3">
                <div className="relative mt-0.5 flex size-9 items-center justify-center rounded-md shadow">
                  {image ? (
                    <ImageWithRetry
                      src={image}
                      alt={title}
                      height={64}
                      width={64}
                      className="m-auto max-h-11/12 object-contain"
                      priority
                      loading="eager"
                    />
                  ) : (
                    <ImageOff className="text-muted-foreground/50 size-3/5" aria-hidden="true" />
                  )}
                </div>
                <div className="flex-1 text-left whitespace-break-spaces">
                  <p className="text-sm font-medium text-pretty">{title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </search>
  );
}
