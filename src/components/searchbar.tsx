'use client';

import {
  SearchProductResult,
  searchProductSuggestions,
} from '@/actions/search-product-suggestions';
import { recentSearchesAtom } from '@/atoms/search-bar';
import { useToggle } from '@/hooks/use-toggle';
import { cn } from '@/utils/cn';
import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { ImageOff, SearchIcon, X, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useClickAway } from 'react-use';
import { useDebouncedCallback } from 'use-debounce';
import { ImageWithRetry } from './image-with-retry';
import { Button, buttonVariants } from './ui/button';
import { ButtonGroup } from './ui/button-group';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './ui/empty';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';
import { Spinner } from './ui/spinner';

export function SearchBar() {
  const {
    mutate: search,
    isPending: isSearching,
    isError,
  } = useMutation({
    mutationFn: searchProductSuggestions,
    onSuccess: (result) => {
      setHasSearched(true);

      if (!result) {
        setTotalProducts(0);
        setProducts([]);
        return;
      }

      if (trimmedQuery) {
        setLastSearchedQuery(result.query);
        setTotalProducts(result.totalProducts);
        setProducts(result.products);
      }

      setRecentSearches((prev = []) => {
        if (!trimmedQuery) return prev;
        const updatedSearches = [
          trimmedQuery,
          ...prev.filter((term) => term !== trimmedQuery),
        ];
        return updatedSearches.slice(0, 5);
      });
    },
    onError: () => {
      setProducts([]);
      setTotalProducts(0);
      setHasSearched(true);
      setLastSearchedQuery(trimmedQuery);
    },
  });

  const searchParams = useSearchParams();
  const q = searchParams.get('q')?.toString() ?? '';

  const [query, setQuery] = React.useState(q);
  const trimmedQuery = query.trim();

  const [hasSearched, setHasSearched] = React.useState(false);
  const [products, setProducts] = React.useState<
    NonNullable<SearchProductResult>['products']
  >([]);
  const [totalProducts, setTotalProducts] = React.useState<number>(0);
  const [lastSearchedQuery, setLastSearchedQuery] = React.useState<string>('');
  const [recentSearches, setRecentSearches] = useAtom(recentSearchesAtom);

  const { value: isOpen, setOn: setOpen, setOff: closeSearch } = useToggle();

  const ref = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // sync search params
  React.useEffect(() => {
    if (!q) return;
    setQuery(q);
  }, []);

  const debouncedSearch = useDebouncedCallback((term: string) => search(term), 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);

    if (!newValue.trim()) {
      setProducts([]);
      setTotalProducts(0);
      setHasSearched(false);
      setLastSearchedQuery('');

      return;
    }

    React.startTransition(() => {
      debouncedSearch.cancel();
      if (trimmedQuery.length <= 1) return;

      debouncedSearch(newValue.trim());
    });
  };

  const handleClear = () => {
    setQuery('');
    setProducts([]);
    setTotalProducts(0);
    setHasSearched(false);
    setLastSearchedQuery('');

    inputRef.current?.focus();
  };

  const handleRecentSearchClick = (term: string) => {
    setQuery(term);
    setLastSearchedQuery('');
    debouncedSearch.cancel();
    debouncedSearch(term);
    setOpen();
  };

  useClickAway(ref, closeSearch);
  return (
    <div ref={ref} className="relative hidden max-w-sm grow md:flex">
      <search className="grow">
        <form
          action="/search"
          className="relative w-full"
          role="search"
          aria-label="Sitewide"
          onSubmit={(e) => {
            if (!trimmedQuery) e.preventDefault();
          }}
        >
          <ButtonGroup className="relative w-full">
            <Button
              variant="outline"
              size="icon"
              type="submit"
              disabled={!trimmedQuery || isSearching}
            >
              {isSearching && (
                <>
                  <Spinner />
                  <span className="sr-only">Searching the term: {query}</span>
                </>
              )}
              {!isSearching && (
                <>
                  <SearchIcon />
                  <span className="sr-only">Search the term: {query}</span>
                </>
              )}
            </Button>

            <Input
              ref={inputRef}
              type="search"
              name="q"
              value={query}
              onChange={handleChange}
              onFocus={setOpen}
              autoComplete="off"
              className="bg-background text-foreground"
              required
              onInvalid={(e) => e.currentTarget.setCustomValidity('Enter a search term')}
              onInput={(e) => e.currentTarget.setCustomValidity('')}
            />
            {query && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleClear}
                disabled={isSearching}
              >
                <X />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </ButtonGroup>
        </form>
      </search>

      {/* SEARCH SKELETON */}
      {!products.length && isSearching && (
        <SearchContent isOpen={isOpen}>
          <div className="space-y-2 p-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <SearchListItemSkeleton key={`search-list-item-skeleton-${index}`} />
              ))}
          </div>
        </SearchContent>
      )}

      {/*  RECENT SEARCH */}
      {!trimmedQuery && recentSearches && recentSearches.length > 0 && (
        <SearchContent isOpen={isOpen} key={recentSearches.join('-')}>
          <RecentSearch>
            <RecentSearchHeader>
              <RecentSearchTitle>Recent Searches</RecentSearchTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRecentSearches(undefined)}
              >
                Clear all
              </Button>
            </RecentSearchHeader>
            <RecentSearchList>
              {recentSearches.map((term) => (
                <RecentSearchListItem
                  key={'recent-search-' + term}
                  term={term}
                  onClick={() => handleRecentSearchClick(term)}
                  onClear={() =>
                    setRecentSearches((prev = []) => prev.filter((t) => t !== term))
                  }
                />
              ))}
            </RecentSearchList>
          </RecentSearch>
        </SearchContent>
      )}

      {/* SEARCH RESULT */}
      {products.length > 0 && (
        <SearchContent isOpen={isOpen}>
          <SearchResult>
            <SearchResultList>
              {products.map((product) => (
                <SearchResultListItem
                  key={'search-result-list-' + product.slug}
                  onClose={closeSearch}
                  {...product}
                />
              ))}
            </SearchResultList>
            {totalProducts > products.length && (
              <Link
                href={`/search?q=${encodeURIComponent(trimmedQuery)}`}
                className="not-hover:text-muted-foreground text-xs hover:underline hover:underline-offset-4"
                onNavigate={closeSearch}
              >
                View all {totalProducts} Product{totalProducts > 1 ? 's' : ''} &rarr;
              </Link>
            )}
          </SearchResult>
        </SearchContent>
      )}

      {/* EMPTY SEARCH RESULT */}
      {!isSearching &&
        hasSearched &&
        trimmedQuery &&
        products.length === 0 &&
        !isError && (
          <SearchContent isOpen={isOpen}>
            <EmptySearchResult query={trimmedQuery} />
          </SearchContent>
        )}

      {/* SEARCH ERROR */}
      {isError && (
        <SearchContent isOpen={isOpen}>
          <SearchResultError />
        </SearchContent>
      )}
    </div>
  );
}

