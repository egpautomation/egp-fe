"use client"

import { FiCheckCircle } from "react-icons/fi"
import { useCallback, useEffect, useRef } from "react"
import { servicesDetails } from "./servicesData"

type ServicesDetailsSectionProps = {
    activeServiceId: string | null
    onScrollActiveChange: (id: string | null) => void
}

export default function ServicesDetailsSection({ activeServiceId, onScrollActiveChange }: ServicesDetailsSectionProps) {
    const cardRefs = useRef<Map<string, HTMLElement | null>>(new Map())
    const observerRef = useRef<IntersectionObserver | null>(null)
    const onScrollActiveChangeRef = useRef(onScrollActiveChange)
    onScrollActiveChangeRef.current = onScrollActiveChange

    const setCardRef = useCallback((id: string, el: HTMLElement | null) => {
        if (el) cardRefs.current.set(id, el)
    }, [])

    useEffect(() => {
        const elements = Array.from(cardRefs.current.values()).filter(Boolean) as HTMLElement[]
        if (elements.length === 0) return

        observerRef.current = new IntersectionObserver(
            () => {
                const innerHeight = typeof window !== "undefined" ? window.innerHeight : 0
                let topVisibleId: string | null = null
                let minPositiveTop = Infinity
                let maxNegativeTop = -Infinity

                cardRefs.current.forEach((el, id) => {
                    if (!el) return
                    const rect = el.getBoundingClientRect()
                    const isVisible = rect.top < innerHeight && rect.bottom > 0
                    if (!isVisible) return
                    if (rect.top >= 0 && rect.top < minPositiveTop) {
                        minPositiveTop = rect.top
                        topVisibleId = id
                    } else if (rect.top < 0 && rect.top > maxNegativeTop && minPositiveTop === Infinity) {
                        maxNegativeTop = rect.top
                        topVisibleId = id
                    }
                })

                onScrollActiveChangeRef.current(topVisibleId)
            },
            { root: null, rootMargin: "-100px 0px -50% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
        )

        elements.forEach((el) => observerRef.current?.observe(el))
        return () => {
            elements.forEach((el) => observerRef.current?.unobserve(el))
            observerRef.current = null
        }
    }, [])

    return (
        <section className="w-full">
            <div className="mx-auto py-10 lg:py-16">
                <div className="max-w-3xl">
                    <h2 className="text-gray-900">সার্ভিসের বিস্তারিত</h2>
                    <p className="mt-2">
                        উপরের যেকোনো কার্ডে ক্লিক করলে নিচের সংশ্লিষ্ট সার্ভিস হাইলাইট হবে।
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {servicesDetails.map((service) => {
                        const isActive = activeServiceId === service.id

                        return (
                            <article
                                key={service.id}
                                ref={(el) => setCardRef(service.id, el)}
                                id={`service-detail-${service.id}`}
                                className={`scroll-mt-28 rounded-2xl border bg-white/90 p-6 transition-all duration-300 ${
                                    isActive
                                        ? "border-[#4874c7] shadow-xl shadow-[#4874c7]/20"
                                        : "border-slate-200/70 shadow-md"
                                }`}
                            >
                                <h3 className="text-gray-900">{service.title}</h3>
                                <ul className="mt-4 space-y-2">
                                    {service.points.map((point) => (
                                        <li key={point} className="flex items-start gap-3">
                                            <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                                <FiCheckCircle className="h-3.5 w-3.5" />
                                            </span>
                                            <p className="text-gray-700">{point}</p>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
