"use client";

import React from "react";
import {
  Bell,
  Settings,
  BarChart3,
  FileCheck,
  GraduationCap,
  ChevronDown,
  Info,
  Zap,
  LayoutDashboard,
  ClipboardList,
  UserPlus,
  Box,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FiCheckCircle } from "react-icons/fi";

const servicesData = [
  {
    category: "নতুন টেন্ডার বিজ্ঞপ্তি নোটিফিকেশন",
    icon: <Bell className="w-5 h-5" />,
    color: "bg-blue-600",
    services: [
      {
        name: "নতুন টেন্ডার নোটিশ",
        description:
          "eGP থেকে প্রকাশিত টেন্ডার নোটিস, টেন্ডার ডেটা শীট থেকে সংগৃহিত তথ্য এবং প্রাক্কলিত মূল্য একসাথে প্রদান, যার মধ্যে কাজের লোকেশন, প্রকাশনা তারিখ, লাস্ট সেলিং, ওপেনিং ডেট, অল টাইপস ফাইনান্সিয়াল ক্রাইটেরিয়া (এস্টিমেটেড কস্ট, টেন্ডার সিকিউরিটি, টার্নওভার অ্যামাউন্ট, লিকুইড অ্যাসেটস, টেন্ডার ক্যাপাসিটি) অন্তর্ভুক্ত।",
      },
      {
        name: "রিয়েলটাইম নোটিফিকেশন",
        description:
          "WhatsApp, Email, SMS-এর মাধ্যমে পছন্দের টেন্ডার তালিকা প্রেরণ, যার মধ্যে রিয়েলটাইম আপডেট এবং টেন্ডার সংক্রান্ত নোটিফিকেশন অন্তর্ভুক্ত।",
      },
    ],
  },
  {
    category: "টেন্ডার সাবমিশন ও অটোমেশন",
    icon: <Zap className="w-5 h-5" />,
    color: "bg-amber-600",
    services: [
      {
        name: "LTM, OTM টেন্ডার eGP-তে অটো সাবমিশন",
        description:
          "টেন্ডার Agree থেকে শুরু করে ফর্ম ফিল-আপ, টেন্ডার ডকুমেন্ট ম্যাপিং, BOQ রেট সাইনিং সহ এনক্রিপ্ট পর্যন্ত eGP-তে অটো সাবমিশন সুবিধা, মোবাইল অ্যাপস এবং পিসি সফটওয়্যারের মাধ্যমে।",
      },
      {
        name: "e-GP টেন্ডার সাবমিশন (অটো ড্রপ)",
        description:
          "LTM, OTM, OSTEM, RFQ, OSTETM টেন্ডারের অটো ড্রপ সুবিধা, যার মধ্যে অনলাইন সাবমিশন এবং ম্যানুয়াল টেন্ডার সাবমিশন অন্তর্ভুক্ত।",
      },
      {
        name: "অটো ডকুমেন্ট জেনারেশন",
        description:
          "টেন্ডার অনুযায়ী অথরাইজড লেটার, কোড অফ কন্ডাক্ট, JV অ্যাগ্রিমেন্ট এবং সকল ধরনের টেমপ্লেট অনুসারে প্রস্তুতি, যার মধ্যে অথরাইজ লেটার, ব্যাংক ক্রেডিট লেটার, ব্যাংক সলভেন্সি ইত্যাদি অটোমেটেডভাবে তৈরি।",
      },
      {
        name: "টেন্ডার ডকুমেন্ট প্রস্তুতি",
        description:
          "অটোমেটিক ফর্ম ফিল-আপ এবং ডকুমেন্ট জেনারেশন, BOQ প্রস্তুতি, ক্যাপাসিটি হিসাব এবং সব ধরনের টেন্ডার ডকুমেন্ট এক ক্লিকে তৈরি।",
      },
    ],
  },
  {
    category: "রেট, BOQ ও ক্যালকুলেশন",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "bg-emerald-600",
    services: [
      {
        name: "রেট কোটেশন ও BOQ প্রিপারেশন",
        description:
          "রেট বিশ্লেষণ করে দর তৈরি, BOQ প্রিপারেশন এবং যাচাই, অটো রেট অ্যানালাইসিস সহ ১০% রেট মিলানো।",
      },
      {
        name: "টেন্ডার SLT ক্যালকুলেশন",
        description:
          "টেন্ডার ড্রপিংয়ের পূর্বে SLT ক্যালকুলেশন করে যথাস্থানে রেট কোট করার ব্যবস্থা, অটো SLC ক্যালকুলেশন সহ।",
      },
      {
        name: "অটো টার্নওভার এবং টেন্ডার ক্যাপাসিটি হিসাব",
        description:
          "অটোমেটেডভাবে টার্নওভার এবং টেন্ডার ক্যাপাসিটি হিসাব করার সুবিধা, যা টেন্ডারে অংশগ্রহণের যোগ্যতা যাচাইয়ে সাহায্য করে।",
      },
      {
        name: "RHD, PWD, LGED, WBD, EL BOQ রেট খুঁজে বের করা",
        description:
          "বিভিন্ন ডিপার্টমেন্ট (RHD, PWD, LGED, WBD, EL) থেকে BOQ রেট খুঁজে বের করার সুবিধা, যা টেন্ডার প্রিপারেশনে ব্যবহার হয়।",
      },
      {
        name: "টেন্ডার কোটেশন তৈরি করুন",
        description: "আমাদের টুল নিয়ে সহজেই আপনার টেন্ডার কোটেশন তৈরি ও পরিচালনা করুন।",
      },
    ],
  },
  {
    category: "টেন্ডার ম্যানেজমেন্ট ও ট্র্যাকিং",
    icon: <LayoutDashboard className="w-5 h-5" />,
    color: "bg-indigo-600",
    services: [
      {
        name: "টেন্ডার ম্যানেজমেন্ট",
        description:
          "আসন্ন টেন্ডারগুলো TO DO লিস্ট করা, টেন্ডার প্রিপারেশনের কাজ ম্যানেজমেন্ট, টেন্ডার সিকিউরিটির তথ্য ট্রেকিং, আগামী সপ্তাহের টেন্ডারগুলোর তালিকা সুসজ্জিত রিপোর্ট।",
      },
      {
        name: "কন্ট্রাক্টর ড্যাশবোর্ড",
        description:
          "টেন্ডার হিস্ট্রি, রেট অ্যানালাইসিস রিপোর্ট, উইনিং ইনসাইটস সহ ড্যাশবোর্ড, যা লোকাল থেকে ন্যাশনাল লেভেল কভারেজ প্রদান করে।",
      },
      {
        name: "টেন্ডার সিকিউরিটি হিসাব ও সাপ্তাহিক রিপোর্ট",
        description: "টেন্ডার সিকিউরিটি হিসাব, সাপ্তাহিক রিপোর্ট এবং SMS নোটিফিকেশন সহ।",
      },
      {
        name: "ব্যাংকিং রিমাইন্ডার",
        description: "টেন্ডার ড্রপিংয়ের জন্য ব্যাংকিং কার্যক্রমের শেষ সময় মনে করিয়ে দেওয়া।",
      },
      { name: "লটারি ফলাফল আপডেট", description: "সিকিউরিটি লটারি ফলাফল ও স্ট্যাটাস অবগত করা।" },
      {
        name: "আর্থিক অগ্রগতি ধারণা",
        description: "লোন জমা ও ব্যাংক লোন অগ্রগতির স্বচ্ছ ধারণা প্রদান।",
      },
      {
        name: "NOA অ্যাকসেপ্টিং ও টাইম এক্সটেনশন",
        description: "NOA অ্যাকসেপ্টিং এবং টাইম এক্সটেনশন সংক্রান্ত সহায়তা।",
      },
      {
        name: "ফাইল আপডেট ও সার্টিফিকেট e-experience-এ যুক্ত করা",
        description: "ফাইল আপডেট এবং সার্টিফিকেট e-experience-এ যুক্ত করার সুবিধা।",
      },
    ],
  },
  {
    category: "রেজিস্ট্রেশন ও লাইসেন্স সাপোর্ট",
    icon: <FileCheck className="w-5 h-5" />,
    color: "bg-rose-600",
    services: [
      {
        name: "টেন্ডার রেজিস্ট্রেশন সাপোর্ট",
        description:
          "PWD, LGED, RHD, EED, ABC, FOOD, BWDB, BSCIC ইত্যাদি দপ্তরের রেজিস্ট্রেশন সহায়তা।",
      },
      { name: "ইজিপি একাউন্ট ওপেন", description: "ইজিপি একাউন্ট খোলার সহায়তা।" },
      {
        name: "ভেন্ডর এনরোলমেন্ট",
        description: "প্রাইভেট কোম্পানির জন্য রেজিস্ট্রেশন এবং ভেন্ডর এনরোলমেন্ট সুবিধা।",
      },
      {
        name: "নতুন ট্রেড লাইসেন্স, ভ্যাট/BIN, টিন সার্টিফিকেট/TIN রেজিস্ট্রেশন",
        description: "নতুন ট্রেড লাইসেন্স, ভ্যাট/BIN, টিন সার্টিফিকেট/TIN রেজিস্ট্রেশন সহায়তা।",
      },
      {
        name: "লিমিটেড/পার্টনারশিপ কোম্পানি নিবন্ধন",
        description: "লিমিটেড বা পার্টনারশিপ কোম্পানি নিবন্ধন সহায়তা।",
      },
      { name: "IRC/আই আর সি, ERC/ই আর সি", description: "IRC এবং ERC রেজিস্ট্রেশন সহায়তা।" },
      {
        name: "বিভিন্ন অ্যাসোসিয়েশনের মেম্বারশিপ",
        description: "বিভিন্ন অ্যাসোসিয়েশনের মেম্বারশিপ অর্জনের সহায়তা।",
      },
    ],
  },
  {
    category: "প্রশিক্ষণ, কনসালটেন্সি ও সাপোর্ট",
    icon: <GraduationCap className="w-5 h-5" />,
    color: "bg-purple-600",
    services: [
      {
        name: "টেন্ডার কনসালটেন্সি",
        description: "টেন্ডার প্রক্রিয়া বুঝিয়ে পরামর্শ প্রদান, যা ঠিকাদারদের সাহায্য করে।",
      },
      {
        name: "AI FAQ বট",
        description: "বাংলা ভয়েস সাপোর্টসহ AI FAQ বট, যা টেন্ডার সংক্রান্ত প্রশ্নের উত্তর দেয়।",
      },
      { name: "ইজিপি ট্রেনিং", description: "ইজিপি সিস্টেমের ট্রেনিং প্রদান।" },
      { name: "উদ্যোক্তা প্রশিক্ষণ", description: "উদ্যোক্তাদের জন্য প্রশিক্ষণ প্রদান।" },
    ],
  },

  {
    category: "অন্যান্য সাপোর্ট ও সুবিধা",
    icon: <Box className="w-5 h-5" />,
    color: "bg-cyan-600", // Fresh color for new section
    services: [
      {
        name: "কোম্পানির প্রোফাইল তৈরি",
        description: "কোম্পানি প্রোফাইল/বিজনেস প্রোফাইল তৈরি করার সুবিধা।",
      },
      {
        name: "একাধিক কোম্পানি ম্যানেজমেন্ট",
        description:
          "একটি অ্যাকাউন্ট থেকে একাধিক কোম্পানি ম্যানেজ করার সুবিধা, আলাদা লগইনের প্রয়োজন ছাড়া।",
      },
      {
        name: "টেন্ডারার ডাটাবেজ পূরণ",
        description: "ই-জিপি সিস্টেমে টেন্ডারার ডাটাবেজ সঠিক ও দ্রুত পূরণ করার সুবিধা।",
      },
      {
        name: "Power BI রিপোর্টিং",
        description: "ডাটা শিট বিশ্লেষণ ও ভিজ্যুয়াল গ্রাফিক্যাল রিপোর্ট তৈরি।",
      },
      {
        name: "এন্ড-টু-এন্ড সল্যুশন",
        description:
          "রেজিস্ট্রেশন থেকে কোটেশন, সাবমিশন এবং নোটিফিকেশন পর্যন্ত সম্পূর্ণ সল্যুশন, যা টেন্ডার প্রক্রিয়াকে অটোমেটেড করে।",
      },
    ],
  },
];

