'use client';

import { Loader2 } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useRef } from 'react';
import { useIntersection } from 'react-use';

type SearchResultsList = {};

export function SearchResultsLists({}: SearchResultsList) {
  const intersectionRef = useRef<HTMLDivElement>(null!);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  });

  useEffect(() => {
    if (!(intersection && intersection.intersectionRatio === 1)) return;

    const params = new URLSearchParams(searchParams.toString());
    const page = params.get('page');

    if (!page) {
      params.set('page', '2');
      router.push(pathname + '?' + params.toString());
      return;
    }

    params.set('page', String(+(page ?? 0) + 1));

    const newUrl = pathname + '?' + params.toString();

    router.push(newUrl);
  }, [intersection]);
  return (
    <div ref={intersectionRef} className="my-6 flex w-full justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
