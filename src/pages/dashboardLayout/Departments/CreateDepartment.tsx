// @ts-nocheck
import { useState } from "react";
import axios from "axios";
import { createData } from "@/lib/createData";
import { Input } from "@/components/ui/input";
import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UniqueOrganizationComboBox } from "./OrganizationCombobox";
import useAllUniqueOrganizations from "@/hooks/useAllUniqueOrganizations";
import { Link } from "react-router-dom";
import { MoveLeft } from "lucide-react";

const CreateDepartment = () => {
    const {setReload, data} = useAllUniqueOrganizations()
  const [formData, setFormData] = useState({
    organization: "",
    shortName: "",
    detailsName: "",
    departmentBanglaShortName: "",
    LTMLicenseNameCode: "",
  });

  const [organization, setOrganization] = useState("");
  const [organizationValue, setOrganizationValue] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const resetForm = () => {
    setFormData({
      shortName: "",
      detailsName: "",
      departmentBanglaShortName: "",
      LTMLicenseNameCode: "",
    });
    setOrganization("");
    setOrganizationValue("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${config.apiBaseUrl}/departments/create-department`;
    createData(url, { ...formData, organization }, setReload, resetForm);
  };

  return (
    <div className="">
        <Link to={"/dashboard/departments"}>
        <Button className="flex items-center gap-1.5 mt-6 cursor-pointer">
          <MoveLeft /> Back To Department Table
        </Button>
      </Link>
      <h2 className="text-2xl font-bold mb-4 text-center my-5">
        Create Department
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-xl mx-auto  p-6 bg-white shadow rounded-xl"
      >
        <div>
          <Label className="mb-2">
            Organization <span className="text-red-600">*</span>
          </Label>
          <UniqueOrganizationComboBox
            setOrganization={setOrganization}
            value={organizationValue}
            setValue={setOrganizationValue}
            data={data}
          />
        </div>
        <div>
          <Label className="mb-2">
            Short Name <span className="text-red-600">*</span>
          </Label>
          <Input
            type="text"
            name="shortName"
            placeholder="Short Name"
            value={formData.shortName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <Label className="mb-2">
            Details Name <span className="text-red-600">*</span>
          </Label>
          <Input
            type="text"
            name="detailsName"
            placeholder="Details Name"
            value={formData.detailsName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <Label className="mb-2">
            Short Name (Bangla) <span className="text-red-600">*</span>
          </Label>
          <Input
            type="text"
            name="departmentBanglaShortName"
            placeholder="Department Bangla Short Name"
            value={formData.departmentBanglaShortName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <Label className="mb-2">
            LTM License Code <span className="text-red-600">*</span>
          </Label>
          <Input
            type="text"
            name="LTMLicenseNameCode"
            placeholder="LTM License Name Code"
            value={formData.LTMLicenseNameCode}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Create
        </Button>
      </form>
    </div>
  );
};

export default CreateDepartment;
