'use client';

import dynamic from 'next/dynamic';

export const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false },
);
