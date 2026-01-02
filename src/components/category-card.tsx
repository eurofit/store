import { Category } from '@/types';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardAction, CardHeader, CardTitle } from './ui/card';

type CategoryCardProps = {
  category: Pick<Category, 'title' | 'slug'>;
  href?: string;
};

export function CategoryCard({ category, href }: CategoryCardProps) {
  return (
    <Link href={href ?? `/categories/${category.slug}`} className="group block h-full">
      <Card>
        <CardHeader>
          <CardTitle className="font-medium">{category.title}</CardTitle>
          <CardAction>
            <ChevronRight className="text-muted-foreground size-4" />
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}
