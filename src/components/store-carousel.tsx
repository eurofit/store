'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useToggle } from '@/hooks/use-toggle';
import AutoPlay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useIdle } from 'react-use';
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
    title: 'Combat Protein Powder',
    subtitle: 'Premium muscle building formula',
    discount: 'SAVE 65% TODAY',
    price: {
      current: 39.99,
      original: 79.99,
    },
    rating: 4.6,
    reviews: 1872,
    image: '/supplements.png',
    badge: 'NEW ARRIVAL',
    color: 'bg-gradient-to-r from-blue-50 to-blue-100',
  },
  {
    id: 3,
    title: 'Serious Mass Gainer',
    subtitle: 'Maximum calorie formula for mass',
    discount: 'SPECIAL OFFER 70% OFF',
    price: {
      current: 54.99,
      original: 99.99,
    },
    rating: 4.7,
    reviews: 1345,
    image: '/supplements.png',
    badge: 'TRENDING',
    color: 'bg-gradient-to-r from-green-50 to-green-100',
  },
];

type StoreCarouselProps = React.ComponentProps<typeof Carousel>;

export function StoreCarousel({ className }: StoreCarouselProps) {
  const isIdle = useIdle();
  const { value: isActive, setOn, setOff } = useToggle(!isIdle);

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
        <CarouselItem className="relative w-full">
          <div className="relative h-auto w-full max-w-[1900px]">
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
      </CarouselContent>
      <CarouselPrevious className="-left-4 z-50 bg-slate-900 text-white" />
      <CarouselNext className="-right-4 bg-slate-900 text-white" />
      <CarouselDots />
    </Carousel>
  );
}
