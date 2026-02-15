"use client"

import { FiArrowDownRight } from "react-icons/fi"
import { servicesDetails } from "./servicesData"

type ServicesMainListProps = {
    activeServiceId: string | null
    onSelectService: (serviceId: string) => void
}

export default function ServicesMainList({ activeServiceId, onSelectService }: ServicesMainListProps) {
    return (
        <section className="w-full">
            <div className="mx-auto py-10 lg:py-16">
                <div className="max-w-3xl">
                    <h2 className="text-gray-900">আপনার জন্য সার্ভিস ক্যাটেগরি</h2>
                    <p className="mt-2">
                        যে কার্ডে ক্লিক করবেন, নিচে সেই সার্ভিসের বিস্তারিত লিস্ট দেখাবে।
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {servicesDetails.map((service) => {
                        const isActive = activeServiceId === service.id

                        return (
                            <button
                                key={service.id}
                                type="button"
                                onClick={() => onSelectService(service.id)}
                                className={`rounded-2xl border bg-white/90 p-4 text-left transition-all duration-300 ${
                                    isActive
                                        ? "border-[#4874c7] shadow-lg shadow-[#4874c7]/20"
                                        : "border-slate-200/70 shadow-md hover:border-[#4874c7]/40 hover:shadow-lg"
                                }`}
                                aria-label={`${service.title} এর বিস্তারিত দেখুন`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <h4 className="text-gray-900">{service.title}</h4>
                                    <span
                                        className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                                            isActive
                                                ? "bg-[#4874c7]/15 text-[#4874c7]"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        <FiArrowDownRight className="h-4 w-4" />
                                    </span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
