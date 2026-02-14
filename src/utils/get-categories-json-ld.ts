import { site } from '@/constants/site';
import { Category } from '@/types';
import { BreadcrumbList, WithContext } from 'schema-dts';

export function getCategoriesJsonLd(categories: Category[]) {
  const pageUrl = `${site.url}/categories`;

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
        name: 'Shop Supplements by Category',
        item: pageUrl,
      },
    ],
  };

  return [breadcrumb];
}
