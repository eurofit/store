import { Award, HelpingHand, ShieldCheck, Truck } from 'lucide-react';

export function Features() {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <hgroup className="mx-auto flex flex-col items-center gap-4 text-center md:max-w-3xl">
          <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            Why Choose Us
          </span>
          <h2 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Trusted by Businesses Across Kenya for Fitness, Health, and Wellness
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            We go beyond selling products — we build lasting partnerships. With authentic
            goods, reliable supply, and expert support, we help your business grow
            stronger every day.
          </p>
        </hgroup>

        {/* Features */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Feature 1 */}
          <div className="flex flex-col items-center gap-4 text-center">
            <ShieldCheck className="text-primary h-12 w-12" />
            <h3 className="text-xl font-semibold">Genuine Products</h3>
            <p className="text-muted-foreground text-sm">
              Only real, high-quality fitness, supplement, and skincare products — no
              compromises.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center gap-4 text-center">
            <Truck className="text-primary h-12 w-12" />
            <h3 className="text-xl font-semibold">Fast, Reliable Delivery</h3>
            <p className="text-muted-foreground text-sm">
              Get your products delivered quickly and safely across Kenya with our trusted
              logistics.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center gap-4 text-center">
            <Award className="text-primary h-12 w-12" />
            <h3 className="text-xl font-semibold">Top Industry Expertise</h3>
            <p className="text-muted-foreground text-sm">
              Work with a team that knows the fitness and wellness industry inside out.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center gap-4 text-center">
            <HelpingHand className="text-primary size-10" />
            <h3 className="text-xl font-semibold">Support That Cares</h3>
            <p className="text-muted-foreground text-sm">
              We’re here to support you before and after the sale — your success is our
              goal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
