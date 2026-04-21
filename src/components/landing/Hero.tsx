// @ts-nocheck

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import LandingLoginBox from "./LandingLoginBox";

const slides = [
  {
    src: "/banner.jpeg",
    alt: "ইটেন্ডার বিডি ব্যানার",
    link: "/blogs",
  },
  {
    src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop",
    alt: "টেন্ডার রিপোর্ট ও বিশ্লেষণ",
  },
  {
    src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop",
    alt: "ব্যবসায়িক সহযোগিতা",
  },
  {
    src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
    alt: "ডকুমেন্ট ও নিরাপত্তা যাচাই",
  },
];

export default function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="w-full">
      {/* SEO H1 - visually hidden but available for search engines */}
      <h1 className="sr-only">Latest Bangladesh Government Tenders & e-GP Notices</h1>
      <div className="mx-auto py-10 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-6 mx-auto lg:flex-none lg:items-start">
            <div>
              <h2 className="text-gray-900">
                <span className="text-[#4874c7]">ইটেন্ডার বিডি</span>&apos;তে স্বাগতম
              </h2>
              <p className="mt-3 text-base text-gray-600">
                আপনার টেন্ডার ব্যবস্থাপনা এখন আরও সহজ, দ্রুত এবং কার্যকর
              </p>
            </div>
            <LandingLoginBox preview={false} />
          </div>
          <div className="lg:col-span-2 h-full flex items-start 2xl:items-end">
            <div className="rounded-2xl overflow-hidden shadow-2xl border w-full">
              <div className="relative">
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex">
                    {slides.map((slide, index) => (
                      <div key={slide.src} className="flex-[0_0_100%] min-w-0">
                        <div className="aspect-[16/10] bg-gray-100">
                          {slide.link ? (
                            <Link to={slide.link} className="block h-full w-full">
                              <img
                                src={slide.src}
                                alt={slide.alt}
                                className="h-full w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                loading={index === 0 ? "eager" : "lazy"}
                              />
                            </Link>
                          ) : (
                            <img
                              src={slide.src}
                              alt={slide.alt}
                              className="h-full w-full object-cover"
                              loading={index === 0 ? "eager" : "lazy"}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label="Previous slide"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 text-[#4874c7] shadow-md hover:bg-white transition p-2"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Next slide"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 text-[#4874c7] shadow-md hover:bg-white transition p-2"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={`dot-${index}`}
                      type="button"
                      aria-label={`Go to slide ${index + 1}`}
                      onClick={() => scrollTo(index)}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        index === selectedIndex
                          ? "bg-[#4874c7] shadow"
                          : "bg-white/70 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
