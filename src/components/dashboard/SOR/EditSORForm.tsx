"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { updateData } from "@/lib/updateData";
import { SquarePen } from "lucide-react";
import config from "@/lib/config";

const departments = [{ shortName: "RHD" }, { shortName: "EED" }];

export default function EditSORForm({ data, setReload }: { data: any; setReload: () => void }) {
  const [formData, setFormData] = useState<any>({});
  const [originalData, setOriginalData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // ✅ preload data
  useEffect(() => {
    if (data) {
      const flatData = {
        ...data,
        ...data?.rates,
      };

      setFormData(flatData);
      setOriginalData(flatData);
    }
  }, [data]);

  // ✅ handle change
  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ✅ get only modified fields
  const getModifiedFields = () => {
    const modified: any = {};

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key]) {
        modified[key] = formData[key];
      }
    });

    return modified;
  };

  // ✅ prepare payload (handle rates)
  const preparePayload = () => {
    const modified = getModifiedFields();

    const rateKeys = ["rate_1", "rate_2", "rate_3", "rate_4", "rate_5", "rate_6"];

    const rates: any = {};

    rateKeys.forEach((key) => {
      if (modified[key] !== undefined) {
        rates[key] = Number(modified[key]);
        delete modified[key];
      }
    });

    if (Object.keys(rates).length > 0) {
      modified.rates = rates;
    }

    return modified;
  };

  const handleSubmit = async () => {
    try {
      const payload = preparePayload();

      if (Object.keys(payload).length === 0) {
        alert("No changes made");
        return;
      }

      setLoading(true);

      console.log("Payload:", payload);

      const api = `${config.apiBaseUrl}/sor/update-sor/${data._id}`;
      updateData(api, payload, setReload, null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SquarePen className="cursor-pointer" />
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit SOR</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Department */}
          <div>
            <Label className="mb-2">Department Short Name</Label>
            <Select
              value={formData.departmentShortName}
              onValueChange={(v) => handleChange("departmentShortName", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
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
            <Input
              type="number"
              value={formData.yearOfRate || ""}
              onChange={(e) => handleChange("yearOfRate", e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <Label className="mb-2">Category</Label>
            <Input
              type="text"
              value={formData.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
            />
          </div>

          {/* Sub Category */}
          <div>
            <Label className="mb-2">Sub Category</Label>
            <Input
              value={formData.subCategory || ""}
              onChange={(e) => handleChange("subCategory", e.target.value)}
            />
          </div>

          {/* Sub Sub Category */}
          <div className="col-span-2">
            <Label className="mb-2">Sub Sub Category</Label>
            <Input
              value={formData.subSubCategory || ""}
              onChange={(e) => handleChange("subSubCategory", e.target.value)}
            />
          </div>

          {/* Group Name */}
          <div>
            <Label className="mb-2">Group Name</Label>
            <Input
              value={formData.group_name || ""}
              onChange={(e) => handleChange("group_name", e.target.value)}
            />
          </div>

          {/* Item Code */}
          <div>
            <Label className="mb-2">Item Code</Label>
            <Input
              value={formData.itemCode || ""}
              onChange={(e) => handleChange("itemCode", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <Label className="mb-2">Description</Label>
            <Input
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Unit */}
          <div>
            <Label className="mb-2">Unit</Label>
            <Input
              value={formData.unit || ""}
              onChange={(e) => handleChange("unit", e.target.value)}
            />
          </div>

          {/* Source */}
          <div>
            <Label className="mb-2">Source of Rate</Label>
            <Input
              value={formData.sourceOfRate || ""}
              onChange={(e) => handleChange("sourceOfRate", e.target.value)}
            />
          </div>

          {/* Reference */}
          <div>
            <Label className="mb-2">Reference</Label>
            <Input
              value={formData.reference || ""}
              onChange={(e) => handleChange("reference", e.target.value)}
            />
          </div>

          {/* Attachment */}
          <div>
            <Label className="mb-2">Attachment</Label>
            <Input
              value={formData.attachment || ""}
              onChange={(e) => handleChange("attachment", e.target.value)}
            />
          </div>

          {/* Rates */}
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num}>
              <Label className="mb-2">Rate {num}</Label>
              <Input
                type="number"
                value={formData[`rate_${num}`] || ""}
                onChange={(e) => handleChange(`rate_${num}`, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
