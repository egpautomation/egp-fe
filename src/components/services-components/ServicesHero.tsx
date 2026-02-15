"use client"

import { FiBell, FiCreditCard, FiZap } from "react-icons/fi"

export default function ServicesHero() {
    const highlights = [
        {
            title: "অটো ড্রপ",
            description: "LTM, OTM, OSTEM, RFQ টেন্ডার সাবমিশন",
            icon: FiZap,
        },
        {
            title: "রিয়েলটাইম নোটিফিকেশন",
            description: "SMS, WhatsApp, Email আপডেট",
            icon: FiBell,
        },
        {
            title: "সাশ্রয়ী সাবস্ক্রিপশন",
            description: "মাসিক ৩০০–৫০০ টাকা, bKash/Nagad পেমেন্ট",
            icon: FiCreditCard,
        },
    ]

    return (
        <section className="w-full">
            <div className="mx-auto py-10 lg:py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#4874c7] animate-fade-in">
                        সেবা সমূহ
                    </p>
                    <h2 className="mt-2 text-gray-900 animate-slide-up">
                        আপনার টেন্ডার প্রক্রিয়ার জন্য সম্পূর্ণ অটোমেটেড সল্যুশন
                    </h2>
                    <p className="mt-3 animate-slide-up" style={{ animationDelay: "100ms" }}>
                        ই-টেন্ডার বিডি ঠিকাদারদের জন্য দ্রুত, নির্ভুল এবং কম খরচে
                        টেন্ডার ম্যানেজমেন্ট সেবা প্রদান করে।
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
