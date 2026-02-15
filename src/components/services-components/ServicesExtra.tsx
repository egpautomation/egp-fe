"use client"

import { FiBarChart2, FiBell, FiClock, FiTrendingUp } from "react-icons/fi"

export default function ServicesExtra() {
    const extras = [
        {
            title: "Power BI রিপোর্টিং",
            description: "ডাটা শিট বিশ্লেষণ ও ভিজ্যুয়াল রিপোর্ট।",
            icon: FiBarChart2,
        },
        {
            title: "ব্যাংকিং রিমাইন্ডার",
            description: "টেন্ডার ড্রপিংয়ের জন্য ব্যাংকিং কার্যক্রমের শেষ সময় মনে করিয়ে দেওয়া।",
            icon: FiClock,
        },
        {
            title: "লটারি ফলাফল আপডেট",
            description: "সিকিউরিটি লটারি ফলাফল ও স্ট্যাটাস অবগত করা।",
            icon: FiBell,
        },
        {
            title: "আর্থিক অগ্রগতি ধারণা",
            description: "লোনে জমা ও ব্যাংক লোন অগ্রগতির স্বচ্ছ ধারণা।",
            icon: FiTrendingUp,
        },
    ]

    return (
        <section className="w-full">
            <div className="mx-auto py-10 lg:py-16">
                <div className="max-w-3xl">
                    <h2 className="text-gray-900">অতিরিক্ত সুবিধা</h2>
                    <p className="mt-2">
                        ডাটা বিশ্লেষণ ও স্মার্ট রিমাইন্ডার দিয়ে টেন্ডার ম্যানেজমেন্টকে আরও সহজ করি।
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {extras.map((item) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-md"
                            >
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#4874c7]/10 text-[#4874c7]">
                                    <Icon className="h-4 w-4" />
                                </span>
                                <h4 className="mt-3 text-gray-900">
                                    {item.title}
                                </h4>
                                <p className="mt-1 text-sm text-gray-600">
                                    {item.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
