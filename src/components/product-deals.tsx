import { Countdown } from '@/components/countdown';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type ProductDealsProps = {};

export function ProductDeals({}: ProductDealsProps) {
  const now = new Date();
  const end = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  return (
    <section>
      <div className="bg-destructive border-t-md grid grid-cols-3 place-items-center p-2 text-white">
        <h2 className="scroll-m-20 space-x-2 text-lg font-medium">
          <span> Grab the best deals on</span>
          <Link href="#">Supports Nutrition</Link>
        </h2>

        <div>
          <span className="capitalize">Time left</span>
          &nbsp;
          <Countdown
            end={end.toISOString()}
            className="inline-flex w-30 font-bold tabular-nums"
          />
        </div>

        <Link href="#" className="ml-auto flex items-center gap-2">
          <span>View all</span>
          <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="grid gap-6 py-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
      </div>
    </section>
  );
}

type ProductProps = {};

function Product({}: ProductProps) {
  return (
    <div className="relative space-y-2 rounded-lg shadow-sm">
      <AspectRatio ratio={4 / 3} className="bg-muted flex items-center justify-center">
        <Image
          alt="Whey protein"
          src="/whey.png"
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        />
      </AspectRatio>
      <div className="space-y-2 px-2">
        <h3 className="leading-tight font-medium">
          ON GST 100% Whey Protein Powder (2.27kg)
        </h3>
        <div className="flex items-center space-x-2">
          <ins className="font-bold no-underline">Ksh 11,650</ins>
          <del className="before relative text-sm no-underline before:absolute before:top-1/2 before:right-0 before:left-0 before:-translate-y-1/2 before:rotate-5 before:border-t before:border-t-red-700 before:content-['']">
            Ksh 11,650
          </del>
        </div>
      </div>
      <Badge className="absolute top-2 right-2 bg-red-700 text-red-50">56% OFF</Badge>
    </div>
  );
}
