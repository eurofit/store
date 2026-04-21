import { cn } from '@/utils/cn';
import { DefaultNodeTypes } from '@payloadcms/richtext-lexical';
import { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react';

type NodeTypes = DefaultNodeTypes;

export const smConverters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => {
    const content = nodesToJSX({ nodes: node.children });

    const text =
      typeof content === 'string'
        ? content
        : Array.isArray(content)
          ? content.join('')
          : '';
    return <p className="leading-6 not-first:mt-2">{text}</p>;
  },
  list: ({ node, nodesToJSX }) => {
    const content = nodesToJSX({ nodes: node.children });

    const Comp = node.listType === 'number' ? 'ol' : 'ul';

    return (
      <Comp
        className={cn('my-3 ml-3 [&>li]:mt-2', {
          'list-disc': node.listType === 'bullet',
          'list-decimal': node.listType === 'number',
          'list-inside [&>li]:before:content-["✓"]': node.listType === 'check',
        })}
      >
        {content}
      </Comp>
    );
  },
});
