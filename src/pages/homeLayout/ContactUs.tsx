import { useRef, useState } from "react"
import { HiChatAlt2, HiClock, HiLocationMarker, HiMail, HiPhone, HiUsers } from "react-icons/hi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ContactUs() {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const highlights = [
    {
      title: "দ্রুত সাপোর্ট",
      description: "৩ মিনিটে প্রাথমিক রেসপন্স",
      icon: HiChatAlt2,
    },
    {
      title: "ফ্রি ডেমো",
      description: "লাইভ প্ল্যাটফর্ম ডেমো ও গাইড",
      icon: HiUsers,
    },
    {
      title: "বিশ্বস্ত সহায়তা",
      description: "অভিজ্ঞ টেন্ডার কনসালটেন্ট টিম",
      icon: HiPhone,
    },
  ]

  return (
    <div className="w-full">
      <section className="mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#4874c7] animate-fade-in">
            যোগাযোগ করুন
          </p>
          <h2 className="mt-2 text-gray-900 animate-slide-up">
            আপনার টেন্ডার প্রশ্নের জন্য আমরা আছি
          </h2>
          <p className="mt-3 text-base text-gray-600 animate-slide-up" style={{ animationDelay: "100ms" }}>
            আমাদের টিম আপনার প্রয়োজন অনুযায়ী দ্রুত সহায়তা, ডেমো এবং প্রাইসিং গাইড দিতে প্রস্তুত।
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#4874c7]/10 text-[#4874c7]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">বার্তা পাঠান</h3>
              <p className="mt-2 text-sm text-gray-600">
                নিচের ফর্মটি পূরণ করলে আমাদের টিম দ্রুত যোগাযোগ করবে।
              </p>
            </div>

            <form
              ref={formRef}
              className="mt-6 grid gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                formRef.current?.reset()
                setIsSuccessOpen(true)
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="fullName">
                    পূর্ণ নাম
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="আপনার পূর্ণ নাম"
                    className="h-11 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="companyName">
                    কোম্পানির নাম
                  </label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="কোম্পানির নাম"
                    className="h-11 bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="email">
                    ইমেইল ঠিকানা
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    className="h-11 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="phone">
                    মোবাইল নম্বর
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+880 1XXX-XXXXXX"
                    className="h-11 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="topic">
                  বিষয়
                </label>
                <Input
                  id="topic"
                  type="text"
                  placeholder="যে বিষয়ে জানতে চান"
                  className="h-11 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="message">
                  আপনার বার্তা
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="আপনার বার্তা লিখুন..."
                  className="w-full rounded-md border border-slate-200/70 bg-white px-3 py-2 text-sm text-gray-700 shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-slate-500">
                  সাবমিট করলে আপনি আমাদের সাথে যোগাযোগের সম্মতি প্রদান করছেন।
                </p>
                <Button
                  type="submit"
                  className="h-11 rounded-full px-8 text-white bg-[#4874c7] hover:bg-[#3a5da8] transition-all duration-200"
                >
                  বার্তা পাঠান
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
              <h4 className="text-lg font-semibold text-gray-900">যোগাযোগের তথ্য</h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <HiMail className="w-5 h-5 text-[#4874c7] mt-0.5" />
                  <span>support@etenderbd.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <HiPhone className="w-5 h-5 text-[#4874c7] mt-0.5" />
                  <span>+880 1XXX-XXXXXX</span>
                </li>
                <li className="flex items-start gap-2">
                  <HiLocationMarker className="w-5 h-5 text-[#4874c7] mt-0.5" />
                  <span>বনানী, ঢাকা-১২১৩</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
              <h4 className="text-lg font-semibold text-gray-900">সাপোর্ট সময়</h4>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <HiClock className="w-5 h-5 text-[#4874c7] mt-0.5" />
                  <span>শনি - বৃহস্পতি: সকাল ৯টা - রাত ৯টা</span>
                </div>
                <p>শুক্রবার: সকাল ১০টা - সন্ধ্যা ৬টা</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
              <h4 className="text-lg font-semibold text-gray-900">অফিস লোকেশন</h4>
              <p className="mt-2 text-sm text-gray-600">
                রোড ১২, হাউস ৭২, বনানী, ঢাকা
              </p>
              <div className="mt-4 rounded-xl border border-slate-200/70 bg-blue-50/60 p-4 text-sm text-slate-600">
                ম্যাপ ভিউয়ের জন্য এখানে একটি লোকেশন কার্ড দেখানো হবে।
              </div>
            </div>
          </div>
        </div>
      </section>

      {isSuccessOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsSuccessOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <svg
                className="success-icon h-10 w-10 text-emerald-500"
                viewBox="0 0 52 52"
                aria-hidden="true"
              >
                <circle
                  className="success-icon__circle"
                  cx="26"
                  cy="26"
                  r="23"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="success-icon__check"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 27.5l8 8 16-16"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">বার্তা পাঠানো হয়েছে</h3>
            <p className="mt-2 text-sm text-gray-600">
              বার্তা পাঠানো হয়েছে। আমরা খুব শীঘ্রই আপনার সাথে যোগাযোগ করব।
            </p>
            <Button
              type="button"
              className="mt-5 h-10 rounded-full px-6 text-white bg-[#4874c7] hover:bg-[#3a5da8] transition-all duration-200"
              onClick={() => setIsSuccessOpen(false)}
            >
              ঠিক আছে
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
