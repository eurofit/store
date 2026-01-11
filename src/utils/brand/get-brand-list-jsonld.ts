import { site } from "@/constants/site"
import type { Brand } from "@/types"
import {
  Brand as BrandSchema,
  BreadcrumbList,
  Thing,
  WebPage,
  WithContext,
} from "schema-dts"

type BrandListJsonLdOptions = {
  brands: Brand[]
}

export function getBrandsJsonLd({
  brands,
}: BrandListJsonLdOptions): WithContext<Thing>[] {
  const brandsUrl = `${site.url}/brands`

  // --- Breadcrumbs ---
  const breadcrumbId = `${brandsUrl}#breadcrumb`

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop By Brand",
        item: brandsUrl,
      },
    ],
  }

  // --- WebPage ---
  const webpage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${brandsUrl}#webpage`,
    url: brandsUrl,
    name: "Shop by Brands",
    description:
      "Explore our wide range of brands and find your favorites. Discover top sports nutrition brands at unbeatable prices, available in Kenya.",
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": `${site.url}/#organization` },
    breadcrumb: { "@id": breadcrumbId },
  }

  // --- Brand nodes ---
  const brandNodes: WithContext<BrandSchema>[] = brands.map((brand) => {
    const brandUrl = `${site.url}/brands/${brand.slug}`
    return {
      "@context": "https://schema.org",
      "@type": "Brand",
      "@id": `${brandUrl}#brand`,
      name: brand.title,
      url: brandUrl,
      logo: brand.image ?? undefined,
      description: `${brand.title} is available in Kenya from ${site.name}.`,
    }
  })

  return [breadcrumb, webpage, ...brandNodes]
}
