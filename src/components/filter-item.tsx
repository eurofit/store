'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import * as React from 'react';
import { useId } from 'react';
import { Checkbox } from './ui/checkbox';

type FilterItemProps = React.ComponentProps<'div'> & {
  queryKey: string;
  slug: string;
  title: string;
  count: number;
};

export function FilterItem({ queryKey: key, slug, title, count }: FilterItemProps) {
  const id = useId();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isChecked = searchParams.getAll(key).includes(slug);

  const params = new URLSearchParams(searchParams.toString());

  if (isChecked) {
    const values = params.getAll(key).filter((value) => value !== slug);
    params.delete(key);
    values.forEach((value) => {
      params.append(key, value);
    });
  } else {
    params.append(key, slug);
  }

  params.delete('page');
  params.sort();

  const nextUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;

  const handleCheckboxChange = () => {
    router.replace(nextUrl);
  };

  return (
    <div className="group flex items-start gap-2">
      <Checkbox id={id} checked={isChecked} onCheckedChange={handleCheckboxChange} />
      <Link
        href={nextUrl}
        className="margin-0 -mt-0.5 p-0 text-sm leading-normal font-normal underline-offset-4 group-hover:underline group-hover:underline-offset-4"
        replace
        shallow
        scroll={false}
      >
        {title}&nbsp;({count})
      </Link>
    </div>
  );
}
