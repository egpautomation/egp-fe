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

const UpdateAccountHolderInformation = () => {
  const { id } = useParams();
  const url = `${config.apiBaseUrl}/accounts/${id}`;
  const { data: formData } = useSingleData(url);
  const [newFormData, setNewFormData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateUrl = `${config.apiBaseUrl}/accounts/${id}`;
    await updateData(updateUrl, newFormData);
  };

  return (
    <section className="min-h-lvh">
      <Link to={"/dashboard/bankService/user-accounts"}>
        <Button className="flex items-center gap-1.5 mt-6 cursor-pointer">
          <MoveLeft /> Back To Data Table
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-center my-5">
        Update Account Information
      </h1>
      <div className=" flex justify-center items-center">
        <div className="w-full max-w-xl shadow-2xl p-3 md:p-5 rounded border">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl grid grid-cols-1 gap-5"
          >
            {/* Bank Account Name */}
            <div>
              <Label>
                Bank Account Name<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="bankAccName"
                defaultValue={formData?.bankAccName}
                onChange={handleInputChange}
                placeholder="Enter Bank Account Name"
                className="mt-2"
                required
              />
            </div>

            {/* Bank Account Number */}
            <div>
              <Label>
                Bank Account Number<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="bankAccNumber"
                defaultValue={formData?.bankAccNumber}
                onChange={handleInputChange}
                placeholder="Enter Bank Account Number"
                className="mt-2"
                required
              />
            </div>

            {/* Account Holder Name */}
            <div>
              <Label>
                Account Holder Name<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="accHolderName"
                defaultValue={formData?.accHolderName}
                onChange={handleInputChange}
                placeholder="Enter Account Holder Name"
                className="mt-2"
                required
              />
            </div>

            {/* Account Holder Address */}
            <div>
              <Label>Account Holder Address</Label>
              <Input
                type="text"
                name="accHolderAddress"
                defaultValue={formData?.accHolderAddress}
                onChange={handleInputChange}
                placeholder="Enter Account Holder Address"
                className="mt-2"
              />
            </div>

            {/* EGP Email */}
            <div>
              <Label>
                EGP Email<span className="text-red-700">*</span>
              </Label>
              <Input
                type="email"
                name="egpMail"
                defaultValue={formData?.egpMail}
                onChange={handleInputChange}
                placeholder="Enter EGP Email"
                className="mt-2"
                required
              />
            </div>

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

export default UpdateAccountHolderInformation;
