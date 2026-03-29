"use client";

import AboutDifference from "./AboutDifference";
import AboutFounder from "./AboutFounder";
import AboutHero from "./AboutHero";
import AboutHowItWorks from "./AboutHowItWorks";
import AboutMission from "./AboutMission";
import AboutTeamValues from "./AboutTeamValues";

export default function AboutUs() {
  return (
    <div className="container h-full mx-auto lg:px-10 px-4">
      <AboutHero />
      <AboutMission />
      <AboutFounder />
      <AboutTeamValues />
      <AboutDifference />
      <AboutHowItWorks />
    </div>
  );
}
