"use client"

import { FiMapPin, FiSmartphone, FiTarget } from "react-icons/fi"

export default function AboutHero() {
    const highlights = [
        {
            title: "৯৫% সময় সাশ্রয়",
            description: "টেন্ডার প্রিপারেশন দ্রুত ও নির্ভুলভাবে সম্পন্ন হয়",
            icon: FiTarget,
        },
        {
            title: "সারা বাংলাদেশে সেবা",
            description: "চাঁদপুর থেকে শুরু করে ন্যাশনাল কভারেজ",
            icon: FiMapPin,
        },
        {
            title: "ওয়েব + মোবাইল প্ল্যাটফর্ম",
            description: "এক প্ল্যাটফর্মেই সব টেন্ডার ম্যানেজমেন্ট",
            icon: FiSmartphone,
        },
    ]

    return (
        <section className="w-full">
            <div className="mx-auto py-10 lg:py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#4874c7] animate-fade-in">
                        ই-টেন্ডার বিডি
                    </p>
                    <h2 className="mt-2 text-gray-900 animate-slide-up">আমাদের সম্পর্কে</h2>
                    <p className="mt-3 animate-slide-up" style={{ animationDelay: "100ms" }}>
                        ETenderBD হলো বাংলাদেশের ঠিকাদারদের জন্য একটি সম্পূর্ণ
                        অটোমেটেড ওয়েব ও মোবাইল অ্যাপ-ভিত্তিক প্ল্যাটফর্ম। আমরা সরকারি
                        ই-টেন্ডার (e-GP) প্রক্রিয়াকে সহজ, দ্রুত এবং নির্ভুল করে দিই।
                    </p>
                    <p className="mt-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
                        রেজিস্ট্রেশন থেকে সাবমিশন পর্যন্ত সবকিছু এক জায়গায় — যেন
                        ঠিকাদাররা তথ্য নয়, পুরো প্রক্রিয়া অটোমেটেডভাবে সম্পন্ন করতে পারেন।
                    </p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {highlights.map((item) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-lg backdrop-blur-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#4874c7]/10 text-[#4874c7]">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <h4 className="text-gray-900">
                                            {item.title}
                                        </h4>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {item.description}
                                        </p>
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
