import { site } from '@/constants/site';
import { BreadcrumbList, WithContext } from 'schema-dts';

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

  return [breadcrumb];
}
