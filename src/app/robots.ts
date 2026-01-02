import { site } from '@/constants/site';
import { type MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    //  TODO: disable dashboard, auth pages from being indexed in production
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
