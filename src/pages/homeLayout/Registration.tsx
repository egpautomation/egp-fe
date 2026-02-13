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
    <section className="min-h-lvh">
      <h1 className="text-3xl font-bold text-center my-5">Sign Up</h1>
      <div className=" flex justify-center items-center">
        <div className="w-full max-w-xl shadow-2xl p-3 md:p-5 rounded border">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="">
              <Label htmlFor="name">
                Full Name<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="name"
                onChange={handleInputChange}
                value={formData.name}
                placeholder="Your Full Name"
                className="mt-2"
                required
              />
            </div>
            <div className="">
              <Label htmlFor="district">
                District (LTM Tender)<span className="text-red-700">*</span>
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
              <Label htmlFor="presentAddress">Present Address</Label>
              <Input
                type="text"
                name="address"
                onChange={handleInputChange}
                value={formData.address}
                placeholder="Your Present Address"
                className="mt-2 h-14"
              />
            </div>

            <div className="">
              <Label className="mb-2" htmlFor="phoneNumber">
                Active Contact Number<span className="text-red-700">*</span>
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
              />
            </div>
            <div className="">
              <Label className="mb-2" htmlFor="What's app number">
                Active What's App Number<span className="text-red-700">*</span>
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
              />
            </div>
            <div className="">
              <Label htmlFor="Email">
                Email<span className="text-red-700">*</span>
              </Label>
              <Input
                required
                type="text"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                placeholder="Your Email Address"
                className="mt-2"
              />
            </div>
            <div className="">
              <Label htmlFor="userPassword">
                Password<span className="text-red-700">*</span>
              </Label>
              <Input
                required
                type="text"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                placeholder="Use A strong Password"
                className="mt-2"
              />
            </div>
            <div className="">
              <Label htmlFor="userID">
                User ID<span className="text-red-700">*</span>
              </Label>

              <Input
                required
                type="text"
                name="uerId"
                onChange={handleInputChange}
                value={generatedUserId}
                placeholder="Last 5 digit of your phone number"
                className="mt-2"
                readOnly
              />
            </div>

            <div className="col-span-full">
              <Button type="submit" className="w-full cursor-pointer">
                Submit
              </Button>
            </div>
          </form>
          <p className="mt-4 text-sm">
            Already Have account?{" "}
            <Link className="underline" to={"/login"}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Registration;
