// @ts-nocheck

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AuthContext } from "@/provider/AuthProvider";
import { Check, ChevronsUpDown, Eye, EyeOff } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import districts from "@/utils/districts";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import toast from "react-hot-toast";
import * as authService from "@/lib/authService";

/**
 * GoogleOnboarding – collects all required registration fields after first Google sign-in.
 * Email is pre-filled (from Google). Password is optional but recommended so users
 * can also log in with email+password in the future.
 */
function GoogleOnboarding() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    district: "",
    address: "",
    phone: "",
    whatsApp: "",
    password: "",
  });
  const [generatedUserId, setGeneratedUserId] = useState("");
  const [open, setOpen] = useState(false);
  const [districtValue, setDistrictValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.district) {
      toast.error("অনুগ্রহ করে জেলা নির্বাচন করুন।");
      return;
    }
    if (!formData.phone) {
      toast.error("অনুগ্রহ করে ফোন নম্বর দিন।");
      return;
    }
    if (!formData.whatsApp) {
      toast.error("অনুগ্রহ করে WhatsApp নম্বর দিন।");
      return;
    }
    if (formData.password && formData.password.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ সংখ্যার হতে হবে।");
      return;
    }

    const toastId = toast.loading("প্রোফাইল সম্পন্ন করা হচ্ছে...");
    setIsLoading(true);

    try {
      const payload = {
        phone: formData.phone,
        whatsApp: formData.whatsApp,
        district: formData.district,
        address: formData.address || undefined,
      };

      // Only include password if user filled it in
      if (formData.password) {
        payload.password = formData.password;
      }

      const result = await authService.completeProfile(payload);

      if (result.data) {
        setUser(result.data);
      }

      toast.dismiss(toastId);
      toast.success("প্রোফাইল সম্পন্ন হয়েছে! স্বাগতম!");
      navigate("/dashboard/at-a-glance");
    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "প্রোফাইল সম্পন্ন করতে ব্যর্থ হয়েছে।";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-lvh py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#4874c7] animate-fade-in">
            প্রোফাইল সম্পন্ন করুন
          </p>
          <h2 className="mt-2 text-gray-900 animate-slide-up">
            কিছু তথ্য প্রয়োজন
          </h2>
          <p
            className="mt-3 text-base text-gray-600 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Google দিয়ে সাইন আপ করতে নিচের তথ্যগুলো পূরণ করুন
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-full max-w-xl shadow-2xl p-3 md:p-5 rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Email – pre-filled from Google, read-only */}
            <div className="col-span-full">
              <Label htmlFor="email" className="text-sm font-medium">
                ইমেইল<span className="text-red-700">*</span>
              </Label>
              <Input
                type="email"
                id="email"
                value={user?.email || ""}
                className="mt-2 h-11 bg-gray-50 text-gray-500 cursor-not-allowed"
                readOnly
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">Google থেকে স্বয়ংক্রিয়ভাবে নেওয়া হয়েছে</p>
            </div>

            {/* District */}
            <div>
              <Label htmlFor="district" className="text-sm font-medium">
                জেলা (LTM Tender)<span className="text-red-700">*</span>
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full mt-2 justify-between"
                  >
                    {districtValue
                      ? districts.find((d) => d === districtValue)
                      : "Select District..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="জেলা খুঁজুন..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>পাওয়া যায়নি।</CommandEmpty>
                      <CommandGroup>
                        {districts.map((district, idx) => (
                          <CommandItem
                            key={idx}
                            value={district}
                            onSelect={(currentValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                district: currentValue,
                              }));
                              setDistrictValue(
                                currentValue === districtValue ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            {district}
                            <Check
                              className={cn(
                                "ml-auto",
                                districtValue === district ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                বর্তমান ঠিকানা
              </Label>
              <Input
                type="text"
                name="address"
                onChange={handleInputChange}
                value={formData.address}
                placeholder="আপনার বর্তমান ঠিকানা"
                className="mt-2 h-11"
              />
            </div>

            {/* Phone */}
            <div>
              <Label className="mb-2 text-sm font-medium" htmlFor="phone">
                সক্রিয় যোগাযোগ নম্বর<span className="text-red-700">*</span>
              </Label>
              <PhoneInput
                required
                defaultCountry="bd"
                name="phone"
                onChange={(value) => {
                  const modifiedValue = value ? value.replace(/\+/g, "") : "";
                  setFormData((prev) => ({ ...prev, phone: modifiedValue }));
                  setGeneratedUserId(modifiedValue ? modifiedValue.slice(-5) : "");
                }}
                value={formData.phone}
                inputStyle={{ width: "100%" }}
                countrySelectorStyleProps={{
                  buttonStyle: { paddingLeft: "10px", paddingRight: "10px" },
                }}
              />
            </div>

            {/* WhatsApp */}
            <div>
              <Label className="mb-2 text-sm font-medium" htmlFor="whatsApp">
                সক্রিয় WhatsApp নম্বর<span className="text-red-700">*</span>
              </Label>
              <PhoneInput
                required
                defaultCountry="bd"
                name="whatsApp"
                onChange={(value) => {
                  const modifiedValue = value ? value.replace(/\+/g, "") : "";
                  setFormData((prev) => ({ ...prev, whatsApp: modifiedValue }));
                }}
                value={formData.whatsApp}
                inputStyle={{ width: "100%" }}
                countrySelectorStyleProps={{
                  buttonStyle: { paddingLeft: "10px", paddingRight: "10px" },
                }}
              />
            </div>

            {/* Password – optional, allows future email/password login */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                পাসওয়ার্ড
                <span className="ml-1 text-xs text-gray-400 font-normal">(ঐচ্ছিক)</span>
              </Label>
              <div className="relative mt-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                  placeholder="ভবিষ্যতে ইমেইল+পাসওয়ার্ড দিয়ে লগইনের জন্য"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Auto-generated User ID */}
            <div>
              <Label htmlFor="userId" className="text-sm font-medium">
                User ID<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                value={generatedUserId}
                placeholder="ফোন নম্বর দিলে স্বয়ংক্রিয়ভাবে তৈরি হবে"
                className="mt-2 h-11"
                readOnly
              />
            </div>

            <div className="col-span-full">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer h-11 text-white bg-[#4874c7] hover:bg-[#3a5da8] hover:scale-102 transition-all duration-200"
              >
                {isLoading ? "সম্পন্ন করা হচ্ছে..." : "প্রোফাইল সম্পন্ন করুন"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default GoogleOnboarding;
