// @ts-nocheck

import { FiHelpCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HelpDesk() {
  const helpCards = [
    {
      title: "নতুন টেন্ডার নোটিশ",
      description:
        "eGP থেকে প্রকাশিত টেন্ডার নোটিস, টেন্ডার ডেটা শীট থেকে সংগ্রহিত তথ্য এবং প্রাক্কলিত মূল্য একসাথে প্রদান, যার মধ্যে কাজের লোকেশন, প্রকাশনা তারিখ, লাস্ট সেলিং, ওপেনিং ডেট, অল টাইপস ফাইনান্সিয়াল ক্রাইটেরিয়া (এস্টিমেটেড কস্ট, টেন্ডার সিকিউরিটি, টার্নওভার অ্যামাউন্ট, লিকুইড অ্যাসেটস, টেন্ডার ক্যাপাসিটি) অন্তর্ভুক্ত।",
      action: "সাহায্য নিন",
    },
    {
      title: "LTM, OTM টেন্ডার eGP-তে অটো সাবমিশন",
      description:
        "টেন্ডার I Agree থেকে শুরু করে ফর্ম ফিল-আপ, টেন্ডার ডকুমেন্ট ম্যাপিং, BOQ রেট সাইনিং সহ এনক্রিপ্ট পর্যন্ত eGP-তে অটো সাবমিশন সুবিধা, মোবাইল অ্যাপস এবং পিসি সফটওয়্যের মাধ্যমে।",
      action: "সাহায্য নিন",
    },
    {
      title: "অটো ডকুমেন্ট জেনারেশন",
      description:
        "টেন্ডার অনুযায়ী অথরাইজড লেটার, কোড অফ কন্ডাক্ট, JV অ্যাগ্রিমেন্ট এবং সকল ধরনের টেমপ্লেট অনুসারে প্রস্তুতি, যার মধ্যে অথরাইজ লেটার, ব্যাংক ক্রেডিট লেটার, ব্যাংক সলভেন্সি ইত্যাদি অটোমেটেডভাবে তৈরি।",
      action: "সাহায্য নিন",
    },
    {
      title: "টেন্ডার ম্যানেজমেন্ট",
      description:
        "আসন্ন টেন্ডারগুলো TO DO লিস্ট করা, টেন্ডার প্রিপারেশনের কাজ ম্যানেজমেন্ট, টেন্ডার সিকিউরিটির তথ্য ট্রেকিং, আগামী সপ্তাহের টেন্ডারগুলোর তালিকা সুসজ্জিত রিপোর্ট, সাবমিট করা টেন্ডার লটারির ফলাফল দেখা।",
      action: "সাহায্য নিন",
    },
    {
      title: "টেন্ডার SLT ক্যালকুলেশন",
      description:
        "টেন্ডার ড্রপিংয়ের পূর্বে SLT ক্যালকুলেশন করে যথাস্থানে রেট কোট করার ব্যবস্থা, অটো SLC ক্যালকুলেশন সহ।",
      action: "সাহায্য নিন",
    },
    {
      title: "RHD, PWD, LGED, WBD, EL BOQ রেট খুঁজে বের করা",
      description:
        "বিভিন্ন ডিপার্টমেন্ট (RHD, PWD, LGED, WBD, EL) থেকে BOQ রেট খুঁজে বের করার সুবিধা, যা টেন্ডার প্রিপারেশনে ব্যবহার হয়।",
      action: "চ্যাট করুন",
    },
  ];

  return (
    <div className="w-full">
      <div className="mx-auto py-10 lg:py-16">
        <div>
          <h2 className="max-w-4xl mx-auto text-center mb-8 text-gray-900">
          আপনার যেকোনো সমস্যা সমাধানে আমাদের সাপোর্ট টিম প্রস্তুত।
          </h2>
        </div>
        {/* <div className="max-w-3xl mx-auto mb-10">
          <form
            className="group flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="text"
              placeholder="আপনার সমস্যাটি এখানে লিখুন....."
              className="h-12 sm:h-14 rounded-full sm:rounded-r-none bg-white/90 backdrop-blur border border-slate-200/70 px-5 text-base focus-visible:ring-2 focus-visible:ring-[#4874c7]/30 focus-visible:ring-offset-0 transition-all duration-200"
            />
            <Button
              type="submit"
              className="h-12 sm:h-14 rounded-full sm:rounded-l-none px-8 text-white bg-[#4874c7] hover:bg-[#3a5da8] hover:text-lg transition-all duration-200"
            >
              সাহায্য নিন
            </Button>
          </form>
        </div> */}

        <div className="grid lg:grid-cols-2 max-w-6xl mx-auto gap-6 lg:gap-8">
          {helpCards.map((card) => (
            <div
              key={card.title}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/70 hover:shadow-2xl transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-[#4874c7]/10 text-[#4874c7] flex items-center justify-center shrink-0">
                  <FiHelpCircle className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900">{card.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{card.description}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  className="h-10 rounded-full px-6 text-white bg-[#4874c7] hover:bg-[#3a5da8] hover:text-base transition-all duration-200"
                >
                  {card.action}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
