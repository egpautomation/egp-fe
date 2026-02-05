// @ts-nocheck

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "@/lib/authService";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState("");
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        // Extract token from URL query parameter
        const tokenFromUrl = searchParams.get("token");
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            toast.error("Invalid reset link. Please request a new one.");
        }
    }, [searchParams]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid reset token. Please request a new reset link.");
            return;
        }

        if (!formData.newPassword || !formData.confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const toastId = toast.loading("Resetting password...");
        setIsSubmitting(true);

        try {
            const response = await resetPassword(token, formData.newPassword);

            toast.dismiss(toastId);
            toast.success(response.message || "Password reset successfully! Redirecting to login...");

            // Clear form
            setFormData({
                newPassword: "",
                confirmPassword: "",
            });

            // Redirect to login page after success
            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (error) {
            toast.dismiss(toastId);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to reset password. Please try again or request a new reset link.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="min-h-lvh">
            <h1 className="text-3xl font-bold text-center my-5">Reset Password</h1>
            <div className="flex justify-center items-center">
                <div className="w-full max-w-sm shadow-2xl p-3 md:p-5 rounded border">
                    <p className="text-sm text-gray-600 mb-4">
                        Enter your new password below.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-2xl grid grid-cols-1 gap-5"
                    >
                        <div>
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    id="newPassword"
                                    onChange={handleInputChange}
                                    value={formData.newPassword}
                                    placeholder="Enter new password"
                                    className="mt-2 pr-10"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-1 text-gray-500 hover:text-gray-700"
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    onChange={handleInputChange}
                                    value={formData.confirmPassword}
                                    placeholder="Confirm new password"
                                    className="mt-2 pr-10"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-1 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <Button
                                type="submit"
                                className="w-full cursor-pointer"
                                disabled={isSubmitting || !token}
                            >
                                {isSubmitting ? "Resetting..." : "Reset Password"}
                            </Button>
                        </div>
                    </form>

                    <p className="mt-4 text-sm text-center">
                        Remember your password?{" "}
                        <Link className="underline text-blue-600 hover:text-blue-800" to="/">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
