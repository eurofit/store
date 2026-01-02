'use client';

import { Button } from '@/components/ui/button';
import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import {
  Apple,
  ChevronRight,
  Droplet,
  Dumbbell,
  FlameIcon as Fire,
  Heart,
  Leaf,
  Pill,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Mail, MapPin, Phone, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';

type Category = {
  name: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
};

const categories: Category[] = [
  {
    name: 'Protein',
    Icon: Dumbbell,
    href: '#',
  },
  {
    name: 'Creatines',
    Icon: Fire,
    href: '#',
  },
  {
    name: 'Pre-Workout',
    Icon: Fire,
    href: '#',
  },
  {
    name: 'Amino Acids',
    Icon: Zap,
    href: '#',
  },
  {
    name: 'Vitamins',
    Icon: Apple,
    href: '#',
  },
  {
    name: 'Minerals',
    Icon: Pill,
    href: '#',
  },
  {
    name: 'Herbal',
    Icon: Leaf,
    href: '#',
  },
  {
    name: 'Facial Care',
    Icon: Sparkles,
    href: '#',
  },
  {
    name: 'Body Care',
    Icon: Heart,
    href: '#',
  },
  {
    name: 'Hydration',
    Icon: Droplet,
    href: '#',
  },
];

type CarouselApi = UseEmblaCarouselType[1];

export function CategoriesList() {
  const [emblaRef, api] = useEmblaCarousel({ loop: true }, [
    AutoScroll({ playOnInit: false }),
  ]);
  const [emblaApi, setApi] = useState<CarouselApi>(api);

  const handleMouseLeave = () => {
    const autoScroll = emblaApi?.plugins()?.autoScroll;

    if (!autoScroll) return;

    if (!autoScroll.isPlaying()) autoScroll.play();
  };

  return (
    <section className="space-y-4">
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
      <Carousel
        className="flex gap-x-4"
        opts={{ loop: true }}
        plugins={[AutoScroll({ stopOnMouseEnter: true })]}
        setApi={setApi}
      >
        <CarouselContent onMouseLeave={handleMouseLeave}>
          {categories.map((cat, ind) => (
            <CarouselItem key={`top-cat-${ind}`} className="basis-[14.25%]">
              <Category {...cat} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

function Category({ name, Icon, href }: Category) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col items-center space-y-4 rounded-md"
    >
      <div className="bg-muted group-hover:ring-primary rounde-md flex size-32 flex-col items-center justify-center rounded-md group-hover:ring">
        <Icon className="group-hover:text-primary size-10" />
      </div>
      <span className="font-medium">{name}</span>
    </Link>
  );
}

// ==================

const ProductCard = ({
  product,
  className = '',
}: {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    image: string;
    rating: number;
    reviews: number;
  };
  className?: string;
}) => (
  <Card
    className={`group border-0 shadow-sm transition-all duration-300 hover:shadow-lg ${className}`}
  >
    <CardContent className="p-0">
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          width={250}
          height={250}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.discount && (
          <Badge className="absolute top-2 left-2 bg-red-500 font-semibold text-white hover:bg-red-600">
            {product.discount}
          </Badge>
        )}
        <Button
          size="icon"
          className="absolute top-2 right-2 bg-white/90 text-gray-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-gray-800">
          {product.name}
        </h3>
        <div className="mb-2 flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            KSh {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              KSh {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProductSection = ({
  title,
  products,
  bgColor,
  textColor,
  buttonColor,
  viewAllColor,
}: {
  title: string;
  products: any[];
  bgColor: string;
  textColor: string;
  buttonColor: string;
  viewAllColor: string;
}) => (
  <section className={`py-8 ${bgColor}`}>
    <div className="container mx-auto px-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className={`font-montserrat text-2xl font-bold ${textColor}`}>{title}</h2>
        <Button
          variant="outline"
          className={`${viewAllColor} border-current hover:bg-current hover:text-white`}
        >
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
        <div className="flex min-w-max gap-4">
          {products.map((product) => (
            <div key={product.id} className="w-64 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export function Component() {
  const flashSaleProducts = [
    {
      id: 1,
      name: 'Optimum Nutrition Gold Standard 100% Whey Protein Powder',
      price: 7950,
      originalPrice: 9950,
      discount: '20% OFF',
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.8,
      reviews: 1247,
    },
    {
      id: 2,
      name: 'BCAA Energy Amino Acids with Natural Caffeine',
      price: 4200,
      originalPrice: 5250,
      discount: '20% OFF',
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.6,
      reviews: 892,
    },
    {
      id: 3,
      name: 'Creatine Monohydrate Powder 300g',
      price: 3150,
      originalPrice: 4200,
      discount: '25% OFF',
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.7,
      reviews: 654,
    },
    {
      id: 4,
      name: 'Mass Gainer Protein Powder Chocolate 2.5kg',
      price: 8400,
      originalPrice: 10500,
      discount: '20% OFF',
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.5,
      reviews: 423,
    },
    {
      id: 5,
      name: 'Pre-Workout Energy Booster Blue Raspberry',
      price: 5250,
      originalPrice: 6300,
      discount: '17% OFF',
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.4,
      reviews: 789,
    },
  ];

  const topPicksProducts = [
    {
      id: 6,
      name: 'Whey Isolate Protein Powder Vanilla 1kg',
      price: 9450,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.9,
      reviews: 1567,
    },
    {
      id: 7,
      name: 'Glutamine Recovery Powder 500g',
      price: 4725,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.6,
      reviews: 445,
    },
    {
      id: 8,
      name: 'Multivitamin for Athletes 90 Tablets',
      price: 3675,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.7,
      reviews: 892,
    },
    {
      id: 9,
      name: 'Fish Oil Omega-3 Softgels 120 Count',
      price: 2835,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.5,
      reviews: 634,
    },
    {
      id: 10,
      name: 'Casein Protein Powder Chocolate 1kg',
      price: 8925,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.8,
      reviews: 756,
    },
  ];

  const trendingProducts = [
    {
      id: 11,
      name: 'Plant-Based Protein Powder Vanilla 1kg',
      price: 7350,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.6,
      reviews: 523,
    },
    {
      id: 12,
      name: 'Collagen Peptides Powder Unflavored 500g',
      price: 5775,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.7,
      reviews: 789,
    },
    {
      id: 13,
      name: 'Testosterone Booster Natural 60 Caps',
      price: 4200,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.3,
      reviews: 345,
    },
    {
      id: 14,
      name: 'Fat Burner Thermogenic 90 Capsules',
      price: 4725,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.4,
      reviews: 612,
    },
    {
      id: 15,
      name: 'Electrolyte Hydration Powder Mixed Berry',
      price: 3150,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.5,
      reviews: 434,
    },
  ];

  const newArrivalsProducts = [
    {
      id: 16,
      name: 'Nitric Oxide Booster Pre-Workout 300g',
      price: 6300,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.6,
      reviews: 234,
    },
    {
      id: 17,
      name: 'Digestive Enzymes Complex 90 Capsules',
      price: 3675,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.5,
      reviews: 167,
    },
    {
      id: 18,
      name: 'Ashwagandha Root Extract 60 Capsules',
      price: 2835,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.7,
      reviews: 289,
    },
    {
      id: 19,
      name: 'Magnesium Glycinate 400mg 120 Tablets',
      price: 3150,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.6,
      reviews: 345,
    },
    {
      id: 20,
      name: 'Vitamin D3 + K2 Liquid Drops 30ml',
      price: 2520,
      image: '/placeholder.svg?height=250&width=250',
      rating: 4.8,
      reviews: 456,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <span className="text-xl font-bold text-white">E</span>
                </div>
                <div>
                  <h1 className="font-montserrat text-2xl font-bold text-gray-900">
                    Eurofit
                  </h1>
                  <p className="text-xs text-gray-600">Health & Beauty LTD</p>
                </div>
              </Link>
            </div>
            <div className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+254110990666</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@eurofit.uk</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h1 className="font-montserrat mb-4 text-4xl font-bold md:text-5xl">
                Kenya's Leading Supplier of Genuine European Fitness Products
              </h1>
              <p className="font-dm-sans mb-6 text-xl text-blue-100">
                Get authentic supplements, sports nutrition, and skincare products at
                competitive prices. Trusted by fitness enthusiasts across Kenya.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white bg-transparent text-white hover:bg-white hover:text-blue-600"
                >
                  Wholesale Inquiry
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Eurofit Products"
                width={500}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <ProductSection
        title="⚡ Flash Sale - Limited Time!"
        products={flashSaleProducts}
        bgColor="bg-red-50"
        textColor="text-red-800"
        buttonColor="bg-red-600"
        viewAllColor="text-red-600"
      />

      {/* Top Picks Section */}
      <ProductSection
        title="🏆 Top Picks - Customer Favorites"
        products={topPicksProducts}
        bgColor="bg-blue-50"
        textColor="text-blue-800"
        buttonColor="bg-blue-600"
        viewAllColor="text-blue-600"
      />

      {/* Trending Section */}
      <ProductSection
        title="🔥 Trending Now - What's Hot"
        products={trendingProducts}
        bgColor="bg-green-50"
        textColor="text-green-800"
        buttonColor="bg-green-600"
        viewAllColor="text-green-600"
      />

      {/* New Arrivals Section */}
      <ProductSection
        title="✨ New Arrivals - Fresh Stock"
        products={newArrivalsProducts}
        bgColor="bg-purple-50"
        textColor="text-purple-800"
        buttonColor="bg-purple-600"
        viewAllColor="text-purple-600"
      />

      {/* Trust Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-montserrat mb-4 text-3xl font-bold text-gray-900">
              Why Choose Eurofit?
            </h2>
            <p className="font-dm-sans mx-auto max-w-2xl text-gray-600">
              In a market flooded with fake products, we stand out by offering only
              genuine European fitness products
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-montserrat mb-2 text-xl font-semibold">
                100% Genuine Products
              </h3>
              <p className="font-dm-sans text-gray-600">
                All our products are sourced directly from European manufacturers
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-montserrat mb-2 text-xl font-semibold">
                Competitive Prices
              </h3>
              <p className="font-dm-sans text-gray-600">
                Best prices for both retail and wholesale customers
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-montserrat mb-2 text-xl font-semibold">
                Kenya-Wide Delivery
              </h3>
              <p className="font-dm-sans text-gray-600">
                Fast delivery across Kenya with offices in Nairobi and London
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <span className="font-bold text-white">E</span>
                </div>
                <span className="font-montserrat text-xl font-bold">Eurofit</span>
              </div>
              <p className="font-dm-sans mb-4 text-gray-400">
                Kenya's biggest and leading supplier of genuine European fitness products.
              </p>
            </div>
            <div>
              <h4 className="font-montserrat mb-4 font-semibold">Contact Info</h4>
              <div className="font-dm-sans space-y-2 text-gray-400">
                <p>📍 6th Street Tower, First Floor, Unit 111</p>
                <p>Eastleigh, Nairobi, Kenya</p>
                <p>📞 +254110990666</p>
                <p>✉️ info@eurofit.uk</p>
              </div>
            </div>
            <div>
              <h4 className="font-montserrat mb-4 font-semibold">Follow Us</h4>
              <div className="font-dm-sans space-y-2 text-gray-400">
                <p>🌐 www.eurofit.co.ke</p>
                <p>📱 TikTok: @eurofitltd</p>
                <p>📸 Instagram: @eurofitltd</p>
                <p>👥 Facebook: @eurofitltd</p>
              </div>
            </div>
            <div>
              <h4 className="font-montserrat mb-4 font-semibold">Business Hours</h4>
              <div className="font-dm-sans space-y-2 text-gray-400">
                <p>Monday - Friday: 8AM - 6PM</p>
                <p>Saturday: 9AM - 5PM</p>
                <p>Sunday: 10AM - 4PM</p>
                <p className="mt-4 text-blue-400">Wholesale inquiries welcome!</p>
              </div>
            </div>
          </div>
          <div className="font-dm-sans mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Eurofit Health & Beauty LTD. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
