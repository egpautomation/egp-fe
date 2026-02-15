"use client"

import { FiCheckCircle, FiXCircle } from "react-icons/fi"

export default function AboutDifference() {
    const weaknesses = [
        "শুধু টেন্ডার তথ্য বা নোটিস প্রদান, পূর্ণ ডেটা নেই",
        "অটোমেশন নেই, সবকিছু ম্যানুয়াল",
        "BOQ বা রেট অ্যানালাইসিস সীমিত বা ম্যানুয়াল",
        "অল-ইন-ওয়ান সল্যুশন নেই, আলাদা সার্ভিস নিতে হয়",
        "শুধু SMS/Email অ্যালার্ট, ডকুমেন্ট সাপোর্ট নেই",
        "লোকাল (জেলা-লেভেল) সাপোর্ট নেই, ঢাকা-কেন্দ্রিক",
        "ডিজিটাল ট্র্যাকিং বা AI বট নেই",
    ]

    const strengths = [
        "সম্পূর্ণ টেন্ডার তথ্য: নোটিস + ডেটা শীট + অ্যাটাচমেন্ট",
        "অটোমেশন: ফর্ম ফিল-আপ, BOQ রেট অ্যানালাইসিস, ক্যাপাসিটি হিসাব",
        "অটো ডকুমেন্ট জেনারেশন: অথরাইজ লেটার, ব্যাংক ক্রেডিট লেটার",
        "এন্ড-টু-এন্ড সল্যুশন: রেজিস্ট্রেশন → কোটেশন → সাবমিশন → নোটিফিকেশন",
        "রিয়েলটাইম নোটিফিকেশন: SMS, WhatsApp, Email",
        "লোকাল থেকে ন্যাশনাল লেভেল কভারেজ",
        "কন্ট্রাক্টর ড্যাশবোর্ড: হিস্ট্রি, রিপোর্ট, উইনিং ইনসাইটস",
        "AI FAQ বট: বাংলা ভয়েস সাপোর্ট",
        "সাশ্রয়ী ফি: মাসিক ৩০০–৫০০ টাকা",
    ]

    return (
        <section className="w-full">
            <div className="mx-auto py-10 lg:py-16">
                <div className="text-center">
                    <h2 className="text-gray-900">কেন আমরা আলাদা?</h2>
                    <p className="mt-2">
                        প্রতিযোগীদের সীমাবদ্ধতা বুঝে আমরা দিয়েছি পূর্ণ অটোমেশন ও
                        এন্ড-টু-এন্ড সমাধান।
                    </p>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                        <h4 className="text-gray-900">
                            সাধারণ দুর্বলতা (অন্য প্ল্যাটফর্মে দেখা যায়)
                        </h4>
                        <ul className="mt-4 grid gap-3">
                            {weaknesses.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                                        <FiXCircle className="h-4 w-4" />
                                    </span>
                                    <p className="text-sm text-gray-600">{item}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                        <h4 className="text-gray-900">
                            ETenderBD-এর শক্তি
                        </h4>
                        <ul className="mt-4 grid gap-3">
                            {strengths.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                        <FiCheckCircle className="h-4 w-4" />
                                    </span>
                                    <p className="text-sm text-gray-700">{item}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
