import Container from "@/components/common/container";
import { FeaturesSectionDemo } from "@/components/features-section-demo";
import HeroSection from "@/components/layouts/hero";

import { MarqueeDemo } from "@/components/ui/marquee-demo";
import PricingCards from "@/components/ui/pricing-component";
import { Stats } from "@/components/ui/stats-section";

const page = () => {
  return (
    <Container className="relative overflow-hidden">
      <div className="bg-primary/15 dark:bg-primary/10 absolute top-0 right-1/16 bottom-60 h-60 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"></div>
      <div className="py-20 md:py-40">
        <HeroSection />
        <Stats />
        <section className="py-20 pb-10 text-center">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-6 text-2xl font-bold md:text-4xl">
              A Better <span>Way to Edit Images Online</span>
            </h2>
            <p className="m-auto mb-8 max-w-lg text-xl text-neutral-500 md:text-lg dark:text-neutral-400">
              Edit and improve images quickly with easy-to-use tools that
              deliver clean, reliable results online.
            </p>
          </div>
        </section>
        <FeaturesSectionDemo />
        <section className="py-20 pb-10 text-center">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-6 text-2xl font-bold md:text-4xl">
              A Better <span>Way to Edit Images Online</span>
            </h2>
            <p className="m-auto mb-8 max-w-lg text-xl text-neutral-500 md:text-lg dark:text-neutral-400">
              Edit and improve images quickly with easy-to-use tools that
              deliver clean, reliable results online.
            </p>
          </div>
        </section>

        <PricingCards />
        <section className="py-20 pb-10 text-center">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-6 text-2xl font-bold md:text-4xl">
              A Better <span>Way to Edit Images Online</span>
            </h2>
            <p className="m-auto mb-8 max-w-lg text-xl text-neutral-500 md:text-lg dark:text-neutral-400">
              Edit and improve images quickly with easy-to-use tools that
              deliver clean, reliable results online.
            </p>
          </div>
        </section>
        <MarqueeDemo />
      </div>
    </Container>
  );
};

export default page;
