import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Counter } from './counter';
import { AspectRatio } from './ui/aspect-ratio';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

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

        <div className="flex space-x-2">
          <span className="capitalize">Time left</span>
          <Counter startDate={now} endDate={end} className="font-bold" />
        </div>

        <Link href="#" className="ml-auto flex items-center gap-2">
          <span>View all</span>
          <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-2">
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
        <Image alt="Whey protein" src="/whey.png" fill className="object-contain" />
      </AspectRatio>
      <div className="space-y-2 px-2">
        <h3 className="leading-tight font-medium">
          ON GST 100% Whey Protein Powder (2.27kg)
        </h3>
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-semibold">Ksh 11,650</span>
          <span className="text-muted-foreground text-sm line-through">Ksh 11,650</span>
        </div>
      </div>
      <Separator />
      {/* <div className="px-2">
        <span className="text-sm font-medium text-green-700 selection:bg-green-700 selection:text-white">
          Save - Ksh 1800
        </span>
      </div> */}
      <Badge className="absolute top-2 right-2">56% OFF</Badge>
    </div>
  );
}
