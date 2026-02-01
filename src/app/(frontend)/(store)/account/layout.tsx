import { Metadata } from 'next';

import { PageHeading } from '@/components/page-heading';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from './sidebar';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Manage your account settings.',
  robots: {
    index: false,
  },
};

const sidebarNavItems = [
  {
    title: 'Account',
    href: '/account',
  },
  {
    title: 'Addresses',
    href: '/account/addresses',
  },
  {
    title: 'Orders',
    href: '/account/orders',
  },
  {
    title: 'Stock Alerts',
    href: '/account/stock-alerts',
  },
  {
    title: 'Wishlist',
    href: '/account/wishlist',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6">
      <PageHeading
        title="Account"
        description="Manage your account settings and set e-mail preferences."
      />
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
