"use client"

import AboutUsComponent from "@/components/about-us-components/AboutUs"
import SeoMeta from "@/components/seo/SeoMeta"

export default function AboutUs() {
  return (
    <>
      <SeoMeta
        title="About Us | E-GP Tender Automation"
        description="Learn about E-TenderBD and how our team helps contractors with eGP tender analysis, automation workflows, and compliant submission support."
        canonicalPath="/about-us"
      />
      <AboutUsComponent />
    </>
  )
}
