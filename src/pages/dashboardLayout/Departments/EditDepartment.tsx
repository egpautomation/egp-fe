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

const EditDepartmentInformation = () => {
  const { id } = useParams();
  const url = `${config.apiBaseUrl}/departments/${id}`;
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
    const updateUrl = `${config.apiBaseUrl}/departments/${id}`;
    await updateData(updateUrl, newFormData);
  };

  return (
    <section className="min-h-lvh">
      <Link to={"/dashboard/departments"}>
        <Button className="flex items-center gap-1.5 mt-6 cursor-pointer">
          <MoveLeft /> Back To Department Table
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-center my-5">
        Update Department Information
      </h1>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-xl shadow-2xl p-3 md:p-5 rounded border">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl grid grid-cols-1 gap-5"
          >
            {/* Organization */}
            <div>
              <Label>
                Organization 
              </Label>
              <Input
                type="text"
                name="organization"
                defaultValue={formData?.organization}
                onChange={handleInputChange}
                placeholder="Enter Organization"
                className="mt-2"
                readOnly
              />
            </div>

            {/* Short Name */}
            <div>
              <Label>
                Short Name 
              </Label>
              <Input
                type="text"
                name="shortName"
                defaultValue={formData?.shortName}
                onChange={handleInputChange}
                placeholder="Enter Short Name"
                className="mt-2"
                
              />
            </div>

            {/* Details Name */}
            <div>
              <Label>
                Details Name 
              </Label>
              <Input
                type="text"
                name="detailsName"
                defaultValue={formData?.detailsName}
                onChange={handleInputChange}
                placeholder="Enter Details Name"
                className="mt-2"
                
              />
            </div>

            {/* Department Bangla Short Name */}
            <div>
              <Label>
                Department Bangla Short Name{" "}
                
              </Label>
              <Input
                type="text"
                name="departmentBanglaShortName"
                defaultValue={formData?.departmentBanglaShortName}
                onChange={handleInputChange}
                placeholder="Enter Bangla Short Name"
                className="mt-2"
                
              />
            </div>

            {/* LTM License Name Code */}
            <div>
              <Label>
                LTM License Name Code 
              </Label>
              <Input
                type="text"
                name="LTMLicenseNameCode"
                defaultValue={formData?.LTMLicenseNameCode}
                onChange={handleInputChange}
                placeholder="Enter LTM License Code"
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

export default EditDepartmentInformation;
