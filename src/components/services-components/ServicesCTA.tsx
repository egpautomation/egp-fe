"use client";

import { FiArrowRight } from "react-icons/fi";

export default function ServicesCTA() {
  return (
    <section className="w-full">
      <div className="mx-auto py-10 lg:py-16">
        <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-r from-[#4874c7] to-[#3a5da8] p-8 text-white shadow-xl">
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-white">ই-জিপি সকল কাজ করা হয়</h2>
            <p className="text-white/90">
              আপনার প্রয়োজন অনুযায়ী সার্ভিস নিন এবং টেন্ডার প্রক্রিয়াকে সম্পূর্ণ অটোমেটেড করুন।
            </p>
            <div className="flex items-center justify-center gap-2 text-sm font-semibold">
              শুরু করতে যোগাযোগ করুন <FiArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
