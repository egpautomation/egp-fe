// @ts-nocheck

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSingleData from "@/hooks/useSingleData";
import { updateData } from "@/lib/updateData";
import { MoveLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const EditTutorialCategory = () => {
  const { id } = useParams();
  const url = `https://egpserver.jubairahmad.com/api/v1/tutorials-categories/${id}`;
  const { data: formData, setReload } = useSingleData(url);
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
    const url = `https://egp-tender-automation-server.vercel.app/api/v1/tutorials-categories/${id}`;
    await updateData(url, newFormData, setReload);
  };

  useEffect(() => {
    if (formData) {
      setNewFormData({
        category: formData.category || "",
        subCategories: formData.subCategories || "",
      });
    }
  }, [formData]);

  return (
    <section className="min-h-lvh">
      <Link to={"/dashboard/tutorials/categories"}>
        <Button className="flex items-center gap-1.5 mt-6 cursor-pointer">
          <MoveLeft /> Back To Data Table
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-center my-5">
        Update Category Adn Sub Categories
      </h1>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-xl shadow-2xl p-3 md:p-5 rounded border">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl grid grid-cols-1 gap-5"
          >
            {/* Category */}
            <div>
              <Label>Category</Label>
              <Input
                type="text"
                name="category"
                value={newFormData?.category}
                onChange={handleInputChange}
                placeholder="Enter Organization"
                className="mt-2"
              />
            </div>

            {/* Sub Categories */}
            <div>
              <Label>Sub Categories</Label>
              <Input
                type="text"
                name="subCategories"
                value={newFormData?.subCategories}
                onChange={handleInputChange}
                placeholder="Enter Short Name"
                className="mt-2"
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

export default EditTutorialCategory;
