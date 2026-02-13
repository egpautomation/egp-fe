// @ts-nocheck
// Landing-only login card: links to /login and /registration, no form submit.

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LandingLoginBox() {
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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              ইমেইল
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@yourmail.com"
              className="h-11"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              পাসওয়ার্ড
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-11"
              disabled
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="font-medium text-[#4874c7] hover:underline">
              Forget Password
            </Link>
          </div>
          <div className="flex w-full justify-center">
            <Button asChild className="h-11 w-[50%] text-white bg-[#4874c7] hover:bg-[#3a5da8] hover:scale-102 transition-all duration-200">
              <Link to="/login">Login</Link>
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
        </div>
      </CardContent>
    </Card>
  );
}
