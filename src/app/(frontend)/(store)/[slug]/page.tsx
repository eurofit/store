import { JsonLd } from '@/components/json-ld';
import { RenderBlocks } from '@/payload/blocks/render-blocks';
import config from '@/payload/config';
import { getFaqJsonLd } from '@/utils/json-ld/get-faqs-json-ld';
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext';
import { getPayload } from 'payload';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Props) {
  const [params, payload] = await Promise.all([
    paramsPromise,
    getPayload({
      config,
    }),
  ]);

  const { slug } = params;

  const { docs: pages } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
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

  const faqs = page.layout
    .filter((block) => block.blockType == 'faq')
    .flatMap((block) =>
      block.faqs.map((faq) => ({
        ...faq,
        answer: convertLexicalToPlaintext({ data: faq.answer }),
      })),
    );

  const faqJsonLd = getFaqJsonLd(faqs);

  return (
    <>
      <JsonLd jsonLd={faqJsonLd} />
      <div className="relative w-full space-y-10 lg:space-y-14">
        <RenderBlocks blocks={page?.layout} />
      </div>
    </>
  );
}
