// @ts-nocheck

import { useEffect, useState } from "react";

const TenderStatsSection = () => {
  const [counts, setCounts] = useState({
    LTM: "00",
    OTM: "00",
    OSTETM: "00",
    total: "00",
    others:"00"
  });

  useEffect(() => {
    fetch("https://egpserver.jubairahmad.com/api/v1/tenders/tender-method-counts")
      .then((res) => res.json())
      .then((data) => {
        setCounts(data?.data);
      });
  }, []);
  return (
    <div>
      <div className="grid grid-cols-3 gap-5 py-5 items-center">
        <div className="col-span-3 md:col-span-2 p-3 md:p-5">
          <h1 className="text-2xl font-semibold">
            Welcome To Egp Tender Automation
          </h1>
          <p className="mt-3 text-sm">
            বর্তমান সময়ে সরকারি টেন্ডার প্রক্রিয়া বিশেষ করে এলটিএম (LTM)
            টেন্ডারগুলোতে অংশগ্রহণ করা যেমন সময়সাপেক্ষ, তেমনি তথ্য উপস্থাপনের
            ঝামেলাও অনেক। এই পুরো প্রক্রিয়াকে সহজ ও দ্রুত করতে আমরা এনেছি "LTM
            টেন্ডার প্রসেসিং অটোমেশন সার্ভিস" – যেখানে শুধুমাত্র প্রয়োজনীয়
            তথ্য প্রদান করলেই সফটওয়্যার স্বয়ংক্রিয়ভাবে আপনার টেন্ডার ফরম পূরণ
            করবে, অর্ডার সাবমিট করবে এবং আপনাকে আপডেট জানাবে।
          </p>
          <p className="mt-3 text-sm">
            এই সার্ভিসটি মূলত তাদের জন্য যারা প্রতিদিনের ই-জিপি টেন্ডার
            প্রক্রিয়ার ভেতরেই কাজ করে, কিন্তু সময়, দক্ষ লোকবল বা
            প্রক্রিয়াজনিত জটিলতার কারণে বারবার সমস্যায় পড়েন। আমাদের এই
            ডিজিটাল সেবা সেই সমস্যার একটি প্রফেশনাল সমাধান।
          </p>
        </div>
        <div className="col-span-3 md:col-span-1">
          <div className="p-3 md:p-5 rounded-md bg-blue-400 text-white flex flex-col w-full gap-3 justify-center">
            <p className="text-[12px] lg:text-base">TRY OUR SERVICE</p>
            <p className="text-xl lg:text-3xl">SEND REQUEST</p>
            <p className="text-[12px] lg:text-base">10 NOS TENDER FREE</p>
          </div>
        </div>
      </div>

      <div className="my-10 grid lg:grid-cols-2 gap-5 items-center">
        <div className="col-span-2 lg:col-span-1">
          <img src="/liveTender.jpeg" alt="" className="w-full h-full" />
        </div>
        <div className="col-span-2 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 md:p-5 rounded-md bg-blue-500 text-white flex flex-col gap-2 justify-center">
            <p className="text-[12px] lg:text-base">LTM TENDERS</p>
            <p className="text-xl lg:text-3xl">{counts?.LTM}</p>
            <p className="text-[12px] lg:text-base">TODAYS LIVE TENDERS</p>
          </div>
          <div className="p-3 md:p-5 rounded-md bg-violet-800 text-white flex flex-col gap-2 justify-center">
            <p className="text-[12px] lg:text-base">OTM TENDERS</p>
            <p className="text-xl lg:text-3xl">{counts?.OTM}</p>
            <p className="text-[12px] lg:text-base">TODAYS LIVE TENDERS</p>
          </div>
          <div className="p-3 md:p-5 rounded-md bg-purple-600 text-white flex flex-col gap-2 justify-center">
            <p className="text-[12px] lg:text-base">OSTETM TENDERS</p>
            <p className="text-xl lg:text-3xl">{counts?.OSTETM}</p>
            <p className="text-[12px] lg:text-base">TODAYS LIVE TENDERS</p>
          </div>
          <div className="p-3 md:p-5 rounded-md bg-pink-700 text-white flex flex-col gap-2 justify-center">
            <p className="text-[12px] lg:text-base">OTHER TENDERS</p>
            <p className="text-xl lg:text-3xl">{counts?.others}</p>
            <p className="text-[12px] lg:text-base">TODAYS LIVE TENDERS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderStatsSection;
