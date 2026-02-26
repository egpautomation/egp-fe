"use client"

// import ServicesCatalog from "@/components/services-components/ServicesCatalog"
// import ServicesCTA from "@/components/services-components/ServicesCTA"
// import ServicesDetailsSection from "../../components/services-components/ServicesDetailsSection"
// import ServicesExtra from "@/components/services-components/ServicesExtra"
import ServicesHero from "@/components/services-components/ServicesHero"
import ServicesMainList from "@/components/services-components/ServicesMainList"
import { Helmet } from "react-helmet-async"
// import { useEffect, useRef, useState } from "react"

// const HIGHLIGHT_DELAY_AFTER_CLICK_MS = 400
// const HIGHLIGHT_DELAY_AFTER_SCROLL_MS = 180
// const SCROLL_END_DEBOUNCE_MS = 140

export default function Services() {
  // const [activeServiceId, setActiveServiceId] = useState<string | null>(null)
  // const [isActivationEnabled, setIsActivationEnabled] = useState(false)
  // const clickFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // const scrollDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // const scrollEndRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // const pendingClickIdRef = useRef<string | null>(null)
  // const isProgrammaticScrollRef = useRef(false)
  // const programmaticScrollHappenedRef = useRef(false)

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (!isProgrammaticScrollRef.current) {
  //       setIsActivationEnabled(true)
  //     }

  //     if (isProgrammaticScrollRef.current) {
  //       programmaticScrollHappenedRef.current = true
  //       if (scrollEndRef.current) clearTimeout(scrollEndRef.current)
  //       scrollEndRef.current = setTimeout(() => {
  //         if (pendingClickIdRef.current) {
  //           setActiveServiceId(pendingClickIdRef.current)
  //           pendingClickIdRef.current = null
  //         }
  //         isProgrammaticScrollRef.current = false
  //         programmaticScrollHappenedRef.current = false
  //         if (clickFallbackRef.current) {
  //           clearTimeout(clickFallbackRef.current)
  //           clickFallbackRef.current = null
  //         }
  //       }, SCROLL_END_DEBOUNCE_MS)
  //     }
  //   }

  //   window.addEventListener("scroll", handleScroll, { passive: true })
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll)
  //     if (clickFallbackRef.current) clearTimeout(clickFallbackRef.current)
  //     if (scrollDelayRef.current) clearTimeout(scrollDelayRef.current)
  //     if (scrollEndRef.current) clearTimeout(scrollEndRef.current)
  //   }
  // }, [])

  // const handleSelectService = (serviceId: string) => {
  //   setIsActivationEnabled(true)
  //   if (clickFallbackRef.current) clearTimeout(clickFallbackRef.current)
  //   if (scrollDelayRef.current) clearTimeout(scrollDelayRef.current)
  //   if (scrollEndRef.current) clearTimeout(scrollEndRef.current)

  //   const detailCard = document.getElementById(`service-detail-${serviceId}`)
  //   if (detailCard) {
  //     isProgrammaticScrollRef.current = true
  //     programmaticScrollHappenedRef.current = false
  //     pendingClickIdRef.current = serviceId
  //     detailCard.scrollIntoView({ behavior: "smooth", block: "start" })
  //   }

  //   clickFallbackRef.current = setTimeout(() => {
  //     if (isProgrammaticScrollRef.current && programmaticScrollHappenedRef.current) {
  //       clickFallbackRef.current = null
  //       return
  //     }
  //     setActiveServiceId(serviceId)
  //     pendingClickIdRef.current = null
  //     isProgrammaticScrollRef.current = false
  //     programmaticScrollHappenedRef.current = false
  //     clickFallbackRef.current = null
  //   }, HIGHLIGHT_DELAY_AFTER_CLICK_MS)
  // }

  // const handleScrollActiveChange = (id: string | null) => {
  //   if (!isActivationEnabled) return
  //   if (pendingClickIdRef.current || isProgrammaticScrollRef.current) return
  //   if (scrollDelayRef.current) clearTimeout(scrollDelayRef.current)

  //   scrollDelayRef.current = setTimeout(() => {
  //     setActiveServiceId(id)
  //     scrollDelayRef.current = null
  //   }, HIGHLIGHT_DELAY_AFTER_SCROLL_MS)
  // }

  return (
    <>
      <Helmet>
        <title>Our Tender Services | Daily Tender Updates & Subscription BD</title>
        <meta 
          name="description" 
          content="Daily Bangladesh tender updates including RHD, LGED, PWD, BWDB, ministry tenders, procurement alerts, STL calculation support and contract award updates." 
        />
        <meta 
          name="keywords" 
          content="daily tender updates bd, tender alerts Bangladesh, tender subscription bd, public procurement bd, Bangladesh tender opportunities, RHD daily tender, LGED tender alert, PWD tender subscription, BWDB tender notice, ministry procurement bd, eGP support service, STL calculation support, tender analysis bd, contract award notice bd, tender result bd, lowest bidder calculation, construction tender bd, supply tender Bangladesh, government bids bd, e tender consultancy bd, contractor support service, supplier support bd, BOQ analysis bd, tender tracking service, সরকারি টেন্ডার সার্ভিস" 
        />
        <link rel="canonical" href="https://etenderbd.com/services" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Tender Services Bangladesh" />
        <meta 
          property="og:description" 
          content="Daily Bangladesh government tender alerts and procurement updates." 
        />
        <meta property="og:url" content="https://etenderbd.com/services" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="eTenderBD" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tender Services Bangladesh" />
        <meta 
          name="twitter:description" 
          content="Daily Bangladesh government tender alerts and procurement updates." 
        />
      </Helmet>

      <div className="container h-full mx-auto lg:px-10 px-4">
        <ServicesHero />
        <ServicesMainList  />
        {/* <ServicesExtra /> */}
        {/* <ServicesDetailsSection activeServiceId={activeServiceId} onScrollActiveChange={handleScrollActiveChange} /> */}
        {/* <ServicesUnique /> */}
        {/* <ServicesCatalog /> */}
        {/* <ServicesCTA /> */}
      </div>
    </>
  )
}
