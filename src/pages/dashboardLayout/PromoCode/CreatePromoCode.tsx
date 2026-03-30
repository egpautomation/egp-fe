// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createData } from "@/lib/createData";
import { format } from "date-fns";
import { MoveLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const CreatePromoCode = () => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    percent: "",
    deadline: new Date(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${config.apiBaseUrl}/promoCode/create-promoCode`;
    createData(url, formData);
  };
  return (
    <div className="min-h-lvh ">
      <Link to={"/dashboard/promo-codes"} className="mt-5 inline-block">
        <Button>
          {" "}
          <MoveLeft /> To Data Table
        </Button>
      </Link>
      <h1 className="text-3xl font-semibold text-center my-8">Add A New Promo Code</h1>
      <form
        onSubmit={handleSubmit}
        action=""
        className="grid grid-cols-1 gap-5 max-w-xl p-5 rounded border shadow-lg mx-auto"
      >
        <div className="">
          <Label htmlFor="Name">
            Name<span className="text-red-700">*</span>
          </Label>
          <Input
            type="text"
            name="name"
            onChange={handleInputChange}
            value={formData.name}
            placeholder="Enter Code Name"
            className="mt-2"
            required
          />
        </div>
        <div className="">
          <Label htmlFor="Code">
            Code<span className="text-red-700">*</span>
          </Label>
          <Input
            type="text"
            name="code"
            onChange={handleInputChange}
            value={formData.code}
            placeholder="Enter Code"
            className="mt-2"
            required
          />
        </div>
        <div className="">
          <Label htmlFor="Percentage">
            Percentage<span className="text-red-700">*</span>
          </Label>
          <Input
            type="number"
            name="percent"
            onChange={handleInputChange}
            value={formData.percent}
            placeholder="Enter Percentage"
            className="mt-2"
            required
          />
        </div>
        <div className="">
          <Label htmlFor="Deadline">
            Deadline<span className="text-red-700">*</span>
          </Label>
          <Calendar
            mode="single"
            selected={formData?.deadline}
            onSelect={(value) => setFormData((prev) => ({ ...prev, deadline: value }))}
            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
            className="rounded-md border shadow w-max mt-2"
          />
        </div>
        <Button type="submit" className="cursor-pointer">
          Add
        </Button>
      </form>
    </div>
  );
};

export default CreatePromoCode;
