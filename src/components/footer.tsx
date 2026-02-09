import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { site } from '@/constants/site';
import { SendHorizonal } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './logo';

const QUICK_LINKS = [
  'Products',
  'About Us',
  'Store Locator',
  'Careers',
  'Contact',
  'FAQ',
];
const CUSTOMER_SERVICE = [
  'Shipping Info',
  'Returns',
  'Order Tracking',
  'Size Guide',
  'Gift Cards',
  'Help Center',
];
const RESOURCES = [
  'Blog',
  'Fitness Tips',
  'Nutrition Guide',
  'Workout Plans',
  'Product Reviews',
  'Community',
];
const COMPANY = [
  'Our Story',
  'Wholesale',
  'Partnerships',
  'Sustainability',
  'Press Kit',
  'Affiliates',
];
const LEGAL = ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Returns Policy'];

export async function Footer() {
  return (
    <footer
      className="no-italic border-t px-6 py-12 md:py-16"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-10">
        {/* Brand Section */}
        <div className="flex flex-col items-start gap-4">
          <div>
            <Logo className="text-xl font-bold" />
            <p className="text-muted-foreground max-w-xs text-sm">
              Your Authentic European fitness, health and skincare supplier &
              retailer in Kenya
            </p>
          </div>

          <address className="text-muted-foreground max-w-sm text-sm not-italic">
            Unit 111, 1st Floor, 6th Street Tower, <br />
            6th Street, Eastleigh, <br />
            Nairobi, Kenya.
          </address>

          {/* Social Links */}
          <div className="text-foreground flex items-center gap-4">
            {site.socialLinks.map(({ name, href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="group transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon aria-hidden="true" />
                <span className="sr-only">Visit us on {name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <nav className="grid gap-2" aria-labelledby="quick-links-heading">
          <p id="quick-links-heading" className="text-sm font-semibold">
            Quick Links
          </p>
          {QUICK_LINKS.map((item, index) => (
            <Link
              key={`quick-links-${index}`}
              href="#"
              className="animated-underline text-muted-foreground hover:text-primary w-fit text-sm transition-colors"
              prefetch={false}
            >
              {item}
            </Link>
          ))}
        </nav>
        {/* Customer Service */}
        <nav className="grid gap-2" aria-labelledby="customer-service-heading">
          <p id="customer-service-heading" className="text-sm font-semibold">
            Customer Service
          </p>
          {CUSTOMER_SERVICE.map((item, index) => (
            <Link
              key={`customer-service-${index}`}
              href="#"
              className="animated-underline text-muted-foreground hover:text-primary w-fit text-sm transition-colors"
              prefetch={false}
            >
              {item}
            </Link>
          ))}
        </nav>
        {/* Resources */}
        <nav className="grid gap-2" aria-labelledby="resources-heading">
          <p id="resources-heading" className="text-sm font-semibold">
            Resources
          </p>
          {RESOURCES.map((item, index) => (
            <Link
              key={`resources-${index}`}
              href="#"
              className="animated-underline text-muted-foreground hover:text-primary w-fit text-sm transition-colors"
              prefetch={false}
            >
              {item}
            </Link>
          ))}
        </nav>
        {/* Company */}
        <nav className="grid gap-2" aria-labelledby="company-heading">
          <p id="company-heading" className="text-sm font-semibold">
            Company
          </p>
          {COMPANY.map((item, index) => (
            <Link
              key={`company-${index}`}
              href="#"
              className="animated-underline text-muted-foreground hover:text-primary w-fit text-sm transition-colors"
              prefetch={false}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Newsletter */}
        <div className="grid max-w-xs gap-2 max-sm:col-span-full max-sm:row-start-3 md:col-span-2 lg:col-span-1">
          <p className="text-sm font-semibold">Stay Updated</p>
          <p className="text-muted-foreground text-sm">
            Subscribe for exclusive offers & tips.
          </p>
          <form className="flex flex-col gap-2" aria-label="Newsletter signup">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-9"
                autoComplete="email"
                spellCheck={false}
                required
                aria-label="Email address"
              />
              <Button
                type="submit"
                size="sm"
                className="h-9"
                aria-label="Subscribe to newsletter"
              >
                <SendHorizonal className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-muted-foreground mt-12 flex flex-col items-center justify-between gap-6 border-t pt-8 text-xs sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name.toUpperCase()}. All Rights Reserved.
          </p>
          <p className="hidden sm:block" aria-hidden="true">
            |
          </p>
          <p>VAT: EU123456789</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2" aria-label="Legal">
          {LEGAL.map((item) => (
            <Link
              key={item}
              href="#"
              className="hover:text-primary transition-colors"
              prefetch={false}
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
