const brandsKeywordsTemplate = [
  // Brand Basics
  '{brand}',
  '{brand} Kenya',
  '{brand} supplements',
  '{brand} nutrition',
  '{brand} near me',
  '{brand} shop Nairobi',
  'Eurofit {brand} Kenya',
  'Eurofit {brand} Nairobi',
  'Eurofit {brand} supplements Kenya',
  '{brand} reviews Kenya',
  '{brand} ratings Kenya',
  'Top {brand} products Kenya',
  'Buy {brand} products Kenya',
  'Best {brand} sellers Kenya',

  // Buyer Intent
  'Buy {brand} online Kenya',
  'Buy {brand} Nairobi',
  'Buy {brand} in Kenya',
  'Order {brand} supplements Nairobi',
  'Where to buy {brand} in Kenya',
  'Where to get {brand} Nairobi',
  'Best place to buy {brand} Kenya',
  'Best site to buy {brand} Kenya',
  'Get {brand} fast Nairobi',
  'Same-day delivery {brand} Nairobi',
  'Shop {brand} online Kenya',
  '{brand} online store Kenya',
  'Kenya trusted seller of {brand}',
  'Top {brand} stores in Nairobi',

  // Price & Deals
  'Cheap {brand} Kenya',
  'Affordable {brand} Kenya',
  'Best {brand} prices Kenya',
  '{brand} discounts Kenya',
  '{brand} offers Nairobi',
  '{brand} price comparison Kenya',
  '{brand} deals Kenya',
  '{brand} sale Nairobi',
  'Compare {brand} prices Kenya',
  'Lowest price {brand} Kenya',
  'Discounted {brand} Nairobi',
  'Kenya {brand} price list',
  'Budget {brand} supplements',
  'Price of {brand} in Kenya',
  'Ksh {brand} prices Nairobi',
  '{brand} price in Nairobi supermarkets',

  // Wholesale, Supplier, Distributor Intent
  '{brand} wholesale Kenya',
  '{brand} bulk supplier Kenya',
  '{brand} distributor Kenya',
  '{brand} dealers Kenya',
  '{brand} authorized distributor Nairobi',
  '{brand} stockist Nairobi',
  '{brand} importers Kenya',
  'Official {brand} supplier Kenya',
  'Eurofit {brand} wholesale Nairobi',
  'Where to buy {brand} in bulk Kenya',
  '{brand} wholesale price Kenya',
  '{brand} resellers Kenya',
  'Become {brand} reseller Kenya',
  'Wholesale prices for {brand} Nairobi',
  '{brand} retail vs wholesale prices Kenya',
  'Best {brand} wholesaler Nairobi',
  'Wholesale {brand} supplements supplier Kenya',
  '{brand} B2B supplier Kenya',

  // Niche Keywords (Intent + Industry Specific)
  'Genuine {brand} supplements Kenya',
  'Original {brand} Nairobi',
  'Authentic {brand} products Kenya',
  'Certified {brand} dealers Kenya',
  'Best {brand} for gym users Kenya',
  'Best {brand} for athletes Kenya',

  // Generic region-focused
  'Buy {brand} near me in Kenya',
  '{brand} shops near me',
  'Best {brand} suppliers near me',
  'Order {brand} by town',
  'Where to buy {brand} in my area Kenya',

  // Generic Search Variants
  '{brand} official store Kenya',
  '{brand} Kenya online',
  'Kenya {brand} products',
  'Kenya {brand} online shop',
  'Kenya health store {brand}',
  'Kenya supplement shop {brand}',
  'Nairobi fitness market {brand}',
];

export function generateBrandKeywords(brandName: string): string[] {
  const brandKeywords = brandsKeywordsTemplate.map((keyword) =>
    keyword.replace(/{brand}/g, brandName),
  );

  const keywords = Array.from(new Set(brandKeywords));

  return keywords;
}
