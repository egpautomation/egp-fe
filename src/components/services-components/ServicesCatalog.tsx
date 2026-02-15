"use client"

export default function ServicesCatalog() {
    const services = [
        {
            title: "টেন্ডার রেজিস্ট্রেশন সাপোর্ট",
            description: "PWD, LGED, RHD ইত্যাদি দপ্তরের রেজিস্ট্রেশন সহায়তা",
        },
        {
            title: "টেন্ডার সাবমিশন (e-GP ড্রপ)",
            description: "LTM, OTM টেন্ডার সাবমিশন (অনলাইন)",
        },
        {
            title: "টেন্ডার রেট কোটেশন সাপোর্ট",
            description: "রেট বিশ্লেষণ করে দর তৈরি",
        },
        {
            title: "টেন্ডার নোটিফিকেশন",
            description: "SMS, WhatsApp, Email-এ নোটিফিকেশন",
        },
        {
            title: "BOQ প্রিপারেশন",
            description: "বিল অফ কোয়ান্টিটি তৈরি ও যাচাই",
        },
        {
            title: "ডকুমেন্ট অটোমেশন",
            description: "Microsoft অটোমেশন দিয়ে LTM টেন্ডার প্রসেস",
        },
        {
            title: "টেন্ডার কনসালটেন্সি",
            description: "প্রক্রিয়া বুঝিয়ে পরামর্শ",
        },
        {
            title: "ভেন্ডর এনরোলমেন্ট",
            description: "প্রাইভেট কোম্পানির জন্য রেজিস্ট্রেশন",
        },
    ]

    return (
        <section className="w-full">
            <div className="mx-auto py-10 lg:py-16">
                <div className="text-center">
                    <h2 className="text-gray-900">সার্ভিস ক্যাটালগ</h2>
                    <p className="mt-2">
                        আপনার প্রয়োজন অনুযায়ী সার্ভিস সিলেক্ট করুন।
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-md"
                        >
                            <h4 className="text-gray-900">
                                {service.title}
                            </h4>
                            <p className="mt-2 text-sm text-gray-600">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