export default function ServicesMainList() {
  return (
    <section className="w-full py-12  min-h-screen">
      <div className="container mx-auto px-4 ">
        <header className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            আপনার জন্য সার্ভিস ক্যাটেগরি
          </h2>
         
        </header>

        {/* Level 1: Category Accordion */}
        <Accordion type="single" collapsible className="space-y-6">
          {servicesData.map((group, idx) => (
            <AccordionItem key={idx} value={`cat-${idx}`} className="border-none">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                {/* Category Trigger */}
                <AccordionTrigger
                  className={` p-5 hover:no-underline text-white rounded-lg  [&[data-state=open]>svg]:rotate-180`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`${group.color} p-2 rounded`}>{group.icon}</div>
                    <h3 className="text-lg md:text-xl font-bold text-left text-gray-900">
                      {group.category}
                    </h3>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="p-4 md:p-6 bg-white ">
                  {/* Level 2: Service Accordion */}
                  <Accordion type="single" collapsible className="space-y-3">
                    {group.services.map((service, sIdx) => (
                      <AccordionItem
                        key={sIdx}
                        value={`svc-${idx}-${sIdx}`}
                        className="border rounded-xl  data-[state=open]:border-blue-200 data-[state=open]:bg-blue-50/20 transition-all duration-200"
                      >
                        <AccordionTrigger className="hover:no-underline py-4 px-3 bg-[#4874c7]/5">
                          <div className="flex items-center gap-3 text-left">
                            <div className="mt-1 w-max p-2 inline-flex  shrink-0 items-center justify-center rounded-full bg-[#4874c7]/10 text-[#4874c7]">
                              <FiCheckCircle className="h-4 w-4" />
                            </div>
                            <span className="font-semibold text-slate-700 md:text-lg">
                              {service.name}
                            </span>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="pb-5 px-3">
                          <div className="flex gap-4 p-5 bg-white border border-slate-100 rounded-xl shadnow-0 border-none">
                            <div className="mt-1">
                              
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                              {service.description}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
