import Image from 'next/image';
import { DefaultCellComponentProps } from 'payload';

export function ImageCell({ cellData }: DefaultCellComponentProps) {
  if (!cellData) return null;
  return (
    <Image
      src={cellData}
      alt="Image"
      className="size-8 rounded bg-white object-contain"
      loading="lazy"
      width={32}
      height={32}
    />
  );
}
