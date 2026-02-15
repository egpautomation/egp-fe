// @ts-nocheck

import { config } from "@/lib/config";
import { useEffect, useState } from "react";

export default function Statistics() {
  const [counts, setCounts] = useState({
    LTM: "00",
    OTM: "00",
    OSTETM: "00",
    total: "00",
    others:"00"
  });
  const today = new Intl.DateTimeFormat("bn-BD", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const toBanglaNumber = (number) => {
  const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return number.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
};

  const stats = [
    { value: "226", label: "LTM" },
    { value: "144", label: "OTM" },
    { value: "188", label: "OSTETM" },
    { value: "3982", label: "others" },
  ];
  

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/tenders/tender-method-counts`)
      .then((res) => res.json())
      .then((data) => {
        setCounts(data?.data);
      });
  }, []);
  console.log(counts)

  return (
    <div className="w-full">
      <div className="mx-auto py-10 lg:py-16">
        <div>
          <h2 className="text-center mb-8 text-gray-900">
            {`আজকের প্রকাশিত মোট টেন্ডার : ৪১৭০ টি || তারিখ: ${today}`}
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto gap-4 px-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200/70 bg-white/90 px-6 py-5 text-center shadow-lg backdrop-blur-sm"
            >
              <div className="text-3xl font-bold text-[#4874c7] lg:text-4xl">
                {toBanglaNumber(counts[item.label] || item.value)} 
              </div>
              <div className="mt-1 text-sm font-medium text-slate-600">
                {item.label} টেন্ডার 
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
