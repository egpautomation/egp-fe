// @ts-nocheck

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createData } from "@/lib/createData";
import { useState } from "react";

const CreatePayment = () => {
  const [formData, setFormData] = useState({
    wallet: "",
    transactionId: "",
    transactionType: "",
    transactionAmount: "",
    transactionReference: "",
    others: "",
  });
  const resetForm = () => {
    setFormData({
      wallet: "",
      transactionId: "",
      transactionType: "",
      transactionAmount: "",
      transactionReference: "",
      others: "",
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url =
      "https://egpserver.jubairahmad.com/api/v1/payments/create-payment";
    await createData(url, {
      ...formData,
      wallet: Number(formData.wallet),
      transactionAmount: Number(formData.transactionAmount),
    }, null, resetForm);
  };

  return (
    <div className="min-h-lvh">
      <h1 className="text-3xl font-semibold text-center my-8">Add Payment</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1  gap-5 max-w-xl p-5 rounded border shadow-lg mx-auto"
      >
        <div>
          <Label htmlFor="wallet">
            Wallet<span className="text-red-700">*</span>
          </Label>
          <Input
            type="number"
            name="wallet"
            onChange={handleInputChange}
            value={formData.wallet}
            placeholder="Enter Wallet Amount"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="transactionId">
            Transaction ID<span className="text-red-700">*</span>
          </Label>
          <Input
            type="text"
            name="transactionId"
            onChange={handleInputChange}
            value={formData.transactionId}
            placeholder="Enter Transaction ID"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="transactionType">
            Transaction Type<span className="text-red-700">*</span>
          </Label>
          <Input
            type="text"
            name="transactionType"
            onChange={handleInputChange}
            value={formData.transactionType}
            placeholder="Enter Transaction Type"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="transactionAmount">
            Transaction Amount<span className="text-red-700">*</span>
          </Label>
          <Input
            type="number"
            name="transactionAmount"
            onChange={handleInputChange}
            value={formData.transactionAmount}
            placeholder="Enter Transaction Amount"
            className="mt-2"
            required
          />
        </div>
        <div>
          <Label htmlFor="transactionReference">
            Transaction Reference <span className="text-red-700">*</span>
          </Label>
          <Input
            type="string"
            name="transactionReference"
            onChange={handleInputChange}
            value={formData.transactionReference}
            placeholder="Enter Transaction Reference"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="other">
            Other<span className="text-red-700">*</span>
          </Label>
          <Input
            type="string"
            name="others"
            onChange={handleInputChange}
            value={formData.others}
            placeholder="Enter Other Amount"
            className="mt-2"
            required
          />
        </div>

        <Button className="cursor-pointer">Add</Button>
      </form>
    </div>
  );
};

export default CreatePayment;
