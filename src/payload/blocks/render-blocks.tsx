import { Page } from '@/payload/types';
import { Collection } from './collections/component';
import { Slider } from './slider/component';

type RenderBlocksProps = {
  blocks: NonNullable<Page['layout']>[number][];
};

export function RenderBlocks({ blocks }: RenderBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }
  return (
    <>
      {blocks.map((block, index) => {
        const { blockType, id } = block;
        switch (blockType) {
          case 'slider':
            return <Slider key={id ?? index} {...block} />;
          case 'collection':
            return <Collection key={id ?? index} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
