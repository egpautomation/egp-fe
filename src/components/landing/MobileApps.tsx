// @ts-nocheck

import { Link } from "react-router-dom";

export default function MobileApps() {
  return (
    <div className="w-full">
      <div className="mx-auto py-10 lg:py-16">
        <div>
          <h2 className="max-w-3xl mx-auto text-center mb-8 text-gray-900">
            আমাদের ইটেন্ডার বিডি আপ্পসে আপনার টেন্ডার ব্যবস্থাপনা হবে সহজ, দ্রুত এবং কার্যকর
          </h2>
        </div>
        <div className="flex justify-center mb-8">
          <div className="bg-white p-2 rounded-md border border-[#4874C7]">
            <img
              src="/landing/app-qr.svg"
              alt="Mobile Apps"
              className="h-20 w-full max-w-md"
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/#appStore"
            className="flex w-[190px] items-center gap-3 rounded-full bg-[#111111] px-5 py-2.5 text-white shadow-md"
            aria-label="Download on the App Store"
          >
            <img src="/landing/apple-icon.svg" alt="" className="h-7 w-7" />
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-wide text-white/80">Download on the</p>
              <p className="text-base text-white font-semibold">App Store</p>
            </div>
          </Link>
          <Link
            to="/#playStore"
            className="flex w-[190px] items-center gap-3 rounded-full bg-[#111111] px-5 py-2.5 text-white shadow-md"
            aria-label="Get it on Google Play"
          >
            <img src="/landing/playstore-icon.svg" alt="" className="h-7 w-7" />
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-wide text-white/80">Get it on</p>
              <p className="text-base text-white font-semibold">Google Play</p>
            </div>
          </Link>
        </div>

        <div className="mt-12 hidden lg:block">
          <div className="relative mx-auto h-[360px] lg:h-[550px] max-w-4xl">
            <img
              src="/landing/iphone-frame.png"
              alt="Mobile app preview"
              className="absolute left-32 bottom-0 w-[24%] max-w-[200px] -rotate-6 origin-bottom-left drop-shadow-2xl"
              loading="lazy"
            />
            <img
              src="/landing/iphone-frame.png"
              alt="Mobile app preview"
              className="absolute left-1/2 z-10 bottom-0 w-[30%] max-w-[240px] -translate-x-1/2 drop-shadow-2xl"
              loading="lazy"
            />
            <img
              src="/landing/iphone-frame.png"
              alt="Mobile app preview"
              className="absolute right-32 bottom-0 w-[24%] max-w-[200px] rotate-6 origin-bottom-right drop-shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>

        <div className="mt-10 lg:hidden">
          <div className="relative mx-auto h-[380px] max-w-sm">
            <img
              src="/landing/iphone-frame.png"
              alt="Mobile app preview"
              className="absolute left-0 bottom-0 w-[38%] -rotate-6 origin-bottom-left drop-shadow-xl"
              loading="lazy"
            />
            <img
              src="/landing/iphone-frame.png"
              alt="Mobile app preview"
              className="absolute left-1/2 z-10 bottom-0 w-[48%] -translate-x-1/2 drop-shadow-xl"
              loading="lazy"
            />
            <img
              src="/landing/iphone-frame.png"
              alt="Mobile app preview"
              className="absolute right-0 bottom-0 w-[38%] rotate-6 origin-bottom-right drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
