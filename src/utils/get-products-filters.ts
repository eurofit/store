import { FormattedBrand } from './brand/format-brand';

export type Filter = { name: string; slug: string; count: number };

export function getProductsFilters(products: FormattedBrand['products']) {
  const categoryMap = new Map<string, Filter>();
  const sizeMap = new Map<string, Filter>();
  const brandMap = new Map<string, Filter>();

  products?.forEach((product) => {
    // Categories
    product.categories?.forEach((category) => {
      if (
        category &&
        typeof category === 'object' &&
        'slug' in category &&
        'title' in category
      ) {
        const slug = category.slug;
        if (categoryMap.has(slug)) {
          categoryMap.get(slug)!.count += 1;
        } else {
          categoryMap.set(slug, { name: category.title, slug, count: 1 });
        }
      }
    });
    // Sizes
    product.productLines?.forEach((line) => {
      if (typeof line.size === 'string') {
        const size = line.size;
        if (sizeMap.has(size)) {
          sizeMap.get(size)!.count += 1;
        } else {
          sizeMap.set(size, { name: size, slug: size, count: 1 });
        }
      }
    });

    if (
      product.brand &&
      typeof product.brand === 'object' &&
      'slug' in product.brand &&
      'title' in product.brand
    ) {
      const slug = product.brand.slug;
      if (brandMap.has(slug)) {
        brandMap.get(slug)!.count += 1;
      } else {
        brandMap.set(slug, { name: product.brand.title, slug, count: 1 });
      }
    }
  });

  const categories = Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const sizes = Array.from(sizeMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  const brands = Array.from(brandMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return { brands, categories, sizes };
}
