// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { config } from "@/lib/config";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import useAllDepartments from "@/hooks/useAllDepartments";
import { createData } from "@/lib/createData";
import { useState } from "react";
const demoData = ["Civil", "Electrical", "Mechanical"];

export default function CreateSORForm({setReload}: {setReload: () => void}) {
  const [formData, setFormData] = useState<any>({});
 const {departments} = useAllDepartments();
  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };
const resetForm = () => {
  setFormData({});
}
  const handleSubmit = () => {
    const url = `${config.apiBaseUrl}/sor/create-sor`; // Replace with your actual endpoint
   
    createData(url, formData, setReload, resetForm);
  };
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Department */}
        <div>
          <Label className="mb-2">Department Short Name</Label>
          <Select onValueChange={(v) => handleChange("departmentShortName", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
             {departments?.map((dept) => (
                <SelectItem key={dept.shortName} value={dept.shortName}>
                  {dept.shortName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year */}
        <div>
          <Label className="mb-2">Year of Rate</Label>
          <Input type="number" onChange={(e) => handleChange("year", e.target.value)} />
        </div>

        {/* Category */}
        <div>
          <Label className="mb-2">Category</Label>
          <Input type="text" onChange={(e) => handleChange("category", e.target.value)} />

        </div>

        {/* Sub Category */}
        <div>
          <Label className="mb-2">Sub Category</Label>
          <Input onChange={(e) => handleChange("subCategory", e.target.value)} />
        </div>

        {/* Sub Sub Category */}
        <div className="col-span-2">
          <Label className="mb-2">Sub Sub Category</Label>
          <Input onChange={(e) => handleChange("subSubCategory", e.target.value)} />
        </div>

        {/* Group  Name */}
        <div>
          <Label className="mb-2">Group Name</Label>
          <Input onChange={(e) => handleChange("group_name", e.target.value)} />
        </div>
        {/* Item Code */}
        <div>
          <Label className="mb-2">Item Code</Label>
          <Input onChange={(e) => handleChange("itemCode", e.target.value)} />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <Label className="mb-2">Description</Label>
          <Input onChange={(e) => handleChange("description", e.target.value)} />
        </div>

        {/* Unit */}
        <div>
          <Label className="mb-2">Unit</Label>
          <Input onChange={(e) => handleChange("unit", e.target.value)} />
        </div>

        {/* Source of Rate */}
        <div>
          <Label className="mb-2">Source of Rate</Label>
          <Input onChange={(e) => handleChange("sourceOfRate", e.target.value)} />
        </div>

        {/* Reference */}
        <div>
          <Label className="mb-2">Reference</Label>
          <Input onChange={(e) => handleChange("reference", e.target.value)} />
        </div>

        {/* Attachment */}
        <div>
          <Label className="mb-2">Attachment</Label>
          <Input type="text" onChange={(e) => handleChange("attachment", e.target.value)} />
        </div>

        {/* Rates */}
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num}>
            <Label className="mb-2">Rate {num}</Label>
            <Input type="number" onChange={(e) => handleChange(`rate_${num}`, e.target.value)} />
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button className="w-full" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
