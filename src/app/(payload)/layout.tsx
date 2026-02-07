/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@/payload/config';
import '@payloadcms/next/css';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import type { ServerFunctionClient } from 'payload';
import * as React from 'react';

import { importMap } from './admin/importMap.js';
import './custom.css';

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  'use server';
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    <React.Suspense>{children}</React.Suspense>
  </RootLayout>
);

export default Layout;
