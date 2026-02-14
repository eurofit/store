import { Category } from '@/types';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from './ui/card';

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="group block h-full">
      <Card>
        <CardHeader>
          <CardTitle className="font-medium">{category.title}</CardTitle>
          <CardAction>
            <ChevronRight className="text-muted-foreground size-4" />
          </CardAction>
          {category.description && (
            <CardDescription>{category.description}</CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
