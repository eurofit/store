import { Media } from '@/payload/types';
import { ImageProps } from 'next/image';

type PayloadImageProps = {
  src: string | Media;
} & Omit<ImageProps, 'src'>;

export function PayloadImage({ src, ...props }: PayloadImageProps) {
  const url = typeof src === 'string' ? src : src.url;
  if (!url) return null;
  return <img src={url} {...props} />;
}
