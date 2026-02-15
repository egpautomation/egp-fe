// @ts-nocheck
// Reusable login box: preview mode (non-submitting) for landing, functional mode for /login route

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface LandingLoginBoxProps {
  preview?: boolean; // If true, shows preview mode (non-submitting), if false, fully functional
  onSubmit?: (email: string, password: string) => Promise<void>;
}

export default function LandingLoginBox({ preview = true, onSubmit }: LandingLoginBoxProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (preview || !onSubmit) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData.email, formData.password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-2xl w-full min-[515px]:w-[480px] lg:w-full border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-bold text-[#4874c7]">
          লগইন করুন
        </CardTitle>
        <CardDescription className="text-sm">
          আপনার অ্যাকাউন্টে প্রবেশ করুন এবং টেন্ডার ব্যবস্থাপনা শুরু করুন
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              ইমেইল
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@yourmail.com"
              className="h-11"
              disabled={preview || isSubmitting}
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              পাসওয়ার্ড
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-11 pr-10"
                disabled={preview || isSubmitting}
                value={formData.password}
                onChange={handleInputChange}
              />
              {!preview && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link to="/forget-password" className="font-medium text-[#4874c7] hover:underline">
              Forget Password
            </Link>
          </div>
          <div className="flex w-full justify-center">
            {preview ? (
              <Button asChild className="h-11 w-[50%] text-white bg-[#4874c7] hover:bg-[#3a5da8] hover:scale-102 transition-all duration-200">
                <Link to="/login">Login</Link>
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="h-11 w-[50%] text-white bg-[#4874c7] hover:bg-[#3a5da8] hover:scale-102 transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            )}
          </div>
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              অ্যাকাউন্ট নেই?{" "}
              <Link to="/registration" className="font-semibold underline text-[#4874c7] hover:underline">
                রেজিস্ট্রেশন করুন
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
