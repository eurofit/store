import dynamic from 'next/dynamic';
import * as React from 'react';
import { AnnounceBar } from '@/components/announce-bar';
import { Header } from '@/components/header';

const Footer = dynamic(() => import('@/components/footer').then((mod) => ({ default: mod.Footer })), {
  ssr: true,
});

type StoreLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="container mx-auto">
      <AnnounceBar />
      <Header />
      <div className="relative min-h-[calc(100vh-5rem)] p-6 md:min-h-[calc(100vh-4rem)]">
        {children}
      </div>
      <Footer />
    </div>
  );
}
