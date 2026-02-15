// @ts-nocheck

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "@/lib/authService";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        const toastId = toast.loading("Sending reset link...");
        setIsSubmitting(true);

        try {
            const response = await forgotPassword(email);

            toast.dismiss(toastId);
            toast.success(response.message || "Reset link sent to your email");

            // Clear form
            setEmail("");

            // Redirect to login after a short delay
            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (error) {
            toast.dismiss(toastId);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to send reset link. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="min-h-lvh py-10">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#4874c7] animate-fade-in">
                        পাসওয়ার্ড পুনরুদ্ধার
                    </p>
                    <h2 className="mt-2 text-gray-900 animate-slide-up">পাসওয়ার্ড ভুলে গেছেন?</h2>
                    <p className="mt-3 text-base text-gray-600 animate-slide-up" style={{ animationDelay: "100ms" }}>
                        আপনার ইমেইল ঠিকানা দিন এবং আমরা আপনাকে পাসওয়ার্ড রিসেট লিঙ্ক পাঠাবো
                    </p>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <div className="w-full max-w-md shadow-2xl p-6 md:p-8 rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-sm">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full grid grid-cols-1 gap-5"
                    >
                        <div>
                            <Label htmlFor="email" className="text-sm font-medium">ইমেইল ঠিকানা</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                placeholder="example@yourmail.com"
                                className="mt-2 h-11"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="col-span-full">
                            <Button
                                type="submit"
                                className="w-full cursor-pointer h-11 text-white bg-[#4874c7] hover:bg-[#3a5da8] hover:scale-102 transition-all duration-200"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "পাঠানো হচ্ছে..." : "রিসেট লিঙ্ক পাঠান"}
                            </Button>
                        </div>
                    </form>

                    <p className="mt-4 text-sm text-center">
                        পাসওয়ার্ড মনে আছে?{" "}
                        <Link className="underline text-[#4874c7] hover:text-[#3a5da8]" to="/login">
                            লগইনে ফিরে যান
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;
