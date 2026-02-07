// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSingleData from "@/hooks/useSingleData";
import { updateData } from "@/lib/updateData";
import { MoveLeft } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const EditCompanyMigration = () => {
  const { id } = useParams();
  const url = `${config.apiBaseUrl}/companyMigration/${id}`;

  const { data: formData } = useSingleData(url);
  const [updatedData, setUpdatedFormData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUpdatedFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateUrl = `${config.apiBaseUrl}/companyMigration/${id}`;
    updateData(updateUrl, updatedData);
  };

  return (
    <section className="min-h-lvh ">
      <Link
        className="mt-5 inline-block"
        to={"/dashboard/company-registration"}
      >
        <Button>
          <MoveLeft /> Back To Data Table
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-center my-5">Edit Migration</h1>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-xl shadow-2xl p-3 md:p-5 rounded border">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl grid grid-cols-1 gap-5"
          >
            {/* E-GP Email */}
            <div className="">
              <Label htmlFor="egpEmail">
                E-GP Email<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="egpEmail"
                onChange={handleInputChange}
                defaultValue={formData?.egpEmail}
                placeholder="Enter E-GP Email"
                className="mt-2 bg-gray-100 cursor-not-allowed"
                readOnly
                disabled
              />
            </div>

            {/* E-GP Login Key */}
            <div className="">
              <Label htmlFor="egpLoginKey">
                E-GP Login Key<span className="text-red-700">*</span>
              </Label>
              <mark className="bg-yellow-400 mt-2 text-white text-[12px] px-1 rounded">
                {" "}
                পাসওয়ার্ড ভালোভাবে যাচাই করুন, পাসওয়ার্ড দিতে ভুল করলে E-GP
                একাউন্ট লক হতে পারে।
              </mark>
              <Input
                type="text"
                name="egpLoginKey"
                onChange={handleInputChange}
                defaultValue={formData?.egpLoginKey}
                placeholder="Enter Login Key"
                className="mt-2"
                required
              />
            </div>

            {/* Company Name */}
            <div className="">
              <Label htmlFor="name">
                Company Name<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="companyName"
                onChange={handleInputChange}
                defaultValue={formData?.companyName}
                placeholder="Company Name"
                className="mt-2"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-full">
              <Button type="submit" className="w-full cursor-pointer">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditCompanyMigration;
