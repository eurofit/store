'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps } from 'react';
import { Badge } from './ui/badge';

type TopBrandsCarouselProps = {};

export function TopBrandsCarousel({}: TopBrandsCarouselProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="scroll-m-20 space-x-2 text-lg font-medium capitalize">
          <span>Top</span>
          <Link
            href="#"
            className="text-primary hover:underline hover:underline-offset-8"
          >
            Sports Nutrition Brands
          </Link>
        </h2>
        <Button variant="link" asChild>
          <Link href="#">
            <span>View all</span>
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

type BrandSlideProps = {} & ComponentProps<'div'>;

function BrandSlide({ className }: BrandSlideProps) {
  return (
    <div
      className="group relative flex size-full overflow-hidden rounded-lg p-4"
      style={{
        backgroundColor: '#599140',
      }}
    >
      <div
        className="absolute -top-1/2 -right-1/4 size-40 -translate-x-1/2 translate-y-1/2 rounded-full"
        style={{
          backgroundColor: '#84b76c',
        }}
      />
      <div className="flex flex-1 flex-col justify-center gap-y-6">
        <Badge>Optimum Nutrition</Badge>
        <Image
          src="/on-logo.png"
          alt="on"
          height={100}
          width={160}
          className="object-contain"
        />
        <p className="font-medium invert">
          UP TO <span className="font-bold">80%</span> OFF
        </p>
        <Button>
          Shop now
          <ChevronRight />
        </Button>
      </div>
      <div className="relative h-full flex-1">
        <div className="relative -my-4 ml-auto h-[calc(100%+2rem)] w-full">
          <Image src="/whey.png" alt="on" fill className="object-contain" />
        </div>
      </div>
    </div>
  );
}

/* 

   <Carousel
        className="h-56 w-full select-none"
        opts={{
          loop: true,
          slidesToScroll: 3,
        }}
        plugins={[AutoPlay()]}
      >
        <CarouselContent>
          {Array(18)
            .fill(null)
            .map((_, index) => (
              <CarouselItem key={index} className="relative h-56 basis-1/3">
                <BrandSlide />
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselDots className="-bottom-4" />
      </Carousel>
*/
