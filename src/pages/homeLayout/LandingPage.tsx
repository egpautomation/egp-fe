// @ts-nocheck
// EGP-style landing page for "/" – Hero, Statistics, WhyChooseUs, HelpDesk, MobileApps.

import Hero from "@/components/landing/Hero";
import Statistics from "@/components/landing/Statistics";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import HelpDesk from "@/components/landing/HelpDesk";
import MobileApps from "@/components/landing/MobileApps";

export default function LandingPage() {
  return (
    <div>
      <div className="container h-full mx-auto lg:px-10 px-4">
        <Hero />
        <Statistics />
        <WhyChooseUs />
        <HelpDesk />
        <MobileApps />
      </div>
    </div>
  );
}
