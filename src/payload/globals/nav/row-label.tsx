'use client';

import { Nav } from '@/payload/types';
import { useRowLabel } from '@payloadcms/ui';

export function RowLabel() {
  const { data } = useRowLabel<Nav['items'][number]>();
  return <span>{data.label}</span>;
}
