'use client';

import { CarouselDots } from '@/components/ui-extras/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useInView } from '@/hooks/use-in-view';
import { type Slider } from '@/payload/types';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

type SliderProps = Omit<Slider, 'id' | 'blockType' | 'blockName'>;

export function Slider({ slides }: SliderProps) {
  const { ref, isInView } = useInView();

  const isActive = isInView && slides.length > 1;

  return (
    <Carousel
      ref={ref}
      opts={{ loop: true, active: isActive }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: false,
        }),
      ]}
      className="relative w-full rounded shadow select-none!"
    >
      <CarouselContent className="h-60 rounded md:h-76">
        {slides.map(({ images, link }, index) => {
          const { defaultUrl, sources } = getImageSources(images);
          return (
            <CarouselItem key={index} className="rounded">
              <picture>
                {sources.map((src) => (
                  <source key={src.srcSet} srcSet={src.srcSet} media={src.media} />
                ))}

                <img
                  src={defaultUrl ?? undefined}
                  alt={`Slide ${index + 1}`}
                  className="size-full rounded object-cover"
                />
              </picture>
              {link && <Link href={link} className="absolute inset-0" />}
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {slides.length > 1 && (
        <>
          <CarouselPrevious variant="default" className="-left-4" />
          <CarouselNext variant="default" className="-right-4" />
          <CarouselDots className="-bottom-6" />
        </>
      )}
    </Carousel>
  );
}

function getImageSources(images: SliderProps['slides'][number]['images']) {
  const defaultImage = images.find((img) => img.isDefault);

  const sources = images
    .sort((a, b) => {
      if (a.isMobile && !b.isMobile) return -1;
      if (!a.isMobile && b.isMobile) return 1;
      return 0;
    })
    .map(({ image, isMobile }) => ({
      srcSet: typeof image === 'string' ? image : (image?.url ?? undefined),
      media: isMobile ? '(max-width: 767px)' : '(min-width: 768px)',
    }));

  return {
    defaultUrl:
      typeof defaultImage?.image === 'string'
        ? defaultImage.image
        : defaultImage?.image?.url,
    sources,
  };
}
