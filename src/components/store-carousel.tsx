"use client"

import { Carousel } from "@/components/ui/carousel"
import { useToggle } from "@/hooks/use-toggle"
import { useIdle } from "react-use"

const slides = [
  {
    id: 1,
    title: "Gold Standard 100% Whey ",
    subtitle: "Best deals online on Sports nutrition",
    discount: "UP to 80% OFF",
    price: {
      current: 49.99,
      original: 89.99,
    },
    rating: 4.8,
    reviews: 2456,
    image: "/supplements.png",
    badge: "BESTSELLER",
    color: "bg-gradient-to-r from-amber-50 to-amber-100",
  },
  {
    id: 2,
    title: "Combat Protein Powder",
    subtitle: "Premium muscle building formula",
    discount: "SAVE 65% TODAY",
    price: {
      current: 39.99,
      original: 79.99,
    },
    rating: 4.6,
    reviews: 1872,
    image: "/supplements.png", // Using the same image as placeholder
    badge: "NEW ARRIVAL",
    color: "bg-gradient-to-r from-blue-50 to-blue-100",
  },
  {
    id: 3,
    title: "Serious Mass Gainer",
    subtitle: "Maximum calorie formula for mass",
    discount: "SPECIAL OFFER 70% OFF",
    price: {
      current: 54.99,
      original: 99.99,
    },
    rating: 4.7,
    reviews: 1345,
    image: "/supplements.png",
    badge: "TRENDING",
    color: "bg-gradient-to-r from-green-50 to-green-100",
  },
]

type StoreCarouselProps = React.ComponentProps<typeof Carousel>

export function StoreCarousel({ className }: StoreCarouselProps) {
  const isIdle = useIdle()
  const { value: isActive, toggle, setOn, setOff } = useToggle(!isIdle)

  return <div></div>
}

/* 


  <Carousel
        className={cn('h-80 w-full shadow-sm select-none', className)}
        opts={{
          active: isActive,
          loop: true,
        }}
        plugins={[
          AutoPlay({
            delay: 3000,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem
              key={`store carousel slide - ${index}`}
              className="bg-muted flex h-80 flex-col items-center justify-center"
            >
              <div
                key={slide.id}
                className={cn(
                  'relative w-full transition-opacity duration-500 ease-in-out',
                )}
              >
                {/* Background gradient 
                <div className={cn('absolute inset-0', slide.color)} />
                {/* Content container 
                <div className="relative flex size-full flex-col md:flex-row">
                  {/* Text content 
                  <div className="flex h-full flex-1 flex-col justify-center px-8 py-12 md:px-16">
                    {/* Badge 
                    <Badge className="mb-4 w-fit bg-black text-white">
                      {slide.badge === 'BESTSELLER' && <Award className="mr-1 h-3 w-3" />}
                      {slide.badge === 'TRENDING' && (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      )}
                      {slide.badge}
                    </Badge>
                    {/* Subtitle 
                    <p className="text-muted-foreground mb-2">{slide.subtitle}</p>
                    {/* Title 
                    <h2 className="mb-4 text-3xl font-bold">{slide.title}</h2>
                    {/* Discount 
                    <div className="text-primary mb-4 inline-block rounded-md font-bold">
                      {slide.discount}
                    </div>
                    {/* Price 
                    <div className="mb-6 flex items-center gap-2">
                      <span className="text-3xl font-bold">${slide.price.current}</span>
                      <span className="text-muted-foreground text-xl line-through">
                        ${slide.price.original}
                      </span>
                    </div>
                    {/* Rating  
                    {/* <div className="mb-8 flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'size-5',
                              i < Math.floor(slide.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-muted text-muted',
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{slide.rating}</span>
                      <span className="text-muted-foreground">
                        ({slide.reviews} reviews)
                      </span>
                    </div> 
                    {/* CTA Buttons 
                    <div
                      className="flex flex-wrap gap-4"
                      onMouseEnter={setOff}
                      onMouseLeave={setOn}
                    >
                      <Button size="lg" className="font-medium">
                        Shop Now
                      </Button>
                      <Button size="lg" variant="outline" className="font-medium">
                        View Details
                      </Button>
                    </div>
                  </div>
                  {/* Product image 
                  <div className="flex flex-1 items-center justify-center p-8">
                    <div className="relative h-[300px] w-[300px] transition-transform duration-500 hover:scale-105 md:h-[400px] md:w-[400px]">
                      <Image
                        alt={slide.title}
                        src={slide.image || '/placeholder.svg'}
                        fill
                        sizes="(max-width: 640px) 300px, 400px"
                        className="object-contain drop-shadow-xl"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
        <CarouselDots />
      </Carousel>

*/
