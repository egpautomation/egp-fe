"use client"

import { FiUser } from "react-icons/fi"

export default function AboutFounder() {
    return (
        <section className="w-full">
            <div className="mx-auto py-10 lg:py-16">
                <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#4874c7]/10 text-[#4874c7]">
                            <FiUser className="h-6 w-6" />
                        </span>
                        <div>
                            <h2 className="text-gray-900">আমরা কারা</h2>
                            <p className="mt-2">
                                আসসালামু আলাইকুম। আমি জুবায়ের আহমেদ, চাঁদপুরের
                                বাসিন্দা। ২০১৬ সাল থেকে সরকারি e-GP সিস্টেমে কাজ করছি।
                                স্থানীয় ঠিকাদারদের টেন্ডার ডকুমেন্টেশন, কোটেশন, BOQ
                                বিশ্লেষণ ও LTM অটোমেশন সার্ভিস দিয়ে আসছি।
                            </p>
                            <p className="mt-3">
                                বর্তমান প্ল্যাটফর্মগুলোতে অটোমেশনের অভাব দেখে
                                ETenderBD তৈরি করেছি—যাতে ঠিকাদাররা শুধু তথ্য পান না,
                                পুরো প্রক্রিয়া অটোমেটেডভাবে সম্পন্ন করতে পারেন।
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
