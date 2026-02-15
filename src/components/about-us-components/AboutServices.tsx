"use client"

import { FiCheckCircle } from "react-icons/fi"

export default function AboutServices() {
    const services = [
        "টেন্ডার রেজিস্ট্রেশন সাপোর্ট (PWD, LGED, RHD ইত্যাদি)",
        "e-GP টেন্ডার সাবমিশন (LTM, OTM – অটো ড্রপ)",
        "রেট কোটেশন ও BOQ প্রিপারেশন (অটো SLC ক্যালকুলেশন)",
        "SMS / WhatsApp / Email নোটিফিকেশন",
        "ডকুমেন্ট অটোমেশন (অথরাইজ লেটার, ব্যাঙ্ক সলভেন্সি ইত্যাদি)",
        "টেন্ডার কনসালটেন্সি ও AI FAQ বট (বাংলা ভয়েস সাপোর্ট)",
        "ভেন্ডর এনরোলমেন্ট (প্রাইভেট টেন্ডার)",
        "সাশ্রয়ী সাবস্ক্রিপশন: মাসিক ৩০০–৫০০ টাকা (bKash, Nagad পেমেন্ট)",
    ]

    return (
        <section className="w-full">
            <div className="mx-auto py-10 lg:py-16">
                <div className="max-w-3xl">
                    <h2 className="text-gray-900">আমাদের প্রধান সার্ভিসসমূহ</h2>
                    <p className="mt-2">
                        সবকিছু এক জায়গায় — তথ্য, অটোমেশন, ডকুমেন্ট ও নোটিফিকেশন।
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {services.map((service) => (
                        <div
                            key={service}
                            className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-white/90 p-4 shadow-md"
                        >
                            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <FiCheckCircle className="h-4 w-4" />
                            </span>
                            <p className="text-sm text-gray-700">{service}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
