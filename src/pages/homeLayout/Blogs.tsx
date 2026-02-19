// @ts-nocheck
import React, { useState } from "react";
import { ChevronDown, ChevronRight, Menu, X, BookOpen, List } from "lucide-react";

const Blogs = () => {
  const [activeBlogId, setActiveBlogId] = useState("egp-tender-guide");
  const [openCategory, setOpenCategory] = useState("টেন্ডার সার্ভিস");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ব্লগ ডাটাবেস (আপনার দেওয়া Schema অনুযায়ী)
  const blogDatabase = {
    "egp-tender-guide": [
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
        shortTitle: "১. কেন আপনার প্রয়োজন?",
        fullTitle: "১. কেন আপনার এই সার্ভিস প্রয়োজন?",
        content: [
          "একজন ঠিকাদার বা ব্যবসায়ীর কাছে সময়ের মূল্য অনেক। বর্তমানে eGP পোর্টালে কোনো টেন্ডার খুঁজতে গেলে আপনাকে ম্যানুয়ালি অনেকগুলো ধাপ পার করতে হয়।",
        ],
        listItems: [
          {
            boldText: "বিচ্ছিন্ন তথ্য (Scattered Information): ",
            text: "eGP পোর্টালে একটি টেন্ডার নোটিশ দেখা গেলেও সেটির বিস্তারিত আর্থিক শর্তাবলি বা 'Financial Criteria' জানতে হলে আপনাকে অনেক সময় লগইন করে পুরো 'Tender Document' ডাউনলোড করতে হয়। এতে প্রচুর সময় নষ্ট হয়।",
          },
          {
            boldText: "আর্থিক যোগ্যতার অভাব:",
            text: "আর্থিক যোগ্যতার অভাব:ধরুন, আপনি একটি কাজের জন্য বেশ আগ্রহী। কিন্তু কাজটির জন্য প্রয়োজনীয় 'Turnover Amount' বা 'Liquid Asset' আপনার বর্তমানে নেই। আপনি যদি এই তথ্যগুলো টেন্ডার ডকুমেন্ট কেনার পর জানতে পারেন, তবে আপনার সময় এবং টাকা—উভয়ই অপচয় হবে।",
          },
          {
            boldText: "ডেডলাইন মিস করা: ",
            text: "অনেক সময় অনেক গুরুত্বপূর্ণ 'Tender Notice' আমাদের চোখ এড়িয়ে যায় কারণ আমরা হয়তো নির্দিষ্ট ডিস্ট্রিক্ট বা ক্যাটাগরি ফিল্টার করতে পারি না।",
          },
        ],
        example: {
          boldText: "বাস্তব উদাহরণ:",
          text: [
            "চট্টগ্রামের একজন প্রথম শ্রেণির ঠিকাদার গত মাসে একটি বড় রাস্তার কাজের টেন্ডার মিস করেছেন। কারণ তিনি যখন eGP পোর্টালে নোটিশটি দেখেন, তখন 'Last Selling Date' পার হয়ে গেছে। অথচ তিনি যদি আমাদের সার্ভিস ব্যবহার করতেন, তবে নোটিশটি পাবলিশ হওয়ার সাথে সাথেই তার ফোনে অ্যালার্ট চলে যেত এবং তিনি এক নজরেই দেখতে পেতেন তার 'Tender Capacity' ঐ কাজের জন্য যথেষ্ট কি না।",
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
            text: "eGP থেকে পাবলিশ হওয়া 'Tender Notice' এর সাথে 'Tender Data Sheet (TDS)' থেকে প্রাপ্ত গুরুত্বপূর্ণ ডেটার সংমিশ্রণ।",
          },
          {
            boldText: "আর্থিক মাপকাঠি (Financial Criteria):",
            text: "যা অন্য কোথাও সহজে পাওয়া যায় না। যেমন—",
            nested: [
              { boldText: "Estimated Cost:", text: "কাজটির আনুমানিক মূল্য কত?" },
              { boldText: "Tender Security: ", text: "কত টাকা জামানত দিতে হবে?" },
              { boldText: "Turnover Amount: ", text: "গত কয়েক বছরে আপনার লেনদেন কত হতে হবে?" },
              {
                boldText: "Liquid Assets:  ",
                text: "র্বতমানে আপনার ব্যাংকে কত টাকা নগদ বা ক্রেডিট লাইন থাকতে হবে?",
              },
              { boldText: "Tender Capacity:", text: "আপনার বর্তমান সক্ষমতা কতটুকু?" },
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
        example: {
          text: [
            "আমাদের মূল লক্ষ্য হলো আপনাকে এমন একটি প্ল্যাটফর্ম দেওয়া যেখানে আপনি মাত্র ১ মিনিটে সিদ্ধান্ত নিতে পারেন আপনি এই টেন্ডারে অংশ নেবেন কি না।",
          ],
        },
      },
      {
        id: "section-3",
        shortTitle: "৩. অন্যান্য প্ল্যাটফর্মে কী পাওয়া যায়?",
        fullTitle: "৩. অন্যান্য প্ল্যাটফর্মে কী পাওয়া যায়?",
        hasTable: true,
        tableContent: {
          tableHeader: [
            "ফিচারের তুলনা",
            "সাধারণ সংবাদপত্র/পোর্টাল",
            "অফিসিয়াল eGP পোর্টাল",
            "আমাদের সার্ভিস (New Tender Notice)",
          ],
          rows: [
            {
              column1: "সব নোটিশ একত্রে",
              column2: "না (সবগুলো পত্রিকায় আসে না)",
              column3: "হ্যাঁ (তবে খোঁজা কঠিন)",
              column4: "হ্যাঁ (সম্পূর্ণ অটোমেটেড)",
            },
            {
              column1: "Financial Criteria",
              column2: "নেই",
              column3: "আছে (ডকুমেন্ট ডাউনলোড করতে হয়)",
              column4: "এক ক্লিকেই দৃশ্যমান",
            },
            {
              column1: "স্মার্ট ফিল্টারিং",
              column2: "সম্ভব নয়",
              column3: "সীমিত (District/Ministry)",
              column4: "Advanced (Cost, Capacity, Location)",
            },
            {
              column1: "Alert System",
              column2: "নেই",
              column3: "নেই",
              column4: "Email & Dashboard Alerts",
            },
            {
              column1: "Estimated Price",
              column2: "থাকে না",
              column3: "অনেক সময় গোপনীয় থাকে",
              column4: "বিশ্লেষণধর্মী আনুমানিক তথ্য",
            },
          ],
        },

        content: [
          "বাজারে অনেক প্ল্যাটফর্ম আছে যারা টেন্ডার তথ্য সরবরাহ করে। তবে কেন আপনি আমাদের বেছে নেবেন? নিচের টেবিলটি আপনাকে পার্থক্য বুঝতে সাহায্য করবে:",
        ],
        example: {
          boldText: "অফিসিয়াল পোর্টালে সীমাবদ্ধতা:",
          text: [
            " যদিও eGP পোর্টাল অত্যন্ত শক্তিশালী, কিন্তু এটি মূলত প্রকিউরমেন্ট সম্পন্ন করার জন্য তৈরি, ডেটা অ্যানালাইসিসের জন্য নয়। আমাদের সার্ভিস সেই ডেটাগুলোকে নিয়ে এসে আপনার ব্যবসার জন্য রিডেবল ফরমেটে সাজিয়ে দেয়।",
          ],
        },
      },
      {
        id: "section-4",
        shortTitle: "৪. আমরা কীভাবে এটি প্রদান করি?",
        fullTitle: "৪. আমরা কীভাবে এটি প্রদান করি?",
        content: [
          "আমাদের কাজের প্রক্রিয়া অত্যন্ত স্বচ্ছ এবং আধুনিক প্রযুক্তিনির্ভর। আপনার কাছে নির্ভুল তথ্য পৌঁছে দিতে আমরা নিচের ধাপগুলো অনুসরণ করি:",
        ],
        listItems: [
          {
            boldText: "1. রিয়েল-টাইম ডেটা কালেকশন:",
            text: "আমরা সরাসরি eGP সিস্টেম থেকে ডেটা সংগ্রহ করি, যার ফলে তথ্যের কোনো হেরফের হওয়ার সুযোগ থাকে না।",
          },
          {
            boldText: "2. AI চালিত বিশ্লেষণ:",
            text: "আমাদের বিশেষ অ্যালগরিদম টেন্ডার নোটিশ এবং TDS থেকে আর্থিক ডাটাগুলো আলাদা করে ফেলে। এতে আপনার আর ম্যানুয়ালি বড় বড় PDF ফাইল পড়ার প্রয়োজন হয় না।",
          },
          {
            boldText: "3. ইউজার-ফ্রেন্ডলি ড্যাশবোর্ড:",
            text: "আমরা একটি অত্যন্ত সহজ ড্যাশবোর্ড তৈরি করেছি। আপনি এখানে আপনার পছন্দমতো 'Estimated Price' এর রেঞ্জ সেট করতে পারেন। যেমন—আপনি যদি কেবল ৫০ লক্ষ থেকে ২ কোটি টাকার কাজ করতে চান, তবে আমাদের ফিল্টার আপনাকে কেবল সেই কাজগুলোই দেখাবে।",
          },
          {
            boldText: "4. নিরাপত্তা ও গোপনীয়তা:",
            text: "আপনার সার্চ হিস্টোরি বা পছন্দসমূহ আমাদের কাছে অত্যন্ত সুরক্ষিত থাকে।",
          },
        ],
      },
      {
        id: "section-5",
        shortTitle: "৫. আমাদের ওয়েবসাইটে কোথায় এবং কীভাবে খুঁজে পাবেন?",
        fullTitle: "৫. আমাদের ওয়েবসাইটে কোথায় এবং কীভাবে খুঁজে পাবেন?",
        content: [
          "আমাদের এই প্রিমিয়াম সার্ভিসটি ব্যবহার করা খুবই সহজ। নিচে ধাপে ধাপে নির্দেশিকা দেওয়া হলো:",
        ],
        listItems: [
          {
            boldText: "ধাপ ১:",
            text: "প্রথমে আমাদের ওয়েবসাইট [আপনার ওয়েবসাইটের ইউআরএল] এ ভিজিট করুন এবং আপনার একাউন্টে লগইন করুন।",
          },
          {
            boldText: "ধাপ ২:",
            text: "হোমপেজের মেনুবার থেকে 'Tender Services' সেকশনে যান।",
          },
          {
            boldText: "ধাপ ৩: ",
            text: "পডাউন থেকে 'New Tender Notice' অপশনটি সিলেক্ট করুন।",
          },
          {
            boldText: "ধাপ ৪:",
            text: "এখানে আপনি একটি সার্চ বার পাবেন। সেখানে 'eGP টেন্ডার নোটিশ' বা নির্দিষ্ট কী-ওয়ার্ড দিয়ে সার্চ করুন।",
          },
          {
            boldText: "ধাপ ৫:",
            text: "প্রতিটি টেন্ডারের পাশে একটি 'View Details' বাটন থাকবে। সেখানে ক্লিক করলেই আপনি টেন্ডার ফাইনান্সিয়াল ক্রাইটেরিয়া সহ সব তথ্য এক পাতায় দেখতে পাবেন।",
          },
        ],
        example: {
          boldText: "বিশেষ টিপস:",
          text: [
            "আপনি যদি চান নির্দিষ্ট কোনো জেলার টেন্ডার আপনার ড্যাশবোর্ডে সবার আগে আসুক, তবে 'Settings' থেকে আপনার পছন্দ সেট করে রাখতে পারেন।",
          ],
        },
      },
    ],
    "tender-license": [
      {
        id: "lic-1",
        shortTitle: "লাইসেন্স গাইড",
        fullTitle: "ই-জিপি লাইসেন্স করার নিয়মাবলী",
        content: ["ই-জিপি পোর্টালে নিবন্ধিত হওয়ার জন্য কিছু নির্দিষ্ট ধাপ অনুসরণ করতে হয়..."],
      },
    ],
  };

  const categories = [
    {
      name: "টেন্ডার সার্ভিস",
      blogs: [
        {
          id: "egp-tender-guide",
          title: "eGP টেন্ডার নোটিশ: কেন আমাদের সার্ভিস আপনার ব্যবসার জন্য অপরিহার্য",
        },
        { id: "tender-license", title: "লাইসেন্সিং প্রক্রিয়া" },
      ],
    },
    {
      name: "ব্যবসা সহায়িকা",
      blogs: [{ id: "business-growth", title: "ব্যবসা প্রসারের টিপস" }],
    },
  
  ];

  const currentBlogData = blogDatabase[activeBlogId] || [];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-[#333]">
      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50 ">
        <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-tight">
          <BookOpen size={20} />
          <span>Blog Hub</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white border rounded-md shadow-sm"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex flex-1 relative ">
        {/* LEFT SIDEBAR: Categories (Accordion) */}
        <aside
          className={`
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 w-full md:w-70 lg:w-[320px] fixed md:sticky top-0 bg-white md:top-0 h-[calc(100vh-60px)] md:h-screen  border-r border-gray-200 p-6 overflow-y-auto transition-transform duration-300 z-40
        `}
        >
          <div className="hidden md:flex items-center gap-2 text-primary font-bold mb-8 uppercase tracking-widest text-sm">
            <BookOpen size={18} />
            <span>Blog Categories</span>
          </div>

          <div className="space-y-4 mt-32 md:mt-0">
            {categories.map((cat) => (
              <div key={cat.name} className="border-b border-gray-200 pb-2">
                <button
                  onClick={() => setOpenCategory(openCategory === cat.name ? "" : cat.name)}
                  className="flex items-center justify-between w-full py-2 text-left font-bold text-gray-700 hover:text-[#4874c7] transition-colors"
                >
                  {cat.name}
                  {openCategory === cat.name ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>

                {openCategory === cat.name && (
                  <div className="mt-2 ml-2 space-y-1">
                    {cat.blogs.map((blog) => (
                      <button
                        key={blog.id}
                        onClick={() => {
                          setActiveBlogId(blog.id);
                          setIsMobileMenuOpen(false);
                          window.scrollTo(0, 0);
                        }}
                        className={`block w-full text-left text-[14px] px-3 py-2 rounded-md transition-all  ${
                          activeBlogId === blog.id
                            ? "bg-blue-50 text-primary font-medium  "
                            : "text-gray-600 hover:bg-white hover:text-[#4874c7] "
                        }`}
                      >
                        <p
                          className={`line-clamp-1 ${
                            activeBlogId === blog.id
                              ? "bg-blue-50 text-primary font-medium  "
                              : "text-gray-600 hover:bg-white hover:text-primary "
                          }`}
                        >
                          {blog.title}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* MIDDLE CONTENT: Blog Post */}
        <main className="flex-1 max-w-4xl mx-auto p-6 md:p-12 lg:p-8 bg-white overflow-x-hidden">
          {currentBlogData.map((section) => (
            <section key={section.id} id={section.id} className="mb-12 md:mb-20 scroll-mt-24">
              <h2 className="text-[24px] md:text-[32px] font-bold text-[#202124] mb-6 md:mb-10 leading-tight">
                {section.fullTitle}
              </h2>

              <div className="space-y-4 md:space-y-6 mb-8 text-[#3c4043] leading-[1.7] md:leading-[1.8] text-[16px] md:text-[18px]">
                {section.content.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </div>

              {section.listItems && (
                <ul className="list-disc pl-5 md:pl-8 space-y-4 mb-8">
                  {section.listItems.map((item, idx) => (
                    <li key={idx} className="text-[#3c4043] text-[16px] md:text-[17px]">
                      <span className="font-bold text-gray-900">{item.boldText}</span> {item.text}
                      {item.nested && (
                        <ul className="list-[circle] pl-5 md:pl-8 mt-4 space-y-3 border-l-2 border-gray-100 ml-1">
                          {item.nested.map((sub, sIdx) => (
                            <li key={sIdx} className="text-[#474747] italic">
                              <span className="font-bold">{sub?.boldText}</span> {sub?.text}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {section.example && (
                <div className="bg-[#fff9e6] border-l-4 border-[#fbc02d] p-5 md:p-8 rounded-r-xl italic text-[#3c4043] my-8 shadow-sm">
                  <span className="font-bold text-[#202124] mb-3 block text-lg">
                    {section.example.boldText}
                  </span>
                  {section.example.text.map((line, idx) => (
                    <p key={idx} className="mb-2">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {section.hasTable && (
                <div className="overflow-x-auto my-10 border border-gray-200 rounded-2xl shadow-sm">
                  <table className="min-w-[600px] md:min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#f8f9fa]">
                      <tr>
                        {section.tableContent.tableHeader.map((header, idx) => (
                          <th
                            key={idx}
                            className="px-6 py-4 text-left text-sm font-bold text-gray-700"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {section.tableContent.rows.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 font-medium"> {row?.column1}</td>
                          <td className="px-6 py-4 font-medium">{row?.column2}</td>
                          <td className="px-6 py-4 font-medium">{row?.column3}</td>
                          <td className="px-6 py-4 font-medium">{row?.column4}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </main>

        {/* RIGHT SIDEBAR: In-page Navigation (TOC) */}
        <aside className="hidden xl:block w-70 bg-white border-l border-gray-100 p-8 sticky top-0 h-screen">
          <div className="flex items-center gap-2 text-gray-400 font-bold mb-6 uppercase tracking-widest text-[11px]">
            <List size={14} />
            <span>On This Page</span>
          </div>
          <nav className="space-y-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-100"></div>
            {currentBlogData.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="block w-full text-left text-[13px] text-gray-500 hover:text-[#4874c7] transition-all pl-4 relative group"
              >
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-transparent group-hover:bg-blue-600 -ml-[2px]"></span>
                {section.shortTitle}
              </button>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default Blogs;
