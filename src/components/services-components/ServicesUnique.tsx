"use client"

export default function ServicesUnique() {
    const uniqueServices = [
        { number: "১", text: "ইজিপি একাউন্ট ওপেন" },
        { number: "২", text: "ইজিপি ট্রেনিং" },
        { number: "৩", text: "LTM, OTM, OSTETM, RFQ সহ ম্যানুয়াল টেন্ডার সাবমিশন" },
        { number: "৪", text: "টেন্ডারার ডাটাবেজ পূরণ" },
        { number: "৫", text: "LGED, PWD, EED, RHD, ABC, FOOD, BWDB, BSCIC সহ তালিকাভুক্তি লাইসেন্স" },
        { number: "৬", text: "নতুন ট্রেড লাইসেন্স, ভ্যাট/BIN, টিন সার্টিফিকেট/TIN রেজিস্ট্রেশন" },
        { number: "৭", text: "লিমিটেড/পার্টনারশিপ কোম্পানি নিবন্ধন" },
        { number: "৮", text: "IRC/আই আর সি, ERC/ই আর সি" },
        { number: "৯", text: "বিভিন্ন অ্যাসোসিয়েশনের মেম্বারশিপ" },
        { number: "১০", text: "উদ্যোক্তা প্রশিক্ষণ" },
        { number: "১১", text: "কোম্পানি প্রোফাইল/বিজনেস প্রোফাইল তৈরি" },
    ]

    return (
        <section className="w-full">
            <div className="mx-auto py-10 lg:py-16">
                <div className="text-center">
                    <h2 className="text-gray-900">আমাদের অনন্য সেবা সমূহ</h2>
                    <p className="mt-2">
                        অতিরিক্ত সহায়তা ও রেজিস্ট্রেশন-সংক্রান্ত সার্ভিসগুলোও আমরা দিয়ে থাকি।
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {uniqueServices.map((service) => (
                        <div
                            key={service.number}
                            className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-md"
                        >
                            <div className="flex items-start gap-3">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#4874c7]/10 text-[#4874c7] font-semibold">
                                    {service.number}
                                </span>
                                <p className="text-sm text-gray-700">{service.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
