import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

type DailyEssentialsProps = {};

export function DailyEssentials({}: DailyEssentialsProps) {
  return (
    <section className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="scroll-m-20 space-x-2 text-lg font-medium capitalize">
          <span> Shop from</span>
          <Link
            href="#"
            className="text-primary hover:underline hover:underline-offset-8"
          >
            Top Categories
          </Link>
        </h2>
        <Button variant="link" asChild>
          <Link href="#">
            <span>View all</span>
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="flex justify-evenly gap-6">
        <DailyEssential />
        <DailyEssential />
        <DailyEssential />
        <DailyEssential />
        <DailyEssential />
        <DailyEssential />
        <DailyEssential />
      </div>
    </section>
  );
}

type DailyEssentialProps = {};

function DailyEssential({}: DailyEssentialProps) {
  return (
    <div className="group relative flex flex-col items-center space-y-4 rounded-lg">
      <div className="bg-muted group-hover:ring-primary rounde-md size-32 group-hover:ring"></div>
      <span className="font-medium">DailyEssential</span>
    </div>
  );
}
