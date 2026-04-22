import { Header } from '@/components/header';
import dynamic from 'next/dynamic';
import * as React from 'react';

const Footer = dynamic(() => import('@/components/footer').then((mod) => mod.Footer), {
  ssr: true,
});

type StoreLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="container mx-auto">
      <Header />
      <div className="relative min-h-[calc(100vh-5rem)] p-4 md:min-h-[calc(100vh-4rem)] md:p-6">
        {children}
      </div>
      <React.Suspense fallback={<div>Loading footer...</div>}>
        <Footer />
      </React.Suspense>
    </div>
  );
}
