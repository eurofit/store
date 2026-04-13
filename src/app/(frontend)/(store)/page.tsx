import { RenderBlocks } from '@/payload/blocks/render-blocks';
import config from '@/payload/config';
import { getPayload } from 'payload';

export default async function Home() {
  const payload = await getPayload({
    config,
  });

  const { docs: pages } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    limit: 1,
    pagination: false,
  });

  const page = pages[0];

  return (
    <div className="space-y-10 lg:space-y-14">
      <RenderBlocks blocks={page.layout} />
      {/* <StoreCarousel /> */}
      {/* <ProductDeals /> */}
      {/* <CategoriesList /> */}
      {/* <TopBrandsCarousel /> */}
      {/* <DailyEssentials /> */}
      {/* <Component /> */}
    </div>
  );
}
