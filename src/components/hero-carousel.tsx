"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/utils/cn"
import AutoPlay from "embla-carousel-autoplay"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"

interface SlideProps {
  image?: string
  title: string
  description: string
  cta: {
    text: string
    href: string
  }
  secondaryCta?: {
    text: string
    href: string
  }
  align?: "left" | "center" | "right"
}

const slides: SlideProps[] = [
  {
    image: "/supplements.png",
    title: "Trusted Wholesaler Partner for Fitness & Wellness",
    description:
      "Work with a wholesaler you can trust. We supply real fitness, supplement, and skincare products across Kenya.",
    cta: {
      text: "Start Buying Wholesale",
      href: "/wholesale",
    },
    secondaryCta: {
      text: "Talk to Sales",
      href: "/contact",
    },
    align: "left",
  },
  {
    image: "/placeholder.svg?height=600&width=1200",
    title: "Authentic European Products at the Best Prices",
    description:
      "No fakes, no risks. Only 100% real fitness and health products ready for your shop or gym.",
    cta: {
      text: "See Products",
      href: "/products",
    },
    secondaryCta: {
      text: "Why Choose Us",
      href: "/about",
    },
    align: "center",
  },
  {
    image: "/placeholder.svg?height=600&width=1200",
    title: "Launch Your Brand with Confidence",
    description:
      "Want to start your own supplements or skincare business? We have the products and support to help you grow.",
    cta: {
      text: "Grow Your Business",
      href: "/wholesale",
    },
    secondaryCta: {
      text: "Learn How We Help",
      href: "/services",
    },
    align: "right",
  },
  {
    title: "Retail Shopping Made Easy",
    description:
      "Looking for the best in fitness and skincare? Shop authentic products online and get fast delivery across Kenya.",
    cta: {
      text: "Shop Retail",
      href: "/shop",
    },
    secondaryCta: {
      text: "Where to Buy",
      href: "/stores",
    },
    align: "left",
  },
  {
    image: "/placeholder.svg?height=600&width=1200",
    title: "Supplying Gyms, Shops, and Businesses Across Kenya",
    description:
      "We proudly supply fitness stores, gyms, and clinics with the best European health and fitness brands.",
    cta: {
      text: "Supply Your Business",
      href: "/wholesale",
    },
    secondaryCta: {
      text: "Contact Wholesale Team",
      href: "/contact",
    },
    align: "center",
  },
]

export function HeroCarousel() {
  return (
    <Carousel
      className="h-[calc(100vh-4rem)] w-full"
      opts={{
        loop: true,
      }}
      plugins={[AutoPlay()]}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem
            key={index}
            className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center"
          >
            <div
              key={index}
              className="relative flex w-full items-center justify-between p-6 md:p-12 lg:p-24"
            >
              <div
                className={cn("flex flex-1 flex-col justify-center", {
                  "items-center text-center": slide.align === "center",
                  "items-end text-right": slide.align === "right",
                })}
              >
                <hgroup className="select-none">
                  <h1 className="mb-4 max-w-xl text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
                    {slide.title}
                  </h1>
                  <p className="mb-6 max-w-lg text-base md:text-lg">
                    {slide.description}
                  </p>
                </hgroup>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/80"
                    asChild
                  >
                    <Link href={slide.cta.href}>{slide.cta.text}</Link>
                  </Button>
                  {slide.secondaryCta && (
                    <Button size="lg" variant="outline" asChild>
                      <Link href={slide.secondaryCta.href}>
                        {slide.secondaryCta.text}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {slide.align == "left" && slide.image && (
                <Image
                  alt="Supplements"
                  loading="eager"
                  priority={true}
                  height={800}
                  width={450}
                  src={slide.image}
                  sizes="(max-width: 640px) 70vw, 450px"
                  draggable={false}
                  className="rounded object-fill"
                />
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselDots /> */}
    </Carousel>
  )
}
