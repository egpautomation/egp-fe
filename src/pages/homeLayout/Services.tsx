"use client"

// import ServicesCatalog from "@/components/services-components/ServicesCatalog"
// import ServicesCTA from "@/components/services-components/ServicesCTA"
// import ServicesDetailsSection from "../../components/services-components/ServicesDetailsSection"
// import ServicesExtra from "@/components/services-components/ServicesExtra"
import ServicesHero from "@/components/services-components/ServicesHero"
import ServicesMainList from "@/components/services-components/ServicesMainList"
import SeoMeta from "@/components/seo/SeoMeta"
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
      <SeoMeta
        title="Services | E-GP Tender Automation"
        description="Explore all E-GP tender automation services including tender notice analysis, STL tools, and submission support for contractors in Bangladesh."
        canonicalPath="/services"
      />

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
