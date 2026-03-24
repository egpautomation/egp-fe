// @ts-nocheck
// Reusable login box: preview mode (non-submitting) for landing, functional mode for /login route

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "@/provider/AuthProvider";
import toast from "react-hot-toast";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';

interface LandingLoginBoxProps {
  preview?: boolean; // If true, shows preview mode (non-submitting), if false, fully functional
  onSubmit?: (email: string, password: string) => Promise<void>;
}

export default function LandingLoginBox({ preview = true, onSubmit }: LandingLoginBoxProps) {
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (preview) return;
    
    setIsLoading(true);
    const toastId = toast.loading("Logging in with Google...");
    
    try {
      let result;
      // credentialResponse contains `credential` which is the id_token
      if (credentialResponse.credential) {
         result = await googleLogin(credentialResponse.credential);
      } else if (credentialResponse.access_token) {
         // Fallback if the implicit flow returns access_token
         result = await googleLogin(credentialResponse.access_token);
      }

      toast.dismiss(toastId);
      toast.success("Successfully Logged In with Google");

      // If this is the first Google login, redirect to the onboarding page
      // to collect the missing fields (phone, WhatsApp, district, etc.)
      if (result?.onboardingRequired) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
       toast.dismiss(toastId);
       const errorMessage = error?.response?.data?.message || error?.message || "Google Login failed.";
       toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      if (!preview) toast.error("Google Login Failed");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (preview) return;

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    if (onSubmit) {
      try {
        await onSubmit(formData.email, formData.password);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const toastId = toast.loading("Logging in...");

    try {
      await login(formData.email, formData.password);
      toast.dismiss(toastId);
      toast.success("Successfully Logged In");
      navigate("/dashboard");
    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage = error?.response?.data?.message || error?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
              disabled={preview || isLoading}
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
                disabled={preview || isLoading}
                value={formData.password}
                onChange={handleInputChange}
              />
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
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="font-medium text-[#4874c7] hover:underline">
              Forget Password?
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
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            )}
          </div>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="flex w-full justify-center">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 flex items-center justify-center gap-2"
              onClick={() => {
                if (!preview) signInWithGoogle();
              }}
              disabled={isLoading}
            >
              <FcGoogle className="w-5 h-5" />
              Sign in with Google
            </Button>
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
