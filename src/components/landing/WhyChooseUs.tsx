// @ts-nocheck

import { Check, Minus, X } from "lucide-react";
import { Button } from "../ui/button";
import { FiHelpCircle } from "react-icons/fi";
import { FaBell } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function WhyChooseUs() {
  const highlights = [
    {
      title: "নতুন টেন্ডার নোটিশ",
      description:
        "eGP থেকে প্রাপ্ত নতুন টেন্ডার  + TDS থেকে সংগৃহীত ফাইন্যান্সিয়াল ক্রাইটেরিয়া  +  প্রাক্কলিত মূল্য একসাথে",
      blogLink: "/blogs#egp-tender-guide",
    },
    {
      title: "টেন্ডার SLT Calculation",
      description:
        "টেন্ডার সাবমিশনের পূর্বে নির্ভুল SLT ক্যালকুলেশনের মাধ্যমে আত্মবিশ্বাসের সাথে সঠিক ও প্রতিযোগিতামূলক রেট কোট করার সুবিধা।",
      blogLink: "/blogs#slt-calculation",
    },
    {
      title: "LTM, OTM টেন্ডার eGP ‍তে অটো সাবমিশন",
      description:
        "টেন্ডার I Agree করা হতে শুরু করে ফর্ম ফিল-আপ, টেডার ডকুমেন্ট ম্যাপিং, BOQ রেট সিন করা সহ Encript পর্যন্ত eGP তে অটো সাবমিশন (মোবাইল এপস এবং পিসি সফটওয়্যার) সার্ভিস",
      blogLink: "/blogs#tender-auto-sumission-in-egp",
    },
    {
      title: "অটো ডকুমেন্ট জেনারেশন",
      description:
        "টেন্ডারের চাহিদা অনুযায়ী সকল ধরনের অফিসিয়াল টেমপ্লেট (Authorized Letter, Code of Conduct, JV Agreement ইত্যাদি) স্বয়ংক্রিয়ভাবে তৈরি করুন।",
      blogLink: "/blogs#auto-document-generation",
    },
   
    {
      title: "টেন্ডার ম্যানেজমেন্ট",
      description:
        "আসন্ন টেন্ডারগুলো TO DO লিষ্ট করা, টেন্ডার প্রিপারেশন এর কাজ ম্যনেজমেন্ট, টেন্ডার সিকিউরিটির তথ্য ট্রেকিং, আগামী সম্পাহের টেন্ডার গুলোর তালিকা সুস্জ্জিত রিপোর্ট, সাবমিট করার টেন্ডার লটারির ফলাফল দেখা।",
      blogLink: "/blogs#tender-management",
    },
     {
      title: "রিয়েলটাইম নোটিফিকেশন",
      description: "WhatsApp, Email এর মাধ্যেমে আপনার পছেন্দের টেন্ডার তালিকা প্রেরণ",
      blogLink: "/blogs#realtime-notification",
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
          text: "শুধু পত্রিকার কাটিং নয়, সাথে সকল ফাইনান্সিয়াল ক্রাইটেরিয়া",
        },
        others: { status: "partial", text: "শুধুমাত্র পত্রিকার নিউজ কাটিং" },
      },
    },
    {
      feature: "এলটিএম ও ওটিএম টেন্ডার ফিলাপ",
      values: { us: { status: "yes", text: "মোবাইল অ্যাপস, ল্যাপটপ, অ্যান্ড্রয়েড ও আইওএস-এ অটোমেটিক টেন্ডার ড্রপিং" },
       others: { status: "partial", text: "ম্যানুয়াল ফর্ম ওপেন করে ফিলাপ, সময়সাপেক্ষ" } },
    },
    {
      feature: "লিমিটেশন",
      values: { us: { status: "yes", text: "অটোমেশন সফটওয়্যারে ১০০+ টেন্ডার একসাথে কমান্ড, বিভিন্ন টেন্ডার আইডি ও কোম্পানির নাম একসাথে" }, others: { status: "partial", text: "একবারে শুধু একটি টেন্ডার নিয়ে কাজ" } },
    },
    {
      feature: "অটো ডকুমেন্ট জেনারেশন",
      values: { us: { status: "yes", text: "অটোমেটিকভাবে টেন্ডার ডকুমেন্ট তৈরি ও ডাউনলোড" }, others: { status: "no", text: "এই সুবিধা নেই" } },
    },
    {
      feature: "Tender management",
      values: { us: { status: "yes", text: "আসন্ন টেন্ডার লিস্ট, টু-ডু লিস্ট, সিকিউরিটি ট্র্যাকিং" }, others: { status: "no", text: "নেই" } },
    },
    {
      feature: "SLT ক্যালকুলেশন",
      values: { us: { status: "yes", text: "পিডিএফ এক্সট্র্যাক্ট করে অটোমেটিক ক্যালকুলেশন" }, others: { status: "partial", text: "ম্যানুয়ালি রেট বসাতে হয়" } },
    },
    {
      feature: "টার্নওভার ও ক্যাপাসিটি ক্যালকুলেশন",
      values: { us: { status: "yes", text: "অটোমেটিক জেনারেট ও ডাউনলোড" }, others: { status: "no", text: "নেই" } },
    },
    {
      feature: "টেন্ডার রেজিস্ট্রেশন সাপোর্ট",
      values: { us: { status: "yes", text: "সকল ডিপার্টমেন্টে সাপোর্ট" }, others: { status: "yes", text: "প্রতিযোগীরাও করে" } },
    },
    {
      feature: "কোম্পানি প্রোফাইল তৈরি",
      values: { us: { status: "yes", text: "প্রত্যেক বিজনেসের প্রোফাইল তৈরি" }, others: { status: "yes", text: "প্রতিযোগীরাও দেয়" } },
    },
    {
      feature: "টেন্ডার সিকিউরিটি হিসাব",
      values: { us: { status: "yes", text: "ওয়েবসাইটে ট্র্যাকিং ও সামারি" }, others: { status: "no", text: "অন্য কোথাও নেই" } },
    },
    {
      feature: "ব্যাংকিং রিমাইন্ডার",
      values: { us: { status: "yes", text: "টেন্ডার ড্রপিংয়ের শেষ সময়ের ২ দিন আগে রিমাইন্ডার" }, others: { status: "no", text: "অন্য কোথাও নেই" } },
    },
    {
      feature: "লটারি ফলাফল আপডেট",
      values: { us: { status: "yes", text: "টেন্ডার লটারি ফলাফল আপডেট" }, others: { status: "no", text: "নেই" } },
    },
    {
      feature: "ইজিপি অ্যাকাউন্ট তৈরি",
      values: { us: { status: "yes", text: "সহায়তা করে" }, others: { status: "yes", text: "প্রতিযোগীরাও করে" } },
    },
    {
      feature: "ইজিপি ট্রেনিং",
      values: { us: { status: "yes", text: "ট্রেনিং প্রদান করে" }, others: { status: "yes", text: "প্রতিযোগীরাও করে" } },
    },
    {
      feature: "নতুন ট্রেড, টিন, ভ্যাট সার্ভিস",
      values: { us: { status: "yes", text: "সার্ভিস প্রদান করে" }, others: { status: "yes", text: "প্রতিযোগীরাও করে" } },
    },
  ];

  const statusStyles = {
    yes: "bg-emerald-100 text-emerald-600",
    no: "bg-rose-100 text-rose-600",
    partial: "bg-amber-100 text-amber-700",
  };

  const statusIcons = { yes: Check, no: X, partial: Minus };

  return (
    <div className="w-full ">
      <div className="mx-auto py-10 lg:py-16">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#4874c7] ">
            কেন ই-টেন্ডার বিডি?
          </p>
          <h2 className="mt-2 text-gray-900">
            আপনার টেন্ডার পিপারেশনের স্মার্ট পার্টনার
          </h2>
          <p className="mt-3 text-base text-gray-600">
            শুধু প্রত্রিকার নোটিশ নয়, আরও পাচ্ছেন TDS থেকে সকল ধরনের ফাইন্যান্সিয়াল ক্রাইটেরিয়া (প্রাক্কলিত মূল্য, টেন্ডার সিকিউরিটি, টার্নওভার, লিকুইড অ্যাসেট ক্যাপাসিটি)। রেজিস্ট্রেশন ছাড়া Tender Opening Report (TOR2) পিডিএফ আপলোড করে SLT হিসাব করার ব্যবস্থা। যেকোনো দপ্তর (RHD, PWD, LGED, WBD, ELECTRICAL)-এর BOQ স্বয়ংক্রিয়ভাবে বের করার ব্যবস্থা । টেন্ডার অনুযায়ী সকল ধরনের টেমপ্লেট (Authorization Letter, Code of Conduct, Manufacturing Letter, Production Capacity, JV Agreement) স্বয়ংক্রিয়ভাবে তৈরি করা যায়। <span className="inline-block font-semibold">সবকিছুর নির্ভরযোগ্য একমাত্র প্ল্যাটফর্ম।</span>
           
          </p>
        </div>
         <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto  lg:gap-8">
          
          {highlights.map((card) => (
            <div className="bg-[url(/egp_logo.png)] bg-no-repeat  h-full"  key={card.title}>
              <div
             
              className="bg-gray-100/90 flex flex-col  justify-between backdrop-blur-md rounded-2xl p-6 shadow-lg border border-slate-200/70 hover:shadow-2xl transition-all duration-300 bg-no-repeat bg-contain h-full"
            >

              <div className=" items-start gap-4">
              <div className="bg-[#3a5da8] p-2 rounded-full h-max w-max">
                 <FaBell  className="h-5 w-5  rounded-full text-white" />
              </div>
                <div className="flex-1 min-w-0 mt-8">
                  <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                  <p className="text-base text-slate-600 mt-1">{card.description}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link to={card.blogLink}>
                  <Button
                    type="button"
                    className="h-10 rounded-full px-6 text-white bg-[#4874c7] hover:bg-[#3a5da8] hover:text-base transition-all duration-200"
                  >
                    বিস্তারিত
                  </Button>
                </Link>
              </div>
            </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div> */}

        <div className="mt-20 flex flex-col items-center gap-3 text-center ">
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
