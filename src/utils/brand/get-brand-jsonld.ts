import { organization, website } from '@/constants/json-ld';
import { site } from '@/constants/site';
import { Brand, Product, ProductLine } from '@/payload-types';
import { getBrandFaqs } from '@/utils/brand/get-brand-faqs';
import {
  Brand as BrandSchema,
  BreadcrumbList,
  FAQPage,
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

interface BrandPageJsonLdOptions {
  brand: BrandLite;
  productLines: ProductLineLite[];
  resolveVariantUrl?: (pl: ProductLineLite) => string; // default below
}

export function getBrandJsonLd({
  brand,
  productLines,
  resolveVariantUrl = (pl) => `${site.url}/products/${pl.slug}`,
}: BrandPageJsonLdOptions): WithContext<Thing>[] {
  const brandUrl = `${site.url}/brands/${brand.slug}`;

  // --- Breadcrumbs ---
  const breadcrumbId = `${brandUrl}#breadcrumb`;

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
        name: 'Brands',
        item: `${site.url}/brands`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: brand.title,
        item: brandUrl,
      },
    ],
  };

  // --- WebPage (this brand landing page) ---
  const webpage: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${brandUrl}#webpage`,
    url: brandUrl,
    name: `Buy ${brand.title} Products in Kenya - ${site.name}`,
    description: `${brand.title} product listings from Eurofit – verified authentic European supplements, sports nutrition, and skincare products available in Kenya for retail and wholesale.`,
    isPartOf: { '@id': `${site.url}/#website` },
    about: { '@id': `${site.url}/#organization` },
    breadcrumb: { '@id': breadcrumbId },
    mainEntity: { '@id': `${brandUrl}#brand` },
  };

  // --- Brand node ---
  const brandNode: WithContext<BrandSchema> = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    '@id': `${brandUrl}#brand`,
    name: brand.title,
    url: brandUrl,
    logo: brand.srcImage ?? undefined,
    description: `${brand.title} products are supplied in Kenya through Eurofit Health & Beauty LTD and verified for authenticity.`,
    mainEntityOfPage: { '@id': `${brandUrl}#webpage` },
  };

  // --- Product variant nodes (one per ProductLine) ---
  const variantProducts: WithContext<ProductSchema>[] = productLines.map((pl) => {
    const canonicalUrl = resolveVariantUrl(pl);
    const img = pl.product.srcImage ?? brand.srcImage ?? undefined;

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
      brand: { '@id': `${brandUrl}#brand` },
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

  // --- ItemList referencing the variant Product nodes ---
  const itemList: WithContext<ItemList> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${brandUrl}#catalog`,
    name: `${brand.title} Product Catalog`,
    url: brandUrl,
    numberOfItems: productLines.length,
    itemListElement: variantProducts.map((vp, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@id': vp['@id'] as string },
    })),
  };

  // --- FAQPage for this brand ---
  const faqData = getBrandFaqs(brand.title);
  const faqPage: WithContext<FAQPage> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return [
    organization,
    website,
    breadcrumb,
    webpage,
    brandNode,
    itemList,
    ...variantProducts,
    faqPage,
  ];
}
