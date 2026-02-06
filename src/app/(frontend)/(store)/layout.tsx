import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { JsonLd } from '@/components/json-ld';
import { localBusiness, organization, website } from '@/constants/json-ld';
import * as React from 'react';

type StoreLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <>
      <JsonLd jsonLd={[organization, website, localBusiness]} />
      <div className="container mx-auto">
        <Header />
        <div className="relative min-h-[calc(100vh-5rem)] p-6 md:min-h-[calc(100vh-4rem)]">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
}
