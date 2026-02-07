// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createData } from "@/lib/createData";
import { MoveLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const CreateTutorialCategory = () => {
  const [formData, setFormData] = useState({
    category: "",
    subCategories: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      category: "",
      subCategories: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${config.apiBaseUrl}/tutorials-categories/create-category`;
    createData(url, formData, null, handleReset);
  };
  return (
    <section className="min-h-lvh mt-5">
      <Link to={"/dashboard/tutorials/categories"}>
        <Button className="cursor-pointer">
          <MoveLeft /> Back To Data Table
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-center mb-5 underline">
        Create Category{" "}
      </h1>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-xl shadow-2xl p-3 md:p-5 rounded border">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl grid grid-cols-1  gap-5"
          >
            <div className="">
              <Label className="mb-2" htmlFor="egpEmail">
                Category<span className="text-red-700">*</span>
              </Label>
              <Input
                type="text"
                name="category"
                onChange={handleInputChange}
                value={formData.category}
                required
              />
            </div>
            <div className="">
              <Label className="mb-2" htmlFor="egpEmail">
                Sub Category
              </Label>
              <Textarea
                type="text"
                name="subCategories"
                onChange={handleInputChange}
                value={formData.subCategories}
                required
              />
            </div>

            <div className="col-span-full">
              <Button type="submit" className="w-full cursor-pointer">
                Add Category
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateTutorialCategory;
