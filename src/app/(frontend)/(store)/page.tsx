import { ProductDeals } from '@/components/product-deals';
import { StoreCarousel } from '@/components/store-carousel';
import { TopBrandsCarousel } from '@/components/top-brands-carousel';

export default async function Home() {
  return (
    <div className="space-y-10 lg:space-y-14">
      <StoreCarousel />
      <ProductDeals />
      {/* <CategoriesList /> */}
      <TopBrandsCarousel />
      {/* <DailyEssentials /> */}
      {/* <Component /> */}
    </div>
  );
}
