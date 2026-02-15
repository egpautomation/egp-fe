"use client"

export default function AboutHowItWorks() {
    const steps = [
        "অ্যাকাউন্ট খুলুন → সাবস্ক্রাইব করুন",
        "ক্যাটাগরি সিলেক্ট করুন",
        "নোটিফিকেশন পান → সম্পূর্ণ ডেটা দেখুন",
        "BOQ/রেট অটো ক্যালকুলেট করুন",
        "অটো ডকুমেন্ট জেনারেট → এক ক্লিকে সাবমিট",
        "ড্যাশবোর্ডে ট্র্যাক করুন",
    ]

    return (
        <section className="w-full">
            <div className="mx-auto py-10 lg:py-16">
                <div className="text-center">
                    <h2 className="text-gray-900">কীভাবে ETenderBD ব্যবহার করবেন?</h2>
                    <p className="mt-2">
                        কয়েকটি সহজ ধাপে পুরো টেন্ডার প্রক্রিয়া শেষ করুন।
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {steps.map((step, index) => (
                        <div
                            key={step}
                            className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-md"
                        >
                            <div className="flex items-start gap-3">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#4874c7]/10 text-[#4874c7] font-semibold">
                                    {index + 1}
                                </span>
                                <p className="text-sm text-gray-700">{step}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
