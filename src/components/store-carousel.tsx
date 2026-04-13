'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/utils/cn';
import AutoPlay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { CarouselDots } from './ui-extras/carousel';

const slides = [
  {
    id: 1,
    title: 'Gold Standard 100% Whey ',
    subtitle: 'Best deals online on Sports nutrition',
    discount: 'UP to 80% OFF',
    price: {
      current: 49.99,
      original: 89.99,
    },
    rating: 4.8,
    reviews: 2456,
    image: '/supplements.png',
    badge: 'BESTSELLER',
    color: 'bg-gradient-to-r from-amber-50 to-amber-100',
  },
  {
    id: 2,
    title: 'Gold Standard 100% Whey ',
    subtitle: 'Best deals online on Sports nutrition',
    discount: 'UP to 80% OFF',
    price: {
      current: 49.99,
      original: 89.99,
    },
    rating: 4.8,
    reviews: 2456,
    image: '/supplements.png',
    badge: 'BESTSELLER',
    color: 'bg-gradient-to-r from-amber-50 to-amber-100',
  },
];

type StoreCarouselProps = React.ComponentProps<typeof Carousel>;

export function StoreCarousel(props: StoreCarouselProps) {
  return (
    <Carousel
      className="relative w-full shadow-sm select-none"
      opts={{ loop: true }}
      plugins={[
        AutoPlay({
          delay: 3000,
          stopOnInteraction: false,
        }),
      ]}
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem
            key={slide.id}
            className={cn('relative basis-full', {
              'basis-8/10': slides.length > 1,
            })}
          >
            <div className="relative h-80 w-full max-w-475">
              <Image
                src="/iso-xp.png"
                alt="Banner"
                fill
                priority
                sizes="100vw"
                className="h-auto w-full object-cover object-[24%_center]"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 z-50 bg-slate-900 text-white" />
      <CarouselNext className="-right-4 bg-slate-900 text-white" />
      <CarouselDots />
    </Carousel>
  );
}
