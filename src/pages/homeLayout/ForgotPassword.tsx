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
        <section className="min-h-lvh">
            <h1 className="text-3xl font-bold text-center my-5">Forgot Password</h1>
            <div className="flex justify-center items-center">
                <div className="w-full max-w-sm shadow-2xl p-3 md:p-5 rounded border">
                    <p className="text-sm text-gray-600 mb-4">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-2xl grid grid-cols-1 gap-5"
                    >
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                placeholder="Your Email Address"
                                className="mt-2"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="col-span-full">
                            <Button
                                type="submit"
                                className="w-full cursor-pointer h-11 text-white bg-[#4874c7] hover:bg-[#3a5da8] hover:scale-102 transition-all duration-200"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </div>
                    </form>

                    <p className="mt-4 text-sm text-center">
                        Remember your password?{" "}
                        <Link className="underline text-blue-600 hover:text-blue-800" to="/login">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;
