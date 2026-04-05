// @ts-nocheck
import React, { useState } from "react";

const Blogs = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const blogData = [
    {
      id: "intro",
      shortTitle: "eGP টেন্ডার নোটিশ: কেন ...",
      fullTitle: "eGP টেন্ডার নোটিশ: কেন আমাদের সার্ভিস আপনার ব্যবসার জন্য অপরিহার্য",
      content: [
        "বাংলাদেশে প্রকিউরমেন্ট সেক্টরে প্রতিযোগিতার মাত্রা এখন আকাশচুম্বী। বড় বড় প্রজেক্ট থেকে শুরু করে ছোটখাটো সরবরাহ—সবই এখন ডিজিটাল। তবে ডিজিটালাইজেশন যেমন সুযোগ এনেছে, তেমনি তথ্যের আধিক্যের কারণে তৈরি করেছে কিছু জটিলতাও। এই জটিলতা কাটিয়ে উঠতে আমাদের কনসোলিডেটেড টেন্ডার সার্ভিস কীভাবে সাহায্য করবে, তা নিচে বিস্তারিত আলোচনা করা হলো।",
      ],
    },
    {
      id: "section-1",
      shortTitle: "১. কেন আপনার এই সার্ভি...",
      fullTitle: "১. কেন আপনার এই সার্ভিস প্রয়োজন?",
      content: [
        "একজন ঠিকাদার বা ব্যবসায়ীর কাছে সময়ের মূল্য অনেক। বর্তমানে eGP পোর্টালে কোনো টেন্ডার খুঁজতে গেলে আপনাকে ম্যানুয়ালি অনেকগুলো ধাপ পার করতে হয়। কিন্তু এতে সমস্যা কোথায়?",
      ],
      listItems: [
        {
          boldText: "বিচ্ছিন্ন তথ্য (Scattered Information):",
          text: " eGP পোর্টালে একটি টেন্ডার নোটিশ দেখা গেলেও সেটির বিস্তারিত আর্থিক শর্তাবলি বা 'Financial Criteria' জানতে হলে আপনাকে অনেক সময় লগইন করে পুরো 'Tender Document' ডাউনলোড করতে হয়। এতে প্রচুর সময় নষ্ট হয়।",
        },
        {
          boldText: "আর্থিক যোগ্যতার অভাব:",
          text: " ধরুন, আপনি একটি কাজের জন্য বেশ আগ্রহী। কিন্তু কাজটির জন্য প্রয়োজনীয় 'Turnover Amount' বা 'Liquid Asset' আপনার বর্তমানে নেই। আপনি যদি এই তথ্যগুলো টেন্ডার ডকুমেন্ট কেনার পর জানতে পারেন, তবে আপনার সময় এবং টাকা—উভয়ই অপচয় হবে।",
        },
        {
          boldText: "ডেডলাইন মিস করা:",
          text: " অনেক সময় অনেক গুরুত্বপূর্ণ 'Tender Notice' আমাদের চোখ এড়িয়ে যায় কারণ আমরা হয়তো নির্দিষ্ট ডিস্ট্রিক্ট বা ক্যাটাগরি ফিল্টার করতে পারি না।",
        },
      ],
      example: {
        boldText: "বাস্তব উদাহরণ:",
        text: [
          " চট্টগ্রামের একজন প্রথম শ্রেণির ঠিকাদার গত মাসে একটি বড় রাস্তার কাজের টেন্ডার মিস করেছেন। কারণ তিনি যখন eGP পোর্টালে নোটিশটি দেখেন, তখন 'Last Selling Date' পার হয়ে গেছে। অথচ তিনি যদি আমাদের সার্ভিস ব্যবহার করতেন, তবে নোটিশটি পাবলিশ হওয়ার সাথে সাথেই তার ফোনে অ্যালার্ট চলে যেত এবং তিনি এক নজরেই দেখতে পেতেন তার 'Tender Capacity' ঐ কাজের জন্য যথেষ্ট কি না।",
          "এই ধরণের ভুল সিদ্ধান্ত এবং সময়ের অপচয় রোধ করতেই আমাদের এই সার্ভিস প্রয়োজন।",
        ],
      },
    },
    {
      id: "section-2",
      shortTitle: "২. আমরা কী প্রদান করি?",
      fullTitle: "২. আমরা কী প্রদান করি?",
      content: [
        'আমাদের সার্ভিসটি মূলত একটি "One-stop eGP Information Hub"। আমরা আপনাকে কেবল নোটিশ দেখাই না, বরং প্রতিটি টেন্ডারের একটি পূর্ণাঙ্গ ব্যবচ্ছেদ আপনার সামনে তুলে ধরি। আমাদের সার্ভিস থেকে আপনি যা যা পাবেন:',
      ],
      listItems: [
        {
          boldText: "সমন্বিত তথ্য:",
          text: " eGP থেকে পাবলিশ হওয়া 'Tender Notice' এর সাথে 'Tender Data Sheet (TDS)' থেকে প্রাপ্ত গুরুত্বপূর্ণ ডেটার সংমিশ্রণ। [cite: 27]",
        },
        {
          boldText: "আর্থিক মাপকাঠি (Financial Criteria):",
          text: "যা অন্য কোথাও সহজে পাওয়া যায় না। যেমন—",
          nested: [
            {
              boldText: "Estimated Cost:",
              text: "কাজটির আনুমানিক মূল্য কত?",
            },
            {
              boldText: "Tender Security:",
              text: "কত টাকা জামানত দিতে হবে?",
            },
            {
              boldText: "Turnover Amount: ",
              text: "গত কয়েক বছরে আপনার লেনদেন কত হতে হবে?",
            },
            {
              boldText: "Liquid Assets:",
              text: "বর্তমানে আপনার ব্যাংকে কত টাকা নগদ বা ক্রেডিট লাইন থাকতে হবে?",
            },
            {
              boldText: "Tender Capacity:",
              text: "আপনার বর্তমান সক্ষমতা কতটুকু?",
            },
          ],
        },
        {
          boldText: "গুরুত্বপূর্ণ তারিখসমূহ:",
          text: "'Publication Date', 'Last Selling Date', এবং 'Opening Date'—সব এক জায়গায়।",
        },
        {
          boldText: "কাজের অবস্থান (Work Location):",
          text: "গুগল ম্যাপ ইন্টিগ্রেশন বা স্পেসিফিক লোকেশন ডেটা যাতে আপনি বুঝতে পারেন সাইট ভিজিট করা আপনার জন্য কতটা সুবিধাজনক।",
        },
      ],
      footerNote:
        "আমাদের মূল লক্ষ্য হলো আপনাকে এমন একটি প্ল্যাটফর্ম দেওয়া যেখানে আপনি মাত্র ১ মিনিটে সিদ্ধান্ত নিতে পারেন আপনি এই টেন্ডারে অংশ নেবেন কি না।",
    },
    {
      id: "section-3",
      shortTitle: "৩. অন্যান্য প্ল্যাটফর্মে কী ...",
      fullTitle: "৩. অন্যান্য প্ল্যাটফর্মে কী পাওয়া যায়?",
      hasTable: true,
      content: [
        "বাজারে অনেক প্ল্যাটফর্ম আছে যারা টেন্ডার তথ্য সরবরাহ করে। তবে কেন আপনি আমাদের বেছে নেবেন? নিচের টেবিলটি আপনাকে পার্থক্য বুঝতে সাহায্য করবে:",
      ],
    },
    {
      id: "section-4",
      shortTitle: "৪. আমরা কীভাবে এটি প্র...",
      fullTitle: "৪. আমরা কীভাবে এটি প্রদান করি?",
      content: [
        "আমাদের কাজের প্রক্রিয়া অত্যন্ত স্বচ্ছ এবং আধুনিক প্রযুক্তিনির্ভর। আপনার কাছে নির্ভুল তথ্য পৌঁছে দিতে আমরা নিচের ধাপগুলো অনুসরণ করি:",
      ],
      numberedList: [
        {
          text: " আমরা সরাসরি eGP সিস্টেম থেকে ডেটা সংগ্রহ করি, যার ফলে তথ্যের কোনো হেরফের হওয়ার সুযোগ থাকে না।",
          boldText: "1. রিয়েল-টাইম ডেটা কালেকশন:",
        },
        {
          text: "  আমাদের বিশেষ অ্যালগরিদম টেন্ডার নোটিশ এবং TDS থেকে আর্থিক ডাটাগুলো আলাদা করে ফেলে। এতে আপনার আর ম্যানুয়ালি বড় বড় PDF ফাইল পড়ার প্রয়োজন হয় না।",
          boldText: "2. AI চালিত বিশ্লেষণ:",
        },
        {
          text: "   আমরা একটি অত্যন্ত সহজ ড্যাশবোর্ড তৈরি করেছি। আপনি এখানে আপনার পছন্দমতো 'Estimated Price' এর রেঞ্জ সেট করতে পারেন। যেমন—আপনি যদি কেবল ৫০ লক্ষ থেকে ২ কোটি টাকার কাজ করতে চান, তবে আমাদের ফিল্টার আপনাকে কেবল সেই কাজগুলোই দেখাবে।",
          boldText: "3. ইউজার-ফ্রেন্ডলি ড্যাশবোর্ড:",
        },
        {
          text: " আপনার সার্চ হিস্টোরি বা পছন্দসমূহ আমাদের কাছে অত্যন্ত সুরক্ষিত থাকে।",
          boldText: "4. নিরাপত্তা ও গোপনীয়তা:",
        },
      ],
    },
    {
      id: "section-5",
      shortTitle: "৫. আমাদের ওয়েবসাইটে ...",
      fullTitle: "৫. আমাদের ওয়েবসাইটে কোথায় এবং কীভাবে খুঁজে পাবেন? ",
      content: [
        "আমাদের এই প্রিমিয়াম সার্ভিসটি ব্যবহার করা খুবই সহজ। নিচে ধাপে ধাপে নির্দেশিকা দেওয়া হলো:",
      ],
      listItems: [
        {
          boldText: "ধাপ ১:",
          text: " প্রথমে আমাদের ওয়েবসাইট [আপনার ওয়েবসাইটের ইউআরএল] এ ভিজিট করুন এবং আপনার একাউন্টে লগইন করুন।",
        },
        { boldText: "ধাপ ২:", text: " হোমপেজের মেনুবার থেকে 'Tender Services' সেকশনে যান।" },
        { boldText: "ধাপ ৩:", text: " ড্রপডাউন থেকে 'New Tender Notice' অপশনটি সিলেক্ট করুন।" },
        {
          boldText: "ধাপ ৪:",
          text: " প্রথমে আমাদের ওয়েবসাইট [আপনার ওয়েবসাইটের ইউআরএল] এ ভিজিট করুন এবং আপনার একাউন্টে লগইন করুন।",
        },
        {
          boldText: "ধাপ ৫:",
          text: " প্রতিটি টেন্ডারের পাশে একটি 'View Details' বাটন থাকবে। সেখানে ক্লিক করলেই আপনি ",
        },
      ],
      tips: "বিশেষ টিপস: আপনি যদি চান নির্দিষ্ট কোনো জেলার টেন্ডার আপনার ড্যাশবোর্ডে সবার আগে আসুক, তবে 'Settings' থেকে আপনার পছন্দ সেট করে রাখতে পারেন।",
    },
    {
      id: "section-6",
      shortTitle: "উপসংহার",
      fullTitle: "উপসংহার [cite: 66]",
      content: [
        "টেন্ডার ব্যবসায় জয়ী হতে হলে কেবল অভিজ্ঞতা থাকলেই চলে না, প্রয়োজন সঠিক তথ্যের দ্রুত অ্যাক্সেস। আমাদের 'New Tender Notice' সার্ভিস আপনাকে সেই স্পিড এবং একুরেসি প্রদান করে যা প্রতিযোগিতায় আপনাকে এগিয়ে রাখবে। তথ্যের অভাবে আর কোনো ভালো সুযোগ যেন হাতছাড়া না হয়, সেটি নিশ্চিত করাই আমাদের লক্ষ্য।",
        "আপনি কি আপনার ব্যবসার জন্য সঠিক টেন্ডারটি খুঁজে পেতে প্রস্তুত?",
        "আজই আমাদের ওয়েবসাইটে সাইন আপ করুন এবং ৭ দিনের জন্য ফ্রি ট্রায়াল গ্রহণ করে আমাদের ফিচারের সুবিধাগুলো যাচাই করুন!",
        "আমাদের সাথে যোগাযোগ করুন: [ফোন নম্বর/ইমেইল]",
        "ভিজিট করুন: [ওয়েবসাইট ইউআরএল]",
      ],
    },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white font-sans text-[#333]">
      {/* MOBILE HEADER (Visible only on small/medium screens) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#f8f9fa] border-b sticky top-0 z-50">
        <h2 className="font-bold text-gray-700">Document Tabs</h2>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-blue-600 font-bold"
        >
          {isMobileMenuOpen ? "CLOSE" : "MENU"}
        </button>
      </div>

      {/* LEFT SIDEBAR (Hidden on mobile, drawer style on medium/small) */}
      <aside
        className={`
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:w-[320px] fixed md:sticky top-0 h-screen bg-[#f8f9fa] border-r border-gray-200 p-6 overflow-y-auto transition-transform duration-300 z-40
      `}
      >
        <h2 className="hidden md:block text-gray-700 font-bold mb-6 text-xl">Document tabs</h2>
        <div className="bg-[#e8f0fe] text-[#1a73e8] p-4 rounded-xl flex items-center justify-between mb-6 shadow-sm">
          <span className="flex items-center gap-3 font-semibold">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
            Tab 1
          </span>
          <span className="text-gray-400 text-xl">⋮</span>
        </div>

        <nav className="space-y-2 border-l-2 border-gray-200 ml-3">
          {blogData.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="block w-full text-left pl-6 py-2 text-[15px] text-gray-600 hover:text-[#1a73e8] hover:bg-white transition-all rounded-r-lg border-l-2 border-transparent hover:border-[#1a73e8] -ml-[2px]"
            >
              {section.shortTitle}
            </button>
          ))}
        </nav>
      </aside>

      {/* MIDDLE CONTENT SECTION */}
      <main className="flex-1 max-w-4xl mx-auto p-6 md:p-16 bg-white overflow-x-hidden">
        {blogData.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="mb-12 md:mb-20 scroll-mt-20 md:scroll-mt-10"
          >
            <h2 className="text-[22px] md:text-[28px] font-bold text-[#202124] mb-6 md:mb-8 leading-tight">
              {section.fullTitle}
            </h2>

            <div className="space-y-4 md:space-y-6 mb-6">
              {section.content.map((para, index) => (
                <p
                  key={index}
                  className="text-[#3c4043] leading-[1.6] md:leading-[1.8] text-[16px] md:text-[17px]"
                >
                  {para}
                </p>
              ))}
            </div>

            {section.listItems && (
              <ul className="list-disc pl-5 md:pl-8 space-y-3 md:space-y-4 mb-8">
                {section.listItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-[#3c4043] leading-[1.6] md:leading-[1.7] text-[16px] md:text-[17px]"
                  >
                    <span className="font-bold">{item.boldText}</span> {item.text}
                    {item.nested && (
                      <ul className="list-[circle] pl-5 md:pl-8 mt-3 space-y-2">
                        {item.nested.map((subItem, sIdx) => (
                          <li key={sIdx} className="text-[#474747] italic">
                            <span className="font-bold">{subItem?.boldText}</span> {subItem?.text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {section.numberedList && (
              <ul className="space-y-4 md:space-y-6 mb-8">
                {section.numberedList.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-[#3c4043] leading-[1.6] md:leading-[1.7] text-[16px] md:text-[17px] pl-2"
                  >
                    <span className="font-bold">{item?.boldText}</span> {item?.text}
                  </li>
                ))}
              </ul>
            )}

            {section.example && (
              <div className="bg-[#fff9e6] border-l-4 border-[#fbc02d] p-4 md:p-6 rounded-r-lg italic text-[#3c4043] my-6 md:my-8 leading-[1.6] md:leading-[1.8]">
                <span className="font-bold text-[#202124] mb-2">{section.example.boldText}</span>
                {section.example.text.map((line, idx) => (
                  <p key={idx} className="mb-2">
                    {line}
                  </p>
                ))}
              </div>
            )}

            {section.footerNote && (
              <p className="font-semibold text-[#202124] mt-6">{section.footerNote}</p>
            )}

            {section.tips && (
              <div className="bg-[#e7f4e8] p-4 md:p-5 rounded-lg border-l-4 border-[#34a853] text-[#137333] font-medium my-6">
                {section.tips}
              </div>
            )}

            {/* TABLE - Responsive Wrap */}
            {section.hasTable && (
              <div className="overflow-x-auto my-6 md:my-10 border border-gray-200 rounded-xl shadow-sm">
                <table className="min-w-[600px] md:min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#f8f9fa]">
                    <tr>
                      <th className="px-4 md:px-6 py-4 text-left text-sm font-bold text-gray-700">
                        ফিচারের তুলনা{" "}
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left text-sm font-bold text-gray-500">
                        সাধারণ সংবাদপত্র
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left text-sm font-bold text-gray-500">
                        অফিসিয়াল eGP
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left text-sm font-bold ">
                        আমাদের সার্ভিস (New Tender Notice)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-[14px] md:text-[15px]">
                    <tr>
                      <td className="px-4 md:px-6 py-4 font-semibold">সব নোটিশ একত্রে</td>
                      <td className="px-4 md:px-6 py-4">না (সবগুলো পত্রিকায় আসে না)</td>
                      <td className="px-4 md:px-6 py-4">হ্যাঁ (তবে খোঁজা কঠিন)</td>
                      <td className="px-4 md:px-6 py-4 bg-[#f8f9fa] text-[#1a73e8] font-bold">
                        হ্যাঁ (সম্পূর্ণ অটোমেটেড)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 md:px-6 py-4 font-semibold">Financial Criteria</td>
                      <td className="px-4 md:px-6 py-4">নেই</td>
                      <td className="px-4 md:px-6 py-4">আছে (ডাউনলোড করতে হয়)</td>
                      <td className="px-4 md:px-6 py-4 bg-[#f8f9fa] text-[#1a73e8] font-bold">
                        এক ক্লিকেই দৃশ্যমান
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 md:px-6 py-4 font-semibold">Alert System</td>
                      <td className="px-4 md:px-6 py-4">নেই</td>
                      <td className="px-4 md:px-6 py-4">নেই</td>
                      <td className="px-4 md:px-6 py-4 bg-[#f8f9fa] text-[#1a73e8] font-bold">
                        Email & Dashboard [cite: 43]
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </main>

      {/* RIGHT SIDEBAR (Blank) */}
      <aside className="hidden lg:block lg:w-[250px] bg-white border-l border-gray-100"></aside>

      {/* OVERLAY for Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Blogs;
