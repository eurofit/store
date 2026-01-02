// 'use client';

// import { getTotalProductLines } from '@/actions/get-total-product-lines';
// import {
//   SearchProductResult,
//   searchProductSuggestions,
// } from '@/actions/search-product-suggestions';
// import { useToggle } from '@/hooks/use-toggle';
// import { cn } from '@/utils/cn';
// import { ImageOff, Search } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import * as React from 'react';
// import { useEffect, useState, useTransition } from 'react';
// import { useClickAway } from 'react-use';
// import { useDebounce } from 'use-debounce';
// import { PreventScroll } from './prevent-scroll';
// import { SearchInput } from './searchbar-old';
// import { Button, buttonVariants } from './ui/button';

// type SearchSheetProps = {
//   className?: string;
// };

// type SearchContextProps = {
//   setOff: () => void;
// };

// const SearchContext = React.createContext<SearchContextProps>(null!);

// function useSearch() {
//   const context = React.useContext(SearchContext);

//   if (!context) {
//     throw new Error('useSearch must be used within a <SearchSheet />');
//   }

//   return context;
// }

// export function SearchSheet({ className }: SearchSheetProps) {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const searchParamsQuery = searchParams.get('q') ?? '';
//   const [query, setQuery] = useState(searchParamsQuery);
//   const { value: isOpen, setOn, setOff } = useToggle();
//   const [isSearching, startSearching] = useTransition();
//   const [totalProductLines, setTotalProductLines] = useState<number | null>(null);
//   const [results, setResults] = useState<SearchProductResult['products']>([]);
//   const [totalResults, setTotalResults] = useState(0);
//   const ref = React.useRef<HTMLDivElement>(null!);

//   const [debouncedQuery] = useDebounce(query, 300);

//   React.useEffect(() => {
//     getTotalProductLines().then((total) => {
//       setTotalProductLines(total);
//     });
//   }, []);

//   useEffect(() => {
//     if (!debouncedQuery) return;

//     startSearching(async () => {
//       const result = await searchProductSuggestions(debouncedQuery);
//       setResults(result.products);
//       setTotalResults(result.totalProducts);
//     });
//   }, [debouncedQuery]);

//   useClickAway(ref, () => {
//     if (debouncedQuery) return;
//     setOff();
//   });

//   const placeholder =
//     totalProductLines && totalProductLines > 1
//       ? `Search over ${totalProductLines} products`
//       : 'Search Products';

//   return (
//     <>
//       <Button variant="outline" size="icon" className={className} onClick={setOn}>
//         <Search />
//         <span className="sr-only">{placeholder}</span>
//       </Button>

//       {isOpen && (
//         <div
//           ref={ref}
//           className="bg-background absolute inset-x-0 z-60 container flex h-full items-center px-6"
//         >
//           <SearchInput
//             value={query}
//             onChange={(e) => setQuery(e.currentTarget.value)}
//             autoFocus
//             placeholder={placeholder}
//             isSearching={isSearching}
//             showSearchIcon={false}
//           />
//         </div>
//       )}

//       {debouncedQuery && isOpen && results.length > 0 && (
//         <SearchContext.Provider value={{ setOff }}>
//           <PreventScroll>
//             <div
//               className="absolute inset-x-0 top-20 z-9999 h-[calc(100vh-5rem)] bg-black/35 backdrop-blur-xs"
//               onClick={setOff}
//             >
//               <div className="bg-background flex items-center justify-between px-6 pt-6">
//                 <h2 className="bg-background text-lg font-semibold">Products</h2>

//                 {totalResults > results.length && (
//                   <Link
//                     href={`/search?q=${debouncedQuery}`}
//                     className="text-sm underline-offset-4 hover:underline"
//                   >
//                     {totalResults} Products &rarr;
//                   </Link>
//                 )}
//               </div>

//               <SearchResultList result={results} />
//             </div>
//           </PreventScroll>
//         </SearchContext.Provider>
//       )}
//       {!isSearching && debouncedQuery && results.length === 0 && (
//         <SearchEmpty query={query} />
//       )}
//     </>
//   );
// }

// type SearchResultListProps = {
//   result: {
//     title: string;
//     slug: string;
//     image?: string | null;
//   }[];
// };

// function SearchResultList({ result }: SearchResultListProps) {
//   return (
//     <div className="bg-background space-y-4 p-2">
//       <ul className="space-y-1">
//         {result.map((r) => (
//           <SearchResultListItem key={'search-result-list-item-' + r.slug} {...r} />
//         ))}
//       </ul>
//     </div>
//   );
// }

// type SearchResultListItemProps = {
//   title: string;
//   slug: string;
//   image?: string | null;
// };

// function SearchResultListItem({ title, slug, image }: SearchResultListItemProps) {
//   const { setOff } = useSearch();
//   return (
//     <li onClick={setOff}>
//       <Link
//         href={`/products/${slug}`}
//         className={cn(
//           buttonVariants({ variant: 'ghost' }),
//           'h-auto w-full justify-start p-3',
//         )}
//       >
//         <div className="flex w-full items-start gap-3">
//           <div className="relative mt-0.5 flex size-10 items-center justify-center rounded-md shadow">
//             {image ? (
//               <Image
//                 src={image}
//                 alt={title}
//                 height={64}
//                 width={64}
//                 className="m-auto max-h-11/12 object-contain"
//                 priority
//                 loading="eager"
//               />
//             ) : (
//               <ImageOff className="text-muted-foreground/50 size-3/5" />
//             )}
//           </div>
//           <div className="flex-1 text-left whitespace-break-spaces">
//             <p className="text-sm font-medium text-pretty">{title}</p>
//           </div>
//         </div>
//       </Link>
//     </li>
//   );
// }

// type SearchEmptyProps = {
//   query: string;
// };

// function SearchEmpty({ query }: SearchEmptyProps) {
//   return (
//     <div className="p-8 text-center">
//       <Search className="text-muted-foreground mx-auto mb-2 size-8" />
//       <p className="text-muted-foreground text-sm">No results found for "{query}"</p>
//       <p className="text-muted-foreground mt-1 text-xs">
//         Try searching for something else
//       </p>
//     </div>
//   );
// }

// export function SearchSheetSkeleton() {
//   return (
//     <Button variant="outline" size="icon" disabled>
//       <Search />
//       <span className="sr-only">Search</span>
//     </Button>
//   );
// }
