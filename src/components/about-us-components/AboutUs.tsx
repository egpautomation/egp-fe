"use client"

import AboutDifference from "./AboutDifference"
import AboutFounder from "./AboutFounder"
import AboutHero from "./AboutHero"
import AboutHowItWorks from "./AboutHowItWorks"
import AboutMission from "./AboutMission"
import AboutServices from "./AboutServices"
import AboutServicesTable from "./AboutServicesTable"
import AboutTeamValues from "./AboutTeamValues"

export default function AboutUs() {
    return (
        <div className="container h-full mx-auto lg:px-10 px-4">
            <AboutHero />
            <AboutMission />
            <AboutServices />
            <AboutFounder />
            <AboutTeamValues />
            <AboutDifference />
            <AboutHowItWorks />
            <AboutServicesTable />
        </div>
    )
}
