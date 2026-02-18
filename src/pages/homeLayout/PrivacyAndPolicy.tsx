"use client";


import { ShieldCheck, Mail, Phone, MapPin, ChevronRight, Clock, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  const sections = [
    {
      id: "১",
      title: "আমরা যে তথ্য সংগ্রহ করি",
      content:
        "আমরা নিম্নলিখিত ধরনের তথ্য সংগ্রহ করতে পারি: নাম, কোম্পানির নাম, ঠিকানা, ইমেইল অ্যাড্রেস, মোবাইল নম্বর, পাসওয়ার্ড, ট্রেড লাইসেন্স নম্বর, TIN, BIN এর তথ্য।",
    },
    {
      id: "২",
      title: "আমরা তথ্য কীভাবে সংগ্রহ করি",
      content:
        "আপনি সরাসরি প্রদান করলে (রেজিস্ট্রেশন, প্রোফাইল আপডেট, সাবস্ক্রিপশন, টেন্ডার সাবমিশন)।",
    },
    {
      id: "৩",
      title: "আমরা তথ্য কীভাবে ব্যবহার করি",
      list: [
        "সেবা প্রদান (টেন্ডার নোটিফিকেশন, অটো সাবমিশন, BOQ ক্যালকুলেশন)।",
        "অ্যাকাউন্ট পরিচালনা ও পাসওয়ার্ড রিকভারি।",
        "গ্রাহক সহায়তা, AI FAQ বট, ইমেইল/WhatsApp/SMS যোগাযোগ।",
        "প্ল্যাটফর্মের উন্নয়ন, অ্যানালিটিক্স ও রিপোর্ট তৈরি।",
        "ফ্রড প্রতিরোধ ও সিকিউরিটি।",
      ],
    },
    {
      id: "৪",
      title: "তথ্য শেয়ারিং ও প্রকাশ",
      content:
        "আমরা আপনার ব্যক্তিগত তথ্য *কখনোই বিক্রি বা বাণিজ্যিকভাবে শেয়ার করি না*। তবে নিম্নলিখিত ক্ষেত্রে সীমিতভাবে প্রয়োজনীয় তথ্যগুলোই শুধু শেয়ার হতে পারে:",
      list: [
        "বিশ্বস্ত থার্ড-পার্টি সার্ভিস প্রোভাইডারের সাথে (হোস্টিং, পেমেন্ট গেটওয়ে, WhatsApp/SMS API, ক্লাউড সার্ভিস) – শুধুমাত্র সেবা প্রদানের প্রয়োজনে।",
        "আইনগত বাধ্যবাধকতা বা সরকারি কর্তৃপক্ষের আদেশে।",
      ],
    },
    {
      id: "৫",
      title: "ডেটা সুরক্ষা ও নিরাপত্তা",
      content: "আমরা আধুনিক নিরাপত্তা ব্যবস্থা ব্যবহার করি:",
      list: [
        "SSL/TLS এনক্রিপশন (ডেটা ট্রান্সমিশনের সময়)।",
        "পাসওয়ার্ড হ্যাশিং এবং সল্টিং।",
        "ফায়ারওয়াল, অ্যাক্সেস কন্ট্রোল এবং নিয়মিত সিকিউরিটি অডিট।",
        "সংবেদনশীল তথ্য নিরাপদ সার্ভারে এনক্রিপ্টেড অবস্থায় সংরক্ষিত।",
      ],
    },
    {
      id: "৬",
      title: "কুকিজ এবং ট্র্যাকিং প্রযুক্তি",
      content:
        "আমরা কুকিজ ব্যবহার করি লগইন সেশন রাখতে, সাইটের কার্যকারিতা বিশ্লেষণ করতে এবং ব্যবহারকারীর অভিজ্ঞতা উন্নত করতে। আপনি ব্রাউজার সেটিংস থেকে কুকিজ নিয়ন্ত্রণ বা বন্ধ করতে পারেন (কিছু ফিচার প্রভাবিত হতে পারে)।",
    },
    {
      id: "৭",
      title: "আপনার অধিকারসমূহ",
      content: "আপনি যেকোনো সময়:",
      list: [
        "আপনার তথ্য দেখতে, সংশোধন করতে বা ডিলিট করতে অনুরোধ করতে পারেন।",
        "সম্মতি প্রত্যাহার করতে পারেন (কিছু ক্ষেত্রে সেবা প্রভাবিত হতে পারে)।",
        "অভিযোগ জানাতে পারেন।"
      ]
    },
    {
      id: "৮",
      title: "ডেটা সংরক্ষণ",
      content: "আপনার তথ্য যতদিন অ্যাকাউন্ট অ্যাকটিভ থাকে বা সেবা প্রদানের প্রয়োজন হয় ততদিন রাখা হয়। অ্যাকাউন্ট ডিলিট করলে নির্দিষ্ট সময় পর ডেটা মুছে ফেলা হয়।",

    },
    {
      id: "৯",
      title: "নীতির পরিবর্তন",
      content: "আমরা এই নীতি পরিবর্তন ওয়েবসাইটে প্রকাশের সাথে সাথে কার্যকর হবে। গুরুতর পরিবর্তন হলে ইমেইল বা নোটিফিকেশনের মাধ্যমে জানানো হবে।",

    },
    {
      id: "১০",
      title: " যোগাযোগ করুন",
      content: "গোপনীয়তা সংক্রান্ত যেকোনো প্রশ্ন, অনুরোধ বা অভিযোগের জন্য যোগাযোগ করুন:",
      list: [
        "-ইমেইল: [support@etenderbd.com]",
        "মোবাইল/হোয়াটসঅ্যাপ: [+8801926959331]",
        "ঠিকানা: [আপনার অফিস ঠিকানা, যেমন: চাঁদপুর, বাংলাদেশ]"
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-blue-50 font-sans text-gray-800 pb-20">
      {/* Header Section */}
      <header className="  py-12 mb-8">
        <div className="container mx-auto  px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white border border-blue-50 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-[#4874c7]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">গোপনীয়তা নীতি</h1>
          <p className="text-[#4874c7] font-medium tracking-wide">Privacy Policy - ETenderBD</p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container py-10 mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-2xl shadow-sm  overflow-hidden">
          {/* Intro Text */}
          <div className="p-6 md:p-10 border-b border-gray-50 bg-slate-50/50">
            <p className="leading-relaxed text-gray-700">
              <strong className="text-[#4874c7]">ETenderBD</strong> আপনার ব্যক্তিগত তথ্যের গোপনীয়তা
              আপনার ব্যক্তিগত তথ্যের গোপনীয়তা ও নিরাপত্তাকে সর্বোচ্চ গুরুত্ব দেয়। আমরা বাংলাদেশের প্রযোজ্য আইনসমূহ (যেমন: সাইবার সিকিউরিটি অ্যাক্ট ২০২৩ এবং অন্যান্য সংশ্লিষ্ট বিধান) মেনে চলার মাধ্যমে আপনার তথ্য সুরক্ষিত রাখতে প্রতিশ্রুতিবদ্ধ।
            </p>
            <br />
            <p>এই গোপনীয়তা নীতিতে বর্ণনা করা হয়েছে যে আমরা আপনার কাছ থেকে কী ধরনের তথ্য সংগ্রহ করি, কীভাবে ব্যবহার করি, সংরক্ষণ করি, শেয়ার করি এবং সুরক্ষিত রাখি। আমাদের ওয়েবসাইট <Link className="underline text-[#4874c7]" to={"etenderbd.com"}>etenderbd.com</Link> এবং মোবাইল অ্যাপ ব্যবহার করে আপনি এই নীতির সাথে সম্মতি প্রকাশ করছেন।</p>
          </div>

          {/* Policy Sections */}
          <div className="p-6 md:p-10 space-y-12">
            {sections.map((section) => (
              <section key={section.id} className="relative">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-[#4874c7] font-bold">
                    {section.id}
                  </span>
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                    {section.content && (
                      <p className="text-gray-600 leading-relaxed">{section.content}</p>
                    )}
                    {section.list && (
                      <ul className="space-y-2">
                        {section.list.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-600">
                            <ChevronRight className="w-4 h-4 text-[#4874c7]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            ))}

            {/* Additional Points */}
            <div className="grid md:grid-cols-2 gap-6 pt-6">
              <div className="p-5 rounded-xl border border-blue-50 bg-blue-50/30">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#4874c7]" /> আপনার অধিকারসমূহ
                </h3>
                <p className="text-sm text-gray-600">
                  আপনি যেকোনো সময় আপনার তথ্য দেখতে, সংশোধন করতে বা ডিলিট করতে অনুরোধ করতে পারেন।
                </p>
              </div>
              <div className="p-5 rounded-xl border border-blue-50 bg-blue-50/30">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4874c7]" /> ডেটা সংরক্ষণ
                </h3>
                <p className="text-sm text-gray-600">
                  অ্যাকাউন্ট অ্যাকটিভ থাকা পর্যন্ত তথ্য রাখা হয়। অ্যাকাউন্ট ডিলিট করলে নির্দিষ্ট
                  সময় পর মুছে ফেলা হয়।
                </p>
              </div>
            </div>

            {/* Contact Footer */}
            <div className="mt-16 p-8 rounded-2xl bg-[#4874c7]/10 text-white">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">যোগাযোগ করুন</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <Mail className="w-6 h-6 text-[#4874c7]" />
                  </div>
                  <div>
                    <p className="text-[#4874c7]  uppercase tracking-wider font-bold">
                      ইমেইল
                    </p>
                    <p className="font-medium  text-slate-700">support@etenderbd.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <Phone className="w-6 h-6 text-[#4874c7]" />
                  </div>
                  <div>
                    <p className="text-[#4874c7] text-xs uppercase tracking-wider font-bold">
                      মোবাইল/হোয়াটসঅ্যাপ
                    </p>
                    <p className="font-medium">+8801926959331</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:col-span-2">
                  <div className="p-3 bg-white rounded-lg">
                    <MapPin className="w-6 h-6 text-[#4874c7]" />
                  </div>
                  <div>
                    <p className="text-[#4874c7] text-xs uppercase tracking-wider font-bold">
                      ঠিকানা
                    </p>
                    <p className="font-medium">চাঁদপুর, বাংলাদেশ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="p-6 bg-gray-50 text-center">
            <p className="text-sm text-gray-500 italic">
              **ETenderBD** আপনার তথ্যের গোপনীয়তা রক্ষায় সর্বদা প্রতিশ্রুতিবদ্ধ। ধন্যবাদ আপনার
              আস্থার জন্য।
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
