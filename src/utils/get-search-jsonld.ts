import { organization, website } from '@/constants/json-ld';
import { site } from '@/constants/site';
import { Brand, Product, ProductLine } from '@/payload-types';
import {
  BreadcrumbList,
  ItemList,
  Offer,
  Product as ProductSchema,
  Thing,
  WebPage,
  WithContext,
} from 'schema-dts';

// --- helpers --------------------------------------------------------------

function availabilityFromStock(stock?: number, srcStock?: number) {
  if (typeof stock === 'number' && stock > 0) return 'https://schema.org/InStock';
  if (typeof srcStock === 'number' && srcStock > 0) return 'https://schema.org/PreOrder';
  return 'https://schema.org/OutOfStock';
}

function gtinPropsFromBarcode(raw?: ProductLine['barcode']) {
  if (!raw) return {};
  const code = raw.replace(/\D+/g, '');
  switch (code.length) {
    case 8:
      return { gtin8: code };
    case 12:
      return { gtin12: code };
    case 13:
      return { gtin13: code };
    case 14:
      return { gtin14: code };
    default:
      return { gtin: code };
  }
}

// --- input interfaces -----------------------------------------------------

type BrandLite = Pick<Brand, 'slug' | 'title' | 'srcImage'>;

type ProductLite = Pick<Product, 'slug' | 'title' | 'srcImage'>;

type ProductLineLite = Pick<
  ProductLine,
  | 'title'
  | 'slug'
  | 'sku'
  | 'barcode'
  | 'retailPrice'
  | 'stock'
  | 'srcStock'
  | 'size'
  | 'flavorColor'
  | 'expiryDate'
> & {
  product: ProductLite;
  brand: BrandLite;
};

// --- main builder ---------------------------------------------------------

interface SearchPageJsonLdOptions {
  query: string;
  productLines: ProductLineLite[];
  resolveVariantUrl?: (pl: ProductLineLite) => string; // default below
}

export function getSearchJsonLd({
  query,
  productLines,
  resolveVariantUrl = (pl) => `${site.url}/products/${pl.slug}`,
}: SearchPageJsonLdOptions): WithContext<Thing>[] {
  const searchUrl = `${site.url}/search?q=${encodeURIComponent(query)}`;

  // --- Breadcrumbs ---
  const breadcrumbId = `${searchUrl}#breadcrumb`;
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
        name: 'Search',
        item: searchUrl,
      },
    ],
  };

  // --- WebPage ---
  const webpage: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${searchUrl}#webpage`,
    url: searchUrl,
    name: `Search results for "${query}" | ${site.name}`,
    description: `Find products matching "${query}" on ${site.name}. Browse authentic supplements, sports nutrition, and skincare products available in Kenya.`,
    isPartOf: { '@id': `${site.url}/#website` },
    about: { '@id': `${site.url}/#organization` },
    breadcrumb: { '@id': breadcrumbId },
  };

  // --- Product variant nodes (from search results) ---
  const variantProducts: WithContext<ProductSchema>[] = productLines.map((pl) => {
    const canonicalUrl = resolveVariantUrl(pl);
    const img = pl.product.srcImage ?? pl.brand.srcImage ?? undefined;

    const offer: Offer = {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'KES',
      price: pl.retailPrice != null ? pl.retailPrice.toString() : undefined,
      availability: availabilityFromStock(pl.stock, pl.srcStock ?? 0),
    };

    const variantProps: Record<string, unknown> = {};
    if (pl.size) variantProps.size = pl.size;
    if (pl.flavorColor) variantProps.color = pl.flavorColor;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${canonicalUrl}#product`,
      url: canonicalUrl,
      name: pl.title,
      sku: pl.sku,
      image: img,
      brand: {
        '@type': 'Brand',
        name: pl.brand.title,
        url: `${site.url}/brands/${pl.brand.slug}`,
      },
      ...gtinPropsFromBarcode(pl.barcode),
      ...variantProps,
      isVariantOf: {
        '@type': 'Product',
        '@id': `${site.url}/products/${pl.product.slug}#product`,
        name: pl.product.title,
      },
      offers: offer,
    };
  });

  // --- ItemList ---
  const itemList: WithContext<ItemList> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${searchUrl}#results`,
    name: `Search results for "${query}"`,
    url: searchUrl,
    numberOfItems: productLines.length,
    itemListElement: variantProducts.map((vp, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@id': vp['@id'] as string },
    })),
  };

  return [organization, website, breadcrumb, webpage, itemList, ...variantProducts];
}
