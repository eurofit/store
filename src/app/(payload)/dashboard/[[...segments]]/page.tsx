/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next';

import config from '@payload-config';
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import * as React from 'react';
import { importMap } from '../importMap';

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

const Page = ({ params, searchParams }: Args) => (
  <React.Suspense>
    <RootPage
      config={config}
      params={params}
      searchParams={searchParams}
      importMap={importMap}
    />
  </React.Suspense>
);

export default Page;
