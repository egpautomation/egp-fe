"use client"

import { FiCpu, FiHeart, FiMapPin, FiShield, FiUsers, FiZap } from "react-icons/fi"

export default function AboutTeamValues() {
    const teamItems = [
        {
            title: "এক্সপার্ট টিম",
            description: "টেক এক্সপার্ট, প্রকিউরমেন্ট স্পেশালিস্ট ও কাস্টমার সাপোর্ট টিম।",
            icon: FiUsers,
        },
        {
            title: "টেক সক্ষমতা",
            description: "Automate সফটওয়্যার, PDF OCR ও WhatsApp API ব্যবহার।",
            icon: FiCpu,
        },
        {
            title: "লোকাল ফোকাস",
            description: "জেলা-ভিত্তিক ঠিকাদারদের প্রাধান্য দিয়ে সেবা।",
            icon: FiMapPin,
        },
    ]

    const values = [
        { title: "ইনোভেশন", icon: FiZap },
        { title: "অ্যাক্সেসিবিলিটি", icon: FiHeart },
        { title: "নির্ভরযোগ্যতা", icon: FiShield },
        { title: "কমিউনিটি ফোকাস", icon: FiUsers },
    ]

    return (
        <section className="w-full">
            <div className="mx-auto py-10 lg:py-16">
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                        <h2 className="text-gray-900">আমাদের টিম</h2>
                        <div className="mt-4 grid gap-4">
                            {teamItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <div key={item.title} className="flex items-start gap-3">
                                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#4874c7]/10 text-[#4874c7]">
                                            <Icon className="h-4 w-4" />
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
                                )
                            })}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                        <h2 className="text-gray-900">আমাদের মূল্যবোধ</h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {values.map((value) => {
                                const Icon = value.icon
                                return (
                                    <div
                                        key={value.title}
                                        className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm"
                                    >
                                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <h4 className="mt-3 text-gray-900">
                                            {value.title}
                                        </h4>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
