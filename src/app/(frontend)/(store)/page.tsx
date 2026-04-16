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
    populate: {
      collections: {
        generateSlug: false,
        description: false,
      },
      products: {
        slug: true,
        title: true,
        srcImage: true,
      },
    },
    limit: 1,
    pagination: false,
  });

  const page = pages[0];

  return (
    <div className="relative w-full space-y-10 lg:space-y-14">
      <RenderBlocks blocks={page?.layout} />
      {/* <CategoriesList /> */}
      {/* <TopBrandsCarousel /> */}
      {/* <DailyEssentials /> */}
      {/* <Component /> */}
    </div>
  );
}