type RecentSearchProps = React.ComponentProps<'section'>;

function RecentSearch({ className, ...props }: RecentSearchProps) {
  return <section className={cn('space-y-4 p-4', className)} {...props} />;
}

type RecentSearchHeaderProps = React.ComponentProps<'div'>;

function RecentSearchHeader({ className, ...props }: RecentSearchHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)} {...props} />
  );
}
type RecentSearchTitleProps = React.ComponentProps<'h2'>;

function RecentSearchTitle({ className, ...props }: RecentSearchTitleProps) {
  return (
    <h2
      className={cn('text-muted-foreground px-4 text-sm leading-tight', className)}
      {...props}
    />
  );
}

type RecentSearchListProps = React.ComponentProps<'ul'>;

function RecentSearchList({ className, ...props }: RecentSearchListProps) {
  return <ul className={cn('space-y-1', className)} {...props} />;
}

type RecentSearchListItemProps = React.ComponentProps<typeof Button> & {
  term: string;
  onClear: () => void;
};

function RecentSearchListItem({ term, onClear, ...props }: RecentSearchListItemProps) {
  return (
    <li className="flex items-center">
      <Button
        variant="ghost"
        className="grow justify-start overflow-hidden font-normal"
        {...props}
      >
        <SearchIcon className="text-muted-foreground" />
        {term.length > 40 ? term.slice(0, 40) + '...' : term}
      </Button>
      <Button variant="ghost" size="icon" onClick={onClear}>
        <X className="text-muted-foreground size-4" />
        <span className="sr-only">Clear recent search: {term}</span>
      </Button>
    </li>
  );
}

type SearchResultProps = React.ComponentPropsWithRef<'div'>;

function SearchResult({ className, ...props }: SearchResultProps) {
  return <div className={cn('space-y-4 p-2', className)} {...props} />;
}

type SearchResultListProps = React.ComponentProps<'ul'>;

function SearchResultList({ className, ...props }: SearchResultListProps) {
  return <ul className={cn('space-y-1', className)} {...props} />;
}

type SearchResultListItemProps = {
  title: string;
  slug: string;
  image?: string | null;
  onClose?: () => void;
} & React.ComponentProps<'li'>;

function SearchResultListItem({
  title,
  slug,
  image,
  onClose: handleClose,
  ...props
}: SearchResultListItemProps) {
  return (
    <li {...props}>
      <Link
        href={`/products/${slug}`}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'h-auto w-full justify-start p-3',
        )}
        onClick={handleClose}
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
    </li>
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
    <Empty className="max-w-sm">
      <EmptyHeader>
        <EmptyMedia>
          <SearchIcon />
        </EmptyMedia>
        <EmptyTitle>No products found</EmptyTitle>
        <EmptyDescription className="line-clamp-3 wrap-break-word whitespace-normal">
          We couldn&apos;t find any products for{' '}
          <strong>
            &quot;{query.length > 50 ? query.slice(0, 50) + '...' : query}&quot;
          </strong>
          .
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

type SearchContentProps = React.ComponentProps<'div'> & {
  isOpen: boolean;
};

function SearchContent({ isOpen, ...props }: SearchContentProps) {
  if (!isOpen) return null;
  return (
    <div
      data-open={isOpen}
      {...props}
      className="bg-popover data-open:animate-in data-[open=false]:zoom-out-95 data-[state=false]:fade-out-0 data-[open=false]:animate-out text-popover-foreground absolute top-full right-0 left-0 z-9999 mt-2 overflow-hidden overscroll-contain rounded-md border shadow-lg"
    />
  );
}
