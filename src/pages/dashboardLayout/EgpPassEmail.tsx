// @ts-nocheck

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import "react-international-phone/style.css";

function EgpPassEmail() {
  const [egpEmailError, setEgpEmailError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState({
    egpEmail: "",
    companyName: "",
    password: "",
    lastUsePassDate: "",
    remarks: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "egpEmail") {
      const startsWithCapital = /^[A-Z]/.test(value);
      const containsUpperCase = /[A-Z]/.test(value);
      const missingDotCom = !/\.com$/.test(value);

      if (startsWithCapital) {
        setEgpEmailError("Email should not start with a capital letter.");
      } else if (containsUpperCase) {
        setEgpEmailError("Email should not contain uppercase letters.");
      } else if (missingDotCom) {
        setEgpEmailError("Email must end with '.com'.");
      } else {
        setEgpEmailError("");
        setIsDisabled(false);
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <section className="min-h-lvh">
      <h1 className="text-3xl font-bold text-center my-5">Egp Pass Email</h1>
      <div className=" flex justify-center items-center">
        <div className="w-full max-w-xl shadow-2xl p-3 md:p-5 rounded border">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl grid grid-cols-1 gap-5"
          >
            <div className="">
              <Label htmlFor="egpEmail">
                E-GP Email<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="egpEmail"
                onChange={handleInputChange}
                value={formData.egpEmail}
                placeholder="Enter Egp Email"
                className="mt-2"
                required
              />
              <p className="text-sm mt-2 text-red-700">{egpEmailError}</p>
            </div>
            <div className="">
              <Label htmlFor="district">
                Company Name<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="companyName"
                onChange={handleInputChange}
                value={formData.companyName}
                placeholder="Enter Company Name"
                className="mt-2"
                required
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="Password">
                Password<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                placeholder="Enter Password"
                className="mt-2"
              />
            </div>

            <div className="">
              <Label className="mb-2" htmlFor="lastUsePassDate">
                Last Use Password Date<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="lastUsePassDate"
                onChange={handleInputChange}
                value={formData.lastUsePassDate}
                placeholder="Enter Last Use Password Date"
                className="mt-2"
              />
            </div>

            <div className="col-span-full">
              {isDisabled ? (
                <Button disabled className="w-full cursor-pointer">
                  Submit
                </Button>
              ) : (
                <Button type="submit" className="w-full cursor-pointer">
                  Submit
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default EgpPassEmail;
