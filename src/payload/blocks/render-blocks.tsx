import { Page } from '@/payload/types';
import { Slider } from './slider/component';

type RenderBlocksProps = {
  blocks: NonNullable<Page['layout']>[number][];
};

const blockComponents = {
  slider: Slider,
};

export function RenderBlocks({ blocks }: RenderBlocksProps) {
  return (
    <>
      {blocks.map(({ blockType, id, ...block }) => {
        const Block = blockComponents[blockType];

        if (Block) {
          return <Block key={id} {...block} />;
        }
        return null;
      })}
    </>
  );
}
