import { site } from '@/constants/site';
import { BreadcrumbList, ContactPage, WebPage, WithContext } from 'schema-dts';

export function getContactUsJsonLd() {
  const pageUrl = `${site.url}/contact-us`;

  // --- Breadcrumbs ---
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  const breadcrumb: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: site.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact Us',
        item: pageUrl,
      },
    ],
  };

  // ---------------- ContactPage ----------------
  const contactPage: WithContext<ContactPage> = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${pageUrl}#contactpage`,
    url: pageUrl,
    name: `Contact ${site.name}`,
    isPartOf: { '@id': `${site.url}/#website` },
    about: { '@id': `${site.url}/#organization` },
    breadcrumb: { '@id': breadcrumbId },
    mainEntity: { '@id': `${site.url}/#organization` },
  };

  // ---------------- WebPage ----------------
  const webpage: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: 'Contact Us',
    isPartOf: { '@id': `${site.url}/#website` },
    about: { '@id': `${site.url}/#organization` },
    breadcrumb: { '@id': breadcrumbId },
    mainEntity: { '@id': `${pageUrl}#contactpage` },
  };

  return [breadcrumb, contactPage, webpage];
}
