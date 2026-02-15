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
import { Check, ChevronsUpDown } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import districts from "@/utils/districts";

import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import toast from "react-hot-toast";

function Registration() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    district: "",
    address: "",
    phone: "",
    whatsApp: "",
    email: "",
    password: "",
  });
  const [generatedUserId, setGeneratedUserId] = useState("");

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.district) {
      toast.error("Please select a district.");
      return;
    }

    const toastId = toast.loading("Creating account...");

    const registrationData = {
      ...formData,
      userId: Number(generatedUserId),
    };

    try {
      await register(registrationData);
      
      toast.dismiss(toastId);
      toast.success("Registration successful! Welcome!");
      navigate("/dashboard/at-a-glance");
    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage = error?.response?.data?.message || error?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="min-h-lvh py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#4874c7] animate-fade-in">
            রেজিস্ট্রেশন
          </p>
          <h2 className="mt-2 text-gray-900 animate-slide-up">নতুন অ্যাকাউন্ট তৈরি করুন</h2>
          <p className="mt-3 text-base text-gray-600 animate-slide-up" style={{ animationDelay: "100ms" }}>
            ই-টেন্ডার বিডি-তে যোগ দিন এবং আপনার টেন্ডার ব্যবস্থাপনা শুরু করুন
          </p>
        </div>
      </div>
      <div className=" flex justify-center items-center">
        <div className="w-full max-w-xl shadow-2xl p-3 md:p-5 rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="">
              <Label htmlFor="name" className="text-sm font-medium">
                পূর্ণ নাম<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="name"
                onChange={handleInputChange}
                value={formData.name}
                placeholder="আপনার পূর্ণ নাম"
                className="mt-2 h-11"
                required
              />
            </div>
            <div className="">
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
                    {value
                      ? districts.find((district) => district === value)
                      : "Select District..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search framework..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
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

                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            {district}
                            <Check
                              className={cn(
                                "ml-auto",
                                value === district ? "opacity-100" : "opacity-0"
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
            <div className="col-span-full">
              <Label htmlFor="presentAddress" className="text-sm font-medium">বর্তমান ঠিকানা</Label>
              <Input
                type="text"
                name="address"
                onChange={handleInputChange}
                value={formData.address}
                placeholder="আপনার বর্তমান ঠিকানা"
                className="mt-2 h-11"
              />
            </div>

            <div className="">
              <Label className="mb-2 text-sm font-medium" htmlFor="phoneNumber">
                সক্রিয় যোগাযোগ নম্বর<span className="text-red-700">*</span>
              </Label>
              <PhoneInput
                required
                defaultCountry="bd"
                name="phoneNumber"
                onChange={(value) => {
                  const modifiedValue = value ? value.replace(/\+/g, "") : "";
                  setFormData((prev) => ({
                    ...prev,
                    phone: modifiedValue,
                  }));
                  setGeneratedUserId(
                    modifiedValue ? modifiedValue.slice(-5) : ""
                  );
                }}
                value={formData.phone}
                inputStyle={{
                  width: "100%", // Set a fixed width
                }}
                countrySelectorStyleProps={{
                  buttonStyle: {
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  },
                }}
              />
            </div>
            <div className="">
              <Label className="mb-2 text-sm font-medium" htmlFor="What's app number">
                সক্রিয় WhatsApp নম্বর<span className="text-red-700">*</span>
              </Label>

              <PhoneInput
                required
                defaultCountry="bd"
                name="whatsApp"
                onChange={(value) => {
                  const modifiedValue = value ? value.replace(/\+/g, "") : "";
                  setFormData((prev) => ({
                    ...prev,
                    whatsApp: modifiedValue,
                  }));
                }}
                value={formData.whatsApp}
                inputStyle={{
                  width: "100%", // Set a fixed width
                }}
                countrySelectorStyleProps={{
                  buttonStyle: {
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  },
                }}
              />
            </div>
            <div className="">
              <Label htmlFor="Email" className="text-sm font-medium">
                ইমেইল<span className="text-red-700">*</span>
              </Label>
              <Input
                required
                type="email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                placeholder="example@yourmail.com"
                className="mt-2 h-11"
              />
            </div>
            <div className="">
              <Label htmlFor="userPassword" className="text-sm font-medium">
                পাসওয়ার্ড<span className="text-red-700">*</span>
              </Label>
              <Input
                required
                type="password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                placeholder="একটি শক্তিশালী পাসওয়ার্ড ব্যবহার করুন"
                className="mt-2 h-11"
              />
            </div>
            <div className="">
              <Label htmlFor="userID" className="text-sm font-medium">
                User ID<span className="text-red-700">*</span>
              </Label>

              <Input
                required
                type="text"
                name="uerId"
                onChange={handleInputChange}
                value={generatedUserId}
                placeholder="আপনার ফোন নম্বরের শেষ ৫টি সংখ্যা"
                className="mt-2 h-11"
                readOnly
              />
            </div>

            <div className="col-span-full">
              <Button type="submit" className="w-full cursor-pointer h-11 text-white bg-[#4874c7] hover:bg-[#3a5da8] hover:scale-102 transition-all duration-200">
                রেজিস্ট্রেশন করুন
              </Button>
            </div>
          </form>
          <p className="mt-4 text-sm text-center">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link className="underline text-[#4874c7] hover:text-[#3a5da8]" to={"/login"}>
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Registration;
