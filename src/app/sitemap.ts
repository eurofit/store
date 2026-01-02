import { getBrandsSitemap } from '@/actions/brands/get-brands-sitemap';
import { getCategoriesSitemap } from '@/actions/categories/get-categories-sitemap';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [brandsSitemap, categoriesSitemap] = await Promise.all([
    getBrandsSitemap(),
    getCategoriesSitemap(),
  ]);

  return [...brandsSitemap, ...categoriesSitemap];
}
