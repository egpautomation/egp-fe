"use client"

import { FiArrowRight, FiCalendar, FiClock, FiTag, FiTrendingUp } from "react-icons/fi"
import { Link } from "react-router-dom"



export default function Blogs() {
  return (
    <div className="container h-full mx-auto lg:px-10 px-4 py-10 lg:py-16">
      <section className="max-w-4xl mx-auto text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#4874c7] animate-fade-in">
          ব্লগ
        </p>
        <h2 className="mt-2 text-gray-900 animate-slide-up">
          টেন্ডার জ্ঞান, কৌশল ও আপডেট
        </h2>
        <p
          className="mt-3 text-base text-gray-600 animate-slide-up"
          style={{ animationDelay: "100ms" }}
        >
          আমাদের ব্লগে পাবেন টেন্ডার প্রস্তুতি, সাবমিশন কৌশল, ডকুমেন্টেশন এবং
          সফলতার বাস্তব টিপস—সবকিছু সহজ বাংলায়।
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
  )
}
