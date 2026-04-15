import { Page } from '@/payload/types';
import { Slider } from './slider/component';

const blockComponents = {
  slider: Slider,
};

type RenderBlocksProps = {
  blocks: NonNullable<Page['layout']>[number][];
};

export function RenderBlocks({ blocks }: RenderBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }
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
