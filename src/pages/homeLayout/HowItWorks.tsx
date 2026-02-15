"use client"

import { FiArrowRight, FiCheckCircle, FiClock, FiFileText, FiShield, FiTrendingUp, FiUsers, FiZap } from "react-icons/fi"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function HowItWorks() {
    const features = [
        {
            icon: FiFileText,
            title: "টেন্ডার ডকুমেন্ট প্রস্তুতি",
            description: "অটোমেটিক ফর্ম ফিল-আপ এবং ডকুমেন্ট জেনারেশন। BOQ প্রস্তুতি, ক্যাপাসিটি হিসাব এবং সব ধরনের টেন্ডার ডকুমেন্ট এক ক্লিকে তৈরি করুন।"
        },
        {
            icon: FiZap,
            title: "দ্রুত টেন্ডার সাবমিশন",
            description: "LTM, OTM, OSTEM টেন্ডার অটো ড্রপ সুবিধা। সরকারি e-GP পোর্টালে সরাসরি সাবমিট করুন মাত্র কয়েক সেকেন্ডে।"
        },
        {
            icon: FiTrendingUp,
            title: "রেট অ্যানালাইসিস",
            description: "বুদ্ধিমান রেট বিশ্লেষণ সিস্টেম। বাজার দর, প্রতিযোগীদের রেট এবং আপনার ক্যাপাসিটি বিবেচনা করে সঠিক দর নির্ধারণ করুন।"
        },
        {
            icon: FiClock,
            title: "সময় সাশ্রয়",
            description: "টেন্ডার প্রস্তুতির ৯৫% সময় বাঁচান। ম্যানুয়াল কাজের পরিবর্তে অটোমেশন ব্যবহার করে দ্রুত কাজ সম্পন্ন করুন।"
        },
        {
            icon: FiShield,
            title: "নির্ভুলতা নিশ্চিত",
            description: "ম্যানুয়াল ভুল থেকে মুক্তি। অটোমেটেড সিস্টেম নিশ্চিত করে যে আপনার সব ডকুমেন্ট সঠিক এবং পেশাদার।"
        },
        {
            icon: FiUsers,
            title: "একাধিক কোম্পানি ম্যানেজমেন্ট",
            description: "একটি অ্যাকাউন্ট থেকে একাধিক কোম্পানি ম্যানেজ করুন। আলাদা আলাদা লগইনের প্রয়োজন নেই।"
        }
    ]

    const steps = [
        {
            number: "০১",
            title: "অ্যাকাউন্ট খুলুন",
            description: "সহজ রেজিস্ট্রেশন প্রক্রিয়ার মাধ্যমে আপনার অ্যাকাউন্ট তৈরি করুন। মাত্র কয়েক মিনিটেই সম্পন্ন হবে।",
            icon: FiCheckCircle
        },
        {
            number: "০২",
            title: "কোম্পানি রেজিস্ট্রেশন",
            description: "আপনার কোম্পানির তথ্য যোগ করুন এবং e-GP পোর্টালে মাইগ্রেশন সম্পন্ন করুন।",
            icon: FiFileText
        },
        {
            number: "০৩",
            title: "টেন্ডার খুঁজুন",
            description: "আপনার ব্যবসার উপযোগী টেন্ডার খুঁজুন। বিভাগ, ক্যাটাগরি বা জেলা অনুযায়ী ফিল্টার করুন।",
            icon: FiTrendingUp
        },
        {
            number: "০৪",
            title: "সার্ভিস অর্ডার করুন",
            description: "প্রয়োজনীয় সার্ভিস সিলেক্ট করুন এবং অর্ডার দিন। ওয়ালেট থেকে সহজ পেমেন্ট।",
            icon: FiZap
        },
        {
            number: "০৫",
            title: "ডকুমেন্ট ডাউনলোড",
            description: "অর্ডার সম্পন্ন হলে প্রস্তুত ডকুমেন্ট ডাউনলোড করুন। সরাসরি টেন্ডার সাবমিট করুন।",
            icon: FiCheckCircle
        },
        {
            number: "০৬",
            title: "ট্র্যাক করুন",
            description: "ড্যাশবোর্ড থেকে আপনার সব অর্ডার এবং টেন্ডার স্ট্যাটাস ট্র্যাক করুন।",
            icon: FiClock
        }
    ]

    const benefits = [
        "সম্পূর্ণ টেন্ডার ডেটা — নোটিস + ডেটা শীট + অ্যাটাচমেন্ট একসাথে",
        "অটোমেটেড ফর্ম ফিল-আপ এবং BOQ রেট অ্যানালাইসিস",
        "অথরাইজ লেটার এবং ব্যাংক ক্রেডিট লেটার অটো জেনারেশন",
        "SMS, WhatsApp এবং Email এর মাধ্যমে রিয়েলটাইম নোটিফিকেশন",
        "কন্ট্রাক্টর ড্যাশবোর্ড — হিস্ট্রি, রিপোর্ট এবং উইনিং ইনসাইটস",
        "বাংলা ভয়েস সাপোর্টসহ AI FAQ বট",
        "সাশ্রয়ী মাসিক ফি — মাত্র ৩০০–৫০০ টাকা"
    ]

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#4874c7]/5 via-white to-[#4874c7]/10">
                <div className="container mx-auto px-4 py-16 lg:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-sm font-semibold uppercase tracking-wide text-[#4874c7] animate-fade-in">
                            এটি কিভাবে কাজ করে
                        </p>
                        <h2 className="mt-4 text-gray-900 animate-slide-up">
                            ই-টেন্ডার বিডি — আপনার টেন্ডার সফলতার স্মার্ট পার্টনার
                        </h2>
                        <p className="mt-6 text-lg text-gray-600 animate-slide-up" style={{ animationDelay: "100ms" }}>
                            সরকারি টেন্ডার প্রক্রিয়াকে সহজ, দ্রুত এবং নির্ভুল করে তোলার জন্য তৈরি করা হয়েছে।
                            আমাদের অটোমেটেড সিস্টেম আপনার ৯৫% সময় বাঁচিয়ে দেয় এবং ভুলের ঝুঁকি কমিয়ে দেয়।
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "200ms" }}>
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

            {/* What We Do Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <p className="text-sm font-semibold uppercase tracking-wide text-[#4874c7]">
                            আমাদের সেবা
                        </p>
                        <h2 className="mt-4 text-gray-900">
                            আমরা কী করি?
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            ই-টেন্ডার বিডি ঠিকাদারদের জন্য একটি সম্পূর্ণ অটোমেটেড প্ল্যাটফর্ম।
                            টেন্ডার আবিষ্কার থেকে শুরু করে ডকুমেন্ট প্রস্তুতি এবং সাবমিশন — সবকিছু এক জায়গায়।
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <div
                                    key={feature.title}
                                    className="group rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#4874c7]/10 text-[#4874c7] group-hover:bg-[#4874c7] group-hover:text-white transition-all duration-300">
                                            <Icon className="h-6 w-6" />
                                        </span>
                                        <div className="flex-1">
                                            <h3 className="text-gray-900 group-hover:text-[#4874c7] transition-colors">
                                                {feature.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works Steps */}
            <section className="py-16 lg:py-24 bg-gradient-to-br from-[#4874c7]/5 via-white to-[#4874c7]/10">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <p className="text-sm font-semibold uppercase tracking-wide text-[#4874c7]">
                            সহজ ধাপ
                        </p>
                        <h2 className="mt-4 text-gray-900">
                            কীভাবে ব্যবহার করবেন?
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            মাত্র কয়েকটি সহজ ধাপে পুরো টেন্ডার প্রক্রিয়া সম্পন্ন করুন।
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="relative">
                            {/* Connection Line */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#4874c7]/50 via-[#4874c7] to-[#4874c7]/50 hidden lg:block" />

                            {steps.map((step, index) => {
                                const Icon = step.icon
                                return (
                                    <div
                                        key={step.number}
                                        className="relative flex gap-6 pb-12 last:pb-0 animate-slide-up"
                                        style={{ animationDelay: `${index * 150}ms` }}
                                    >
                                        {/* Step Number/Icon */}
                                        <div className="relative z-10 flex-shrink-0">
                                            <div className="h-16 w-16 rounded-2xl bg-[#4874c7] text-white flex items-center justify-center shadow-lg shadow-[#4874c7]/30">
                                                <Icon className="h-8 w-8" />
                                            </div>
                                        </div>

                                        {/* Step Content */}
                                        <div className="flex-1 pt-2">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl font-bold text-[#4874c7]/30">
                                                    {step.number}
                                                </span>
                                            </div>
                                            <h2 className="text-gray-900 mb-2">
                                                {step.title}
                                            </h2>
                                            <p className="text-gray-600 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <p className="text-sm font-semibold uppercase tracking-wide text-[#4874c7]">
                            কেন আমাদের বেছে নেবেন?
                        </p>
                        <h2 className="mt-4 text-gray-900">
                            আপনার সুবিধা
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            প্রতিযোগীদের তুলনায় আমরা দিচ্ছি বেশি ফিচার, বেশি অটোমেশন এবং দ্রুত সাপোর্ট।
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-[#4874c7]/5 p-8 shadow-xl">
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-white/80 hover:bg-[#4874c7]/5 transition-all duration-300 animate-fade-in"
                                        style={{ animationDelay: `${index * 80}ms` }}
                                    >
                                        <span className="flex-shrink-0 mt-0.5">
                                            <FiCheckCircle className="h-6 w-6 text-[#4874c7]" />
                                        </span>
                                        <p className="text-gray-700 leading-relaxed">
                                            {benefit}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-24 bg-gradient-to-r from-[#4874c7] to-[#3a5da8]">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-white mb-6">
                            আজই শুরু করুন আপনার টেন্ডার সফলতার যাত্রা
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            সরকারি টেন্ডারে অংশগ্রহণ করা এখন আরও সহজ।
                            ই-টেন্ডার বিডি আপনার প্রতিটি ধাপে সাথে আছে।
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                asChild
                                className="h-14 px-10 text-base bg-white text-[#4874c7] hover:bg-gray-50 hover:scale-105 transition-all duration-200 font-semibold"
                            >
                                <Link to="/registration" className="flex items-center gap-2">
                                    অ্যাকাউন্ট খুলুন
                                    <FiArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="h-14 px-10 text-base border-2 border-white hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-200 font-semibold"
                            >
                                <Link to="/contact-us">যোগাযোগ করুন</Link>
                            </Button>
                        </div>
                        <p className="mt-6 text-sm text-white/70">
                            মাসিক ফি মাত্র ৩০০–৫০০ টাকা • যেকোনো সময় বাতিল করতে পারবেন
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
