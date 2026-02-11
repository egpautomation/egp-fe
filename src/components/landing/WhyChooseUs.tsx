// @ts-nocheck

import { Check, Minus, X } from "lucide-react";

export default function WhyChooseUs() {
  const highlights = [
    {
      title: "নতুন টেন্ডার নোটিশ",
      description:
        "eGP হতে প্রকাশিত টেন্ডার নোটিস + টেন্ডার ডেটা শীট হতে সংগ্রহিত তথ্য + প্রাক্কলিত মূল্য একসাথে",
    },
    {
      title: "LTM, OTM টেন্ডার eGP ‍তে অটো সাবমিশন",
      description:
        "টেন্ডার I Agree করা হতে শুরু করে ফর্ম ফিল-আপ, টেডার ডকুমেন্ট ম্যাপিং, BOQ রেট সিন করা সহ Encript পর্যন্ত eGP তে অটো সাবমিশন (মোবাইল এপস এবং পিসি সফটওয়্যার) সার্ভিস",
    },
    {
      title: "অটো ডকুমেন্ট জেনারেশন",
      description:
        "টেন্ডার অনুযায়ী Autorized Latter, Code of condac, JV Aggrement এবং সকল ধরনের ট্রেমপ্লেট অনুসারে টেন্ডার অনুযায়ী প্রস্তাত",
    },
    {
      title: "রিয়েলটাইম নোটিফিকেশন",
      description: "WhatsApp, Email এর মাধ্যেমে আপনার পছেন্দের টেন্ডার তালিকা প্রেরণ",
    },
    {
      title: "টেন্ডার ম্যানেজমেন্ট",
      description:
        "আসন্ন টেন্ডারগুলো TO DO লিষ্ট করা, টেন্ডার প্রিপারেশন এর কাজ ম্যনেজমেন্ট, টেন্ডার সিকিউরিটির তথ্য ট্রেকিং, আগামী সম্পাহের টেন্ডার গুলোর তালিকা সুস্জ্জিত রিপোর্ট, সাবমিট করার টেন্ডার লটারির ফলাফল দেখা।",
    },
    {
      title: "টেন্ডার SLT Calculation",
      description:
        "টেন্ডার ড্রপিং করার পূর্বে SLT ক্যলকুলেশন করে নিজেকে যথা স্থানে রেইট কোট করার ব্যবস্থা",
    },
  ];

  const comparisonColumns = [
    { key: "us", label: "ইটেন্ডার বিডি", highlight: true },
    { key: "others", label: "অন্যান্য প্রতিযোগী" },
  ];

  const comparisonRows = [
    {
      feature: "নতুন টেন্ডার নোটিশ",
      values: {
        us: {
          status: "yes",
          text: "প্রতি কাজের Location Information, Publication, Last Selling, Opening Date, All Types Financial Criteria (Estimated Cost, Tender Security, Turnover Amount, Liquid Assets, Tender Capacity",
        },
        others: { status: "partial", text: "শুধু নোটিস বা সীমিত" },
      },
    },
    {
      feature: "অটোমেশন (ফর্ম ফিল-আপ, BOQ, ক্যাপাসিটি)",
      values: { us: { status: "yes", text: "আছে" }, others: { status: "partial", text: "নেই বা ম্যানুয়াল" } },
    },
    {
      feature: "অটো ডকুমেন্ট জেনারেশন",
      values: { us: { status: "yes", text: "আছে" }, others: { status: "no", text: "নেই" } },
    },
    {
      feature: "এন্ড-টু-এন্ড ওয়ার্কফ্লো",
      values: { us: { status: "yes", text: "আছে" }, others: { status: "partial", text: "নেই বা আংশিক" } },
    },
    {
      feature: "রিয়েলটাইম নোটিফিকেশন",
      values: { us: { status: "yes", text: "SMS + WhatsApp + Email" }, others: { status: "partial", text: "SMS/Email" } },
    },
    {
      feature: "লোকাল থেকে ন্যাশনাল কভারেজ",
      values: { us: { status: "yes", text: "লোকাল + ন্যাশনাল" }, others: { status: "partial", text: "সীমিত" } },
    },
    {
      feature: "ডিজিটাল ট্র্যাকিং/ড্যাশবোর্ড",
      values: { us: { status: "yes", text: "উন্নত" }, others: { status: "partial", text: "নেই বা বেসিক" } },
    },
    {
      feature: "AI বাংলা FAQ বট",
      values: { us: { status: "yes", text: "আছে" }, others: { status: "no", text: "নেই" } },
    },
    {
      feature: "মাসিক ফি",
      values: { us: { status: "yes", text: "৩০০–৫০০ টাকা" }, others: { status: "partial", text: "উচ্চ ফি" } },
    },
  ];

  const statusStyles = {
    yes: "bg-emerald-100 text-emerald-600",
    no: "bg-rose-100 text-rose-600",
    partial: "bg-amber-100 text-amber-700",
  };

  const statusIcons = { yes: Check, no: X, partial: Minus };

  return (
    <div className="w-full">
      <div className="mx-auto py-10 lg:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#4874c7]">
            কেন ই-টেন্ডার বিডি?
          </p>
          <h2 className="mt-2 text-gray-900">
            আপনার টেন্ডার পিপারেশনের স্মার্ট পার্টনার
          </h2>
          <p className="mt-3 text-base text-gray-600">
            নতুন টেন্ডার নোটিশ, টেন্ডার ডাটা শীট হতে তথ্য, প্রাক্কলিত মূল্য, টেন্ডারে অংশগ্রহনের যোগ্যতা যাচাই, SLT হিসাব করার ব্যবস্থা, অটো Turnover, Tender Capasity হিসাব করা ব্যবস্থা,RHD, PWD, LGED, WBD, EL BOQ রেইট খুজে বের করা, টেন্ডার অনুযায়ী Autorized Latter, Code of condac, JV Aggrement এবং সকল ধরনের ট্রেমপ্লেট অনুসারে টেন্ডার অনুযায়ী প্রস্তাত — সবকিছু এক প্ল্যাটফর্মে।
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <h3 className="text-2xl font-bold text-gray-900">কেন ই-টেন্ডার বিডি?</h3>
          <span className="rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-[#4874c7]">
            টেন্ডার সংক্রান্ত সকল কাজ এখন একই প্লাটফমে
          </span>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white shadow-xl overflow-x-auto">
          <div className="sm:hidden divide-y divide-slate-100">
            {comparisonRows.map((row) => (
              <div key={row.feature} className="p-4">
                <p className="text-sm font-semibold text-gray-900">{row.feature}</p>
                <div className="mt-3 space-y-2">
                  {comparisonColumns.map((col) => {
                    const value = row.values[col.key];
                    const Icon = statusIcons[value.status];
                    return (
                      <div
                        key={col.key}
                        className={`flex items-start justify-between gap-3 rounded-xl border border-slate-200/70 px-3 py-2 ${
                          col.highlight ? "bg-emerald-50/60" : "bg-white"
                        }`}
                      >
                        <span
                          className={`text-xs font-semibold ${
                            col.highlight ? "text-[#4874c7]" : "text-slate-600"
                          }`}
                        >
                          {col.label}
                        </span>
                        <div className="flex items-start gap-2 text-right">
                          <span
                            className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full ${statusStyles[value.status]}`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span
                            className={`text-sm ${
                              col.highlight ? "font-medium text-[#4874c7]" : "text-gray-600"
                            }`}
                          >
                            {value.text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="hidden sm:block min-w-[600px]">
            <table className="w-full text-sm">
              <thead className="bg-blue-50/70 text-slate-700">
                <tr>
                  <th className="w-[25%] px-4 py-4 text-left font-semibold">বৈশিষ্ট্য</th>
                  {comparisonColumns.map((col, index) => (
                    <th
                      key={col.key}
                      className={`${
                        index === 0 ? "w-[50%]" : "w-[25%]"
                      } px-4 py-4 text-left font-semibold ${
                        col.highlight ? "text-[#4874c7] bg-emerald-50/70" : "text-slate-700"
                      }`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="align-top">
                    <td className="w-[25%] px-4 py-4 text-gray-700">{row.feature}</td>
                    {comparisonColumns.map((col, index) => {
                      const value = row.values[col.key];
                      const Icon = statusIcons[value.status];
                      return (
                        <td
                          key={col.key}
                          className={`${
                            index === 0 ? "w-[50%]" : "w-[25%]"
                          } px-4 py-4 ${col.highlight ? "bg-emerald-50/70" : ""}`}
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className={`mt-0.5 inline-flex p-1 items-center justify-center rounded-full ${statusStyles[value.status]}`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <span
                              className={`text-sm ${
                                col.highlight ? "font-medium text-[#4874c7]" : "text-gray-600"
                              }`}
                            >
                              {value.text}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
