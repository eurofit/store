import { site } from '@/constants/site';
import config from '@/payload/config';
import { slugify } from '@/utils/slugify';
import Link from 'next/link';
import { getPayload } from 'payload';
import CurrentYear from './current-year';
import { Logo } from './logo';
import { Newsletter } from './newsletter';

const LEGAL = ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Returns Policy'];

export async function Footer() {
  const payload = await getPayload({
    config,
  });

  const footer = await payload.findGlobal({
    slug: 'footer',
  });

  return (
    <footer
      className="no-italic relative w-full border-t px-6 py-12 md:py-16"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="flex grow flex-wrap items-start justify-between gap-10">
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

        <nav className="grid grow grid-cols-3 gap-6 md:mx-auto md:flex md:flex-wrap md:items-start md:justify-evenly">
          {footer.nav.map(({ label, links, id }) => (
            <section key={id} className="grid gap-2">
              <h2 id={slugify(label)} className="text-sm font-semibold">
                {label}
              </h2>
              {links?.map(({ label, url, id }) => (
                <Link
                  key={id}
                  href={url}
                  className="animated-underline text-muted-foreground hover:text-primary w-fit text-sm transition-colors"
                  prefetch={false}
                >
                  {label}
                </Link>
              ))}
            </section>
          ))}
        </nav>

        <Newsletter />
      </div>

      {/* Bottom Section */}
      <div className="text-muted-foreground mt-12 flex flex-col items-center justify-between gap-6 border-t pt-8 text-xs sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <p>
            © <CurrentYear /> {site.name.toUpperCase()}. All Rights Reserved.
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
