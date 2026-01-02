'use client';

import { site } from '@/constants/site';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ComponentPropsWithoutRef } from 'react';

type AnnounceBarProps = {} & ComponentPropsWithoutRef<'div'>;

export function AnnounceBar({ className }: AnnounceBarProps) {
  return (
    <div className="flex h-7 items-center justify-between bg-black px-6 text-white">
      <div className="text-sm">
        <p>Welcome to our store!</p>
      </div>
      <div className="ml-auto flex grow items-center justify-center text-sm">
        <p>Welcome to our store! Enjoy shopping with us.</p>
      </div>
      <div className="ml-auto flex items-center justify-center gap-4">
        <a href={site.contact.phone.href}>
          <Mail strokeWidth={2} className="hover:text-primary size-4" />
          <span className="sr-only">Drop us an email on: {site.contact.email.text}</span>
        </a>

        <a href={site.contact.phone.href}>
          <Phone strokeWidth={2} className="hover:text-primary size-4" />
          <span className="sr-only">Call us on: {site.contact.phone.text}</span>
        </a>

        <a href={site.address.href}>
          <MapPin strokeWidth={2} className="hover:text-primary size-4" />
          <span className="sr-only">Visit us on: {site.address.city}</span>
        </a>
      </div>
    </div>
  );
}
