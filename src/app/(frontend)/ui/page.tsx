'use client';

import * as React from 'react';

import { PdfViewer } from '@/pdf/components/pdf-viewer';

export default function Page() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <PdfViewer />
    </React.Suspense>
  );
}
