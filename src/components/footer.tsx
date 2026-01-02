import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { site } from '@/constants/site';
import { SendHorizonal } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './logo';

export async function Footer() {
  return (
    <footer className="no-italic border-t px-6 py-12 md:py-16">
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

          <address className="text-muted-foreground max-w-sm text-sm">
            Unit 111, 1st Floor, 6th street tower, <br />
            6th street, Eastleigh, <br />
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
              >
                <Icon />
                <span className="sr-only">Reach out us on: {name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-2">
          <h4 className="text-sm font-semibold">Quick Links</h4>
          {['Products', 'About Us', 'Store Locator', 'Careers', 'Contact', 'FAQ'].map(
            (item, index) => (
              <Link
                key={`quick-links-${index}`}
                href="#"
                className="animated-underline text-muted-foreground hover:text-primary w-fit text-sm transition-colors"
                prefetch={false}
              >
                {item}
              </Link>
            ),
          )}
        </div>
        {/* Customer Service */}
        <div className="grid gap-2">
          <h4 className="text-sm font-semibold">Customer Service</h4>
          {[
            'Shipping Info',
            'Returns',
            'Order Tracking',
            'Size Guide',
            'Gift Cards',
            'Help Center',
          ].map((item, index) => (
            <Link
              key={`customer-service-${index}`}
              href="#"
              className="animated-underline text-muted-foreground hover:text-primary w-fit text-sm transition-colors"
              prefetch={false}
            >
              {item}
            </Link>
          ))}
        </div>
        {/* Resources */}
        <div className="grid gap-2">
          <h4 className="text-sm font-semibold">Resources</h4>
          {[
            'Blog',
            'Fitness Tips',
            'Nutrition Guide',
            'Workout Plans',
            'Product Reviews',
            'Community',
          ].map((item, index) => (
            <Link
              key={`resources-${index}`}
              href="#"
              className="animated-underline text-muted-foreground hover:text-primary w-fit text-sm transition-colors"
              prefetch={false}
            >
              {item}
            </Link>
          ))}
        </div>
        {/* Company */}
        <div className="grid gap-2">
          <h4 className="text-sm font-semibold">Company</h4>
          {[
            'Our Story',
            'Wholesale',
            'Partnerships',
            'Sustainability',
            'Press Kit',
            'Affiliates',
          ].map((item, index) => (
            <Link
              key={`company-${index}`}
              href="#"
              className="animated-underline text-muted-foreground hover:text-primary w-fit text-sm transition-colors"
              prefetch={false}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="grid max-w-xs gap-2 max-sm:col-span-full max-sm:row-start-3 md:col-span-2 lg:col-span-1">
          <h4 className="text-sm font-semibold">Stay Updated</h4>
          <p className="text-muted-foreground text-sm">
            Subscribe for exclusive offers and tips.
          </p>
          <form className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input type="email" placeholder="Enter your email" className="h-9" />
              <Button type="submit" size="sm" className="h-9">
                <SendHorizonal className="h-4 w-4" />
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
            &copy; {new Date().getFullYear()} {site.name.toUpperCase()}. All rights
            reserved.
          </p>
          <p className="hidden sm:block">|</p>
          <p>VAT: EU123456789</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Returns Policy'].map(
            (item) => (
              <Link
                key={item}
                href="#"
                className="hover:text-primary divide-x-2 divide-red-700 transition-colors"
                prefetch={false}
              >
                {item}
              </Link>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}
