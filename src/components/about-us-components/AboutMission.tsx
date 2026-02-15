"use client"

import { FiGlobe, FiTrendingUp } from "react-icons/fi"

export default function AboutMission() {
    const items = [
        {
            title: "আমাদের লক্ষ্য",
            description:
                "টেন্ডার প্রিপারেশনের সময় ও ভুল ৯৫% কমিয়ে ঠিকাদারদের আরও বেশি টেন্ডার জিততে সাহায্য করা।",
            icon: FiTrendingUp,
        },
        {
            title: "আমাদের পরিধি",
            description:
                "চাঁদপুর থেকে শুরু করে সারা বাংলাদেশে আমরা ঠিকাদারদের পাশে আছি।",
            icon: FiGlobe,
        },
    ]

    return (
        <section className="w-full">
            <div className="mx-auto py-10 lg:py-16">
                <div className="grid gap-6 lg:grid-cols-2">
                    {items.map((item) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-lg backdrop-blur-sm"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#4874c7]/10 text-[#4874c7]">
                                        <Icon className="h-6 w-6" />
                                    </span>
                                    <div>
                                        <h2 className="text-gray-900">{item.title}</h2>
                                        <p className="mt-2">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
