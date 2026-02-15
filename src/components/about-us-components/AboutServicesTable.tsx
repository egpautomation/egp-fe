"use client"

export default function AboutServicesTable() {
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
                    <h2 className="text-gray-900">সার্ভিসসমূহ</h2>
                    <p className="mt-2">
                        প্রতিটি সার্ভিসের সংক্ষিপ্ত বর্ণনা নিচে দেওয়া হলো।
                    </p>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white shadow-lg">
                    <div className="sm:hidden divide-y divide-slate-100">
                        {services.map((service) => (
                            <div key={service.title} className="p-4">
                                <h4 className="text-gray-900">
                                    {service.title}
                                </h4>
                                <p className="mt-2 text-sm text-gray-600">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="hidden sm:block">
                        <table className="w-full text-sm">
                            <thead className="bg-blue-50/70 text-slate-700">
                                <tr>
                                    <th className="px-4 py-4 text-left font-semibold">সার্ভিস</th>
                                    <th className="px-4 py-4 text-left font-semibold">বর্ণনা</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {services.map((service) => (
                                    <tr key={service.title}>
                                        <td className="px-4 py-4 text-gray-700">
                                            {service.title}
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">
                                            {service.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}
