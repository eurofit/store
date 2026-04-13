'use client';

import { PayloadImage } from '@/components/payload-image';
import { CarouselDots } from '@/components/ui-extras/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { type Slider } from '@/payload/types';
import { cn } from '@/utils/cn';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

type SliderProps = Omit<Slider, 'id' | 'blockType' | 'blockName'>;

export function Slider({ slides }: SliderProps) {
  return (
    <Carousel
      className="relative rounded select-none!"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: false,
        }),
      ]}
    >
      <CarouselContent className="h-72 gap-2 rounded">
        {slides.map(({ image, link }, index) => (
          <CarouselItem
            key={index}
            className={cn('relative basis-full rounded', {
              'basis-[92%]': slides.length > 1,
            })}
          >
            <PayloadImage
              src={image}
              alt={`Slide ${index + 1}`}
              className="size-full rounded object-cover"
            />
            {link && <Link href={link} className="absolute inset-0" />}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious variant="default" className="-left-4 z-50" />
      <CarouselNext variant="default" className="-right-4" />
      <CarouselDots className="-bottom-6" />
    </Carousel>
  );
}
