import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { config } from "@/lib/config";

interface UpdateTenderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenderId: string;
  initialData: {
    turnoverAmount?: string;
    liquidAssets?: string;
    tenderCapacity?: string;
    jvca?: string;
    typesOfSimilarNature?: string;
    yearofsimilarexperience?: string;
  };
  onSuccess: () => void;
}

const UpdateTenderDialog = ({
  open,
  onOpenChange,
  tenderId,
  initialData,
  onSuccess,
}: UpdateTenderDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    turnoverAmount: "",
    liquidAssets: "",
    tenderCapacity: "",
    jvca: "",
    yearofsimilarexperience: "",
  });

  // Dynamic Categories State
  const [subCategories, setSubCategories] = useState<Array<{ sub_cat_name: string }>>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [subCategoryValue, setSubCategoryValue] = useState("");

  useEffect(() => {
    if (open) {
      setFormData({
        turnoverAmount: initialData.turnoverAmount || "",
        liquidAssets: initialData.liquidAssets || "",
        tenderCapacity: initialData.tenderCapacity || "",
        jvca: initialData.jvca || "",
        yearofsimilarexperience: initialData.yearofsimilarexperience || "",
      });
      // Pre-fill categories from typesOfSimilarNature if partial match found or just reset
      // Format expected: "Category : Value"
      if (initialData.typesOfSimilarNature && initialData.typesOfSimilarNature.includes(":")) {
        const [cat, val] = initialData.typesOfSimilarNature.split(":").map((s) => s.trim());
        setSelectedSubCategory(cat);
        setSubCategoryValue(val);
      } else {
        setSelectedSubCategory("");
        setSubCategoryValue("");
      }
    }
  }, [open, initialData]);

  // Fetch sub-categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/tender-categories/with-pagination?page=1&limit=1000`
        );
        const data = await response.json();
        setSubCategories(data?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleYearChange = (value: string) => {
    setFormData((prev) => ({ ...prev, yearofsimilarexperience: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        typesOfSimilarNature:
          selectedSubCategory && subCategoryValue
            ? `${selectedSubCategory} : ${subCategoryValue}`
            : "",
      };

      await axiosInstance.patch(`/tenders/${tenderId}`, payload);
      toast.success("Tender information updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating tender:", error);
      toast.error("Failed to update tender information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Update Tender Information</DialogTitle>
          <DialogDescription>
            Update the financial and eligibility criteria for this tender.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="turnoverAmount">Turnover Amount</Label>
              <Input
                id="turnoverAmount"
                name="turnoverAmount"
                value={formData.turnoverAmount}
                onChange={handleChange}
                placeholder="Enter turnover amount"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="liquidAssets">Liquid Assets</Label>
              <Input
                id="liquidAssets"
                name="liquidAssets"
                value={formData.liquidAssets}
                onChange={handleChange}
                placeholder="Enter liquid assets"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tenderCapacity">Tender Capacity</Label>
              <Input
                id="tenderCapacity"
                name="tenderCapacity"
                value={formData.tenderCapacity}
                onChange={handleChange}
                placeholder="Enter tender capacity"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jvca">JVCA</Label>
              <Select
                name="jvca"
                value={formData.jvca}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, jvca: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select JVCA status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Similar Nature Work Value</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-1">
                <Label className="mb-2 block">Sub Category</Label>
                <Combobox
                  options={subCategories.map((cat, idx) => ({
                    value: cat.sub_cat_name,
                    label: cat.sub_cat_name,
                    key: `${cat.sub_cat_name}-${idx}`,
                  }))}
                  value={selectedSubCategory}
                  onChange={setSelectedSubCategory}
                  placeholder="Select sub category..."
                  searchPlaceholder="Search sub category..."
                  emptyMessage="No sub category found."
                />
              </div>

              <div className="lg:col-span-1">
                <div className="grid gap-2">
                  <Label>Value</Label>
                  <Input
                    value={subCategoryValue}
                    onChange={(e) => setSubCategoryValue(e.target.value)}
                    placeholder="Enter value"
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="grid gap-2">
                  <Label>Year</Label>
                  <Select value={formData.yearofsimilarexperience} onValueChange={handleYearChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Tender"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTenderDialog;
