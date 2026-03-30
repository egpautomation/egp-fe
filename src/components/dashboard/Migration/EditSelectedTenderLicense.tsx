// @ts-nocheck
import { useState } from "react";
import { Check } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";

export default function EditSelectTenderLicense({ setFormData }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = (value) => {
    setSelectedItems((prev) => {
      const newSelected = prev.includes(value)
        ? prev.filter((v) => v !== value) // Remove item
        : [...prev, value]; // Add item

      setFormData((prevForm) => ({
        ...prevForm,
        ltmTenderLicenseShortName: newSelected,
        ltmLicenseCount: newSelected.length,
      }));

      return newSelected;
    });
  };
  //   console.log(selectedItems)
  const options = [
    { value: "RHD", label: "RHD" },
    { value: "EED", label: "EED" },
    { value: "BIWTA", label: "BIWTA" },
    { value: "PDB", label: "PDB" },
    { value: "LGED", label: "LGED" },
  ];

  return (
    <div className="">
      <Label className="text-sm font-semibold" htmlFor="ltmTenderLicenseShortName">
        Please Select Your Total LTM Tender License <span className="text-red-700">* </span>
        <span>{`(${selectedItems?.length} Items)`}</span>
      </Label>
      <Select required onValueChange={toggleItem}>
        <SelectTrigger className="w-full mt-2">
          <SelectValue placeholder="Select options" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="flex items-center justify-between"
            >
              {option.label}
              {selectedItems.includes(option.value) && <Check className="h-4 w-4" />}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="mt-2">
        <span className="font-semibold"></span> Selected : {selectedItems.join(", ") || "None"}
      </p>
    </div>
  );
}
