'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type LinkPreloadProps = {
  hrefs: string[];
};

export function LinkPreload({ hrefs }: LinkPreloadProps) {
  const router = useRouter();

  useEffect(() => {
    hrefs.forEach((href) => {
      router.prefetch(href);
    });
  }, [hrefs, router]);

  return null; //  does its work silently
}
