"use client";

import { FiArrowRight, FiClock, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FiCalendar, FiTag } from "react-icons/fi";

export default function HowItWorks() {
  const blogs = [
    {
      id: "blog-1",
      title: "LTM, OTM, OSTETM: কোন টেন্ডার টাইপ আপনার জন্য সেরা?",
      excerpt:
        "LTM, OTM এবং OSTETM টেন্ডারের পার্থক্য, যোগ্যতার শর্ত এবং সঠিক কৌশল নিয়ে বিস্তারিত গাইড।",
      category: "Tender Basics",
      date: "১২ ফেব্রুয়ারি ২০২৬",
      readTime: "৬ মিনিট",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: "blog-2",
      title: "টেন্ডার ডকুমেন্ট চেকলিস্ট: সাবমিশনের আগে ১০টি জরুরি বিষয়",
      excerpt:
        "ডকুমেন্ট মিসিং, ভুল ম্যাপিং, BOQ ত্রুটি—এই সাধারণ ভুলগুলো এড়াতে একটি বাস্তবসম্মত চেকলিস্ট।",
      category: "Document Preparation",
      date: "৯ ফেব্রুয়ারি ২০২৬",
      readTime: "৮ মিনিট",
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: "blog-3",
      title: "SLT Calculation সহজভাবে: কীভাবে স্মার্ট রেট কোট করবেন",
      excerpt:
        "SLT কী, কেন গুরুত্বপূর্ণ, এবং কিভাবে ডেটা-ভিত্তিক কোটেশন দিলে জয়ের সম্ভাবনা বাড়ে।",
      category: "Calculation",
      date: "৫ ফেব্রুয়ারি ২০২৬",
      readTime: "৭ মিনিট",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: "blog-4",
      title: "টেন্ডার ট্র্যাকিং অটোমেশন: ছোট টিমে বড় ফলাফল",
      excerpt:
        "কম জনবল নিয়ে কীভাবে টেন্ডার ডেডলাইন, নোটিফিকেশন, এবং অর্ডার স্ট্যাটাস দক্ষভাবে ম্যানেজ করবেন।",
      category: "Productivity",
      date: "২ ফেব্রুয়ারি ২০২৬",
      readTime: "৫ মিনিট",
      image:
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1400&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#4874c7]/5 via-white to-[#4874c7]/10">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#4874c7] animate-fade-in">
              এটি কিভাবে কাজ করে
            </p>
            <h2 className="mt-4 text-gray-900 animate-slide-up">
              ই-টেন্ডার বিডি — আপনার টেন্ডার সফলতার স্মার্ট পার্টনার
            </h2>
            <p
              className="mt-6 text-lg text-gray-600 animate-slide-up"
              style={{ animationDelay: "100ms" }}
            >
              সরকারি টেন্ডার প্রক্রিয়াকে সহজ, দ্রুত এবং নির্ভুল করে তোলার জন্য তৈরি করা হয়েছে।
              আমাদের অটোমেটেড সিস্টেম আপনার ৯৫% সময় বাঁচিয়ে দেয় এবং ভুলের ঝুঁকি কমিয়ে দেয়।
            </p>
            <div
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <Button
                asChild
                className="h-12 px-8 text-base bg-[#4874c7] hover:bg-[#3a5da8] hover:scale-105 transition-all duration-200"
              >
                <Link to="/registration">এখনই শুরু করুন</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 px-8 text-base border-[#4874c7] text-[#4874c7] hover:bg-[#4874c7]/10 hover:scale-105 transition-all duration-200"
              >
                <Link to="/services">সেবা দেখুন</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container h-full mx-auto lg:px-10 px-4 py-10 lg:py-16">
        <section className="max-w-4xl mx-auto text-center mb-10">
      
          <h2 className="mt-2 text-gray-900 animate-slide-up">টেন্ডার জ্ঞান, কৌশল ও আপডেট</h2>
          <p
            className="mt-3 text-base text-gray-600 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            আমাদের ব্লগে পাবেন টেন্ডার প্রস্তুতি, সাবমিশন কৌশল, ডকুমেন্টেশন এবং সফলতার বাস্তব
            টিপস—সবকিছু সহজ বাংলায়।
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <article
              key={blog.id}
              className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                {index === 0 && (
                  <div className="inline-flex items-center gap-2 text-[#4874c7] mb-3">
                    <FiTrendingUp className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Featured</span>
                  </div>
                )}
                <h3 className="text-gray-900">{blog.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{blog.excerpt}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <FiTag className="h-3.5 w-3.5 text-[#4874c7]" />
                    {blog.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiCalendar className="h-3.5 w-3.5 text-[#4874c7]" />
                    {blog.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiClock className="h-3.5 w-3.5 text-[#4874c7]" />
                    {blog.readTime}
                  </span>
                </div>
                <Link
                  to="#"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#4874c7] hover:text-[#3a5da8] transition-colors"
                >
                  বিস্তারিত পড়ুন <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
