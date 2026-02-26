"use client"

import AboutUsComponent from "@/components/about-us-components/AboutUs"
import { Helmet } from "react-helmet-async"

export default function AboutUs() {
  return (
    <>
      <Helmet>
        <title>About e Tender BD | Bangladesh Government Procurement Portal</title>
        <meta 
          name="description" 
          content="e Tender BD provides updated Bangladesh government tenders including RHD, LGED, PWD, BWDB, ministry procurement notices and eGP portal updates." 
        />
        <meta 
          name="keywords" 
          content="Bangladesh government tenders, government procurement Bangladesh, Bangladesh e tender portal, CPTU tenders, public procurement bd, RHD tender bd, LGED tender bd, PWD tender bd, BWDB tender bd, ministry tender Bangladesh, procurement information bd, contractor portal bd, supplier portal bd, eGP information bd, tender news bd, contract award bd, Bangladesh construction tender, infrastructure tender bd, online procurement bd, e tender platform Bangladesh, সরকারি ক্রয় পোর্টাল" 
        />
        <link rel="canonical" href="https://etenderbd.com/about" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="About e Tender BD" />
        <meta 
          property="og:description" 
          content="Trusted Bangladesh government tender information platform." 
        />
        <meta property="og:url" content="https://etenderbd.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="eTenderBD" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About e Tender BD" />
        <meta 
          name="twitter:description" 
          content="Trusted Bangladesh government tender information platform." 
        />
      </Helmet>
      <AboutUsComponent />
    </>
  )
}
