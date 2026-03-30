// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createData } from "@/lib/createData";
import { AuthContext } from "@/provider/AuthProvider";
import { MoveLeft } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

const CreateAccountHolderDetails = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    bankAccName: "",
    bankAccNumber: "",
    accHolderName: "",
    accHolderAddress: "",
    egpMail: "",
    user: user?.email,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      bankAccName: "",
      bankAccNumber: "",
      accHolderName: "",
      accHolderAddress: "",
      egpMail: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${config.apiBaseUrl}/accounts/create-account-holder-details`;
    createData(url, formData, null, resetForm);
  };

  return (
    <div className="min-h-lvh">
      <Link className="mt-8 inline-block" to={"/dashboard/bankService/user-accounts"}>
        <Button className="cursor-pointer">
          <MoveLeft /> Back To Data Table
        </Button>
      </Link>
      <h1 className="text-3xl font-semibold text-center my-8">Add Account Holder Details</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 max-w-xl p-5 rounded border shadow-lg mx-auto"
      >
        {/* Bank Account Name */}
        <div>
          <Label>
            Bank Account Name<span className="text-red-700">*</span>
          </Label>
          <Input
            type="text"
            name="bankAccName"
            value={formData.bankAccName}
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
            value={formData.bankAccNumber}
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
            value={formData.accHolderName}
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
            value={formData.accHolderAddress}
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
            value={formData.egpMail}
            onChange={handleInputChange}
            placeholder="Enter EGP Email"
            className="mt-2"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-full">
          <Button className="cursor-pointer w-full">Add</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccountHolderDetails;
