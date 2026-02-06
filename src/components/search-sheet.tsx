'use client';

import {
  SearchProductResult,
  searchProductSuggestions,
} from '@/actions/search/search-product-suggestions';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Skeleton } from '@/components/ui/skeleton';
import { useToggle } from '@/hooks/use-toggle';
import { cn } from '@/utils/cn';
import { useMutation } from '@tanstack/react-query';
import { truncate } from 'lodash-es';
import { ChevronRight, ImageOff, SearchIcon, X, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import pluralize from 'pluralize-esm';
import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ImageWithRetry } from './image-with-retry';
import { PreventScroll } from './prevent-scroll';

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
      
            <form action="/search">
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

<Button variant="outline" size="icon" onClick={setOff} className="ml-auto">
                <X />
                <span className="sr-only">Close search</span>
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

function SearchListItemSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="size-10 rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-2.5 w-62.5" />
        <Skeleton className="h-2.5 w-50" />
      </div>
    </div>
  );
}

type EmptySearchResultProps = {
  query: string;
};

function EmptySearchResult({ query }: EmptySearchResultProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <SearchIcon />
        </EmptyMedia>
        <EmptyTitle>No products found</EmptyTitle>
        <EmptyDescription className="line-clamp-3 wrap-break-word whitespace-normal">
          We couldn&apos;t find any products for{' '}
          <strong>&quot;{truncate(query)}&quot;</strong>.
        </EmptyDescription>
        <EmptyDescription>
          Please try different keywords or check your spelling.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function SearchResultError() {
  return (
    <div className="flex flex-col space-y-2 p-8 text-center">
      <div className="mx-auto flex items-center gap-2">
        <XCircle className="text-destructive size-4" />
        <p className="text-muted-foreground text-sm">Something went wrong</p>
      </div>
      <p className="text-muted-foreground mt-1 text-xs">
        An error occurred while searching. Please try again.
      </p>
    </div>
  );
}
