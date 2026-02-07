'use client';

import {
  SearchProductResult,
  searchProductSuggestions,
} from '@/actions/search/search-product-suggestions';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useToggle } from '@/hooks/use-toggle';
import { cn } from '@/utils/cn';
import { useMutation } from '@tanstack/react-query';
import { ChevronRight, ImageOff, SearchIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import pluralize from 'pluralize-esm';
import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ImageWithRetry } from './image-with-retry';
import { PreventScroll } from './prevent-scroll';
import { EmptySearchResult } from './searchbar/empty-search-result';
import { SearchResultError } from './searchbar/search-error';
import { SearchListItemSkeleton } from './searchbar/search-skeleton';

const SEARCH_RESULT_LIMIT = 7;

export function SearchSheet() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q')?.toString() ?? '';

  const { value: isOpen, setOff, setOn } = useToggle(false);

  const [query, setQuery] = React.useState('');
  const [products, setProducts] = React.useState<
    NonNullable<SearchProductResult>['products']
  >([]);
  const [totalProducts, setTotalProducts] = React.useState<number>(0);
  const [hasSearched, setHasSearched] = React.useState(false);

  const {
    mutate: search,
    isPending: isSearching,
    isError,
  } = useMutation({
    mutationFn: searchProductSuggestions,
    onSuccess: (result) => {
      if (!result) {
        setProducts([]);
        setTotalProducts(0);
        return;
      }
      setTotalProducts(result.totalProducts);
      setProducts(result.products);
    },
    onError: () => {
      setProducts([]);
      setTotalProducts(0);
    },
    onSettled: () => {
      setHasSearched(true);
    },
  });

  // sync search params
  React.useEffect(() => {
    setQuery(q);
  }, [q]);

  const debaouncedSearch = useDebouncedCallback(search, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;

    setQuery(term);

    debaouncedSearch.cancel();

    if (term.length <= 2) {
      setProducts([]);
      setTotalProducts(0);
      return;
    }

    debaouncedSearch({
      query: term,
      limit: SEARCH_RESULT_LIMIT,
    });
  };

  return (
    <search className="md:hidden">
      <Button variant="outline" size="icon" onClick={setOn} aria-expanded={isOpen}>
        <SearchIcon />
        <span className="sr-only">Search products</span>
      </Button>

      {isOpen && (
        <PreventScroll>
          <div className="bg-background absolute inset-x-0 top-0 z-50 h-dvh space-y-6 p-6">
            <div className="flex gap-2">
      
            <form action="/search" className="grow">
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput
                  type="search"
                  name="q"
                  value={query}
                  onChange={handleSearchChange}
                  placeholder="Search products"
                  autoComplete="off"
                  autoFocus
                />
                {totalProducts > 0 && (
                  <InputGroupAddon align="inline-end">
                    {totalProducts} {pluralize('result', totalProducts)}
                  </InputGroupAddon>
                )}
              </InputGroup>
            </form>

<Button variant="ghost" onClick={setOff} className="ml-auto">
                Cancel
              </Button>
            </div>

            <div>
              {/* SEARCH SKELETON  */}
              {isSearching && (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SearchListItemSkeleton key={index} />
                  ))}
                </div>
              )}

              {/* EMPTY SEARCH RESULT */}
              {query.length > 2 &&
                hasSearched &&
                !isSearching &&
                products.length === 0 &&
                !isError && <EmptySearchResult query={query} />}

              {/* SEARCH ERROR */}
              {isError && <SearchResultError />}

              {/* SEARCH RESULTS */}
              {!isSearching && !isError && query.length > 2 && products.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p>Search results</p>
                    {totalProducts > SEARCH_RESULT_LIMIT && (
                      <Button variant="link" size="sm" asChild>
                        <Link
                          href={`/search?q=${encodeURIComponent(query)}`}
                          onClick={setOff}
                        >
                          View all {totalProducts} {pluralize('results', totalProducts)}
                          <ChevronRight className="size-3.5" />
                        </Link>
                      </Button>
                    )}
                  </div>
                  {products.map(({ slug, image, title }) => (
                    <Link
                      key={slug}
                      href={`/products/${slug}`}
                      className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        'h-auto w-full justify-start p-3',
                      )}
                      onClick={setOff}
                    >
                      <div className="flex w-full items-start gap-3">
                        <div className="relative mt-0.5 flex size-10 items-center justify-center rounded-md shadow">
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
                            <ImageOff className="text-muted-foreground/50 size-3/5" />
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
            </div>
          </div>
        </PreventScroll>
      )}
    </search>
  );
}
