// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createData } from "@/lib/createData";
import { useState } from "react";

const CreateService = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
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
    const url = `${config.apiBaseUrl}/services/create-service`
    createData(url,formData);
  };
  return (
    <div className="min-h-lvh ">
        <h1 className="text-3xl font-semibold text-center my-8">Add Service</h1>
      <form
        onSubmit={handleSubmit}
        action=""
        className="grid grid-cols-1 gap-5 max-w-xl p-5 rounded border shadow-lg mx-auto"
      >
        <div className="">
          <Label htmlFor="egpEmail">
            Name<span className="text-red-700">*</span>
          </Label>
          <Input
            type="text"
            name="name"
            onChange={handleInputChange}
            value={formData.name}
            placeholder="Enter Service Name"
            className="mt-2"
            required
          />
        </div>
        <div className="">
          <Label htmlFor="Description">
            Description<span className="text-red-700">*</span>
          </Label>
          <Textarea
            type="text"
            name="description"
            onChange={handleInputChange}
            value={formData.description}
            placeholder="Enter Description Name"
            className="mt-2 h-24"
            required
          />
        </div>
        <div className="">
          <Label htmlFor="Description">
            Price<span className="text-red-700">*</span>
          </Label>
          <Input
            type="number"
            name="price"
            onChange={handleInputChange}
            value={formData.price}
            placeholder="Enter Price"
            className="mt-2"
            required
          />
        </div>
        <Button className="cursor-pointer">Add</Button>
      </form>
    </div>
  );
};

export default CreateService;
