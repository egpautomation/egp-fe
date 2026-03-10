// @ts-nocheck

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

export default function Statistics() {
  const [liveCount, setLiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [methodCounts, setMethodCounts] = useState({
    LTM: 0,
    OTM: 0,
    OSTETM: 0,
    others: 0
  });

  const today = new Intl.DateTimeFormat("bn-BD", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const toBanglaNumber = (number) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return number.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/live-tenders/stats');
        if (res.data?.success) {
          const stats = res.data.data;
          setLiveCount(stats.total);
          setMethodCounts({
            LTM: stats.LTM,
            OTM: stats.OTM,
            OSTETM: stats.OSTETM,
            others: stats.others
          });
        }
      } catch (error) {
        console.error("Error fetching live tender stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { value: methodCounts.LTM, label: "LTM" },
    { value: methodCounts.OTM, label: "OTM" },
    { value: methodCounts.OSTETM, label: "OSTETM" },
    { value: methodCounts.others, label: "others" },
  ];

  return (
    <div className="w-full">
      <div className="mx-auto py-10 lg:py-16">
        <div>
          <h2 className="text-center mb-8 text-gray-900">
            {loading ? (
              "লোড হচ্ছে..."
            ) : (
              `আজকের প্রকাশিত মোট টেন্ডার : ${toBanglaNumber(liveCount)} টি || তারিখ: ${today}`
            )}
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto gap-4 px-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200/70 bg-white/90 px-6 py-5 text-center shadow-lg backdrop-blur-sm"
            >
              <div className="text-3xl font-bold text-[#4874c7] lg:text-4xl">
                {toBanglaNumber(item.value)}
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
