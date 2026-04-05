import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus } from "lucide-react"; // Optional: for a better trigger icon
import { BOQItem } from "@/pages/dashboardLayout/pg22aOtmGoods/TenderTabs/BOQTab";

export function CreateNewBoqRow({
  tableId,
  onAdd,
}: {
  tableId: string;
  onAdd: (tableId: string, item: BOQItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemNo: "",
    itemCode: "",
    group:"",
    descriptionOfItem: "",
    unit: "",
    quantity: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const newItem: BOQItem = {
    _id: Date.now().toString(), // temporary unique id
    itemNo: Number(formData.itemNo),
    itemCode: formData.itemCode,
    group: formData.group,
    descriptionOfItem: formData.descriptionOfItem,
    measurement: "",
    unit: formData.unit,
    quantity: Number(formData.quantity),
    unitPrice: 0,
    requiredDocument: "",
    fileName: "",
    division_no: "",
  };

  onAdd(tableId, newItem);

  // Reset form
  setFormData({
    itemNo: "",
    itemCode: "",
    group: "",
    descriptionOfItem: "",
    unit: "",
    quantity: "",
  });
  setOpen(false);
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-end w-full">
          <Button className="bg-green-700" variant="default">
            <Plus className="mr-2 h-4 w-4" /> Add BOQ Item
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New BOQ Row</DialogTitle>
            <DialogDescription>
              Enter the details for the new Bill of Quantities line item.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FieldGroup className="">
              {/* Row 1: Item No & Code */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label htmlFor="itemNo">Item No.</Label>
                  <Input
                    id="itemNo"
                    placeholder="e.g. 1.1"
                    value={formData.itemNo}
                    onChange={(e) => handleChange("itemNo", e.target.value)}
                  />
                </Field>
                <Field>
                  <Label htmlFor="itemCode">Item Code</Label>
                  <Input
                    id="itemCode"
                    placeholder="CIV-001"
                    value={formData.itemCode}
                    onChange={(e) => handleChange("itemCode", e.target.value)}
                  />
                </Field>
              </div>
              {/* Row 2: Group */}
              <div className="grid grid-cols-2 gap-4">
                <Field className="col-span-2">
                  <Label htmlFor="group">Group</Label>
                  <Input
                  className="w-full"
                    id="group"
                    placeholder="e.g. Civil Works"
                    value={formData.group}
                    onChange={(e) => handleChange("group", e.target.value)}
                  />
                </Field>
              </div>
           

              {/* Row 2: Description */}
              <Field>
                <Label htmlFor="description">Description of Item</Label>
                <Input
                  id="description"
                  placeholder="Enter detailed description..."
                  value={formData.descriptionOfItem}
                  className="h-20"
                  onChange={(e) => handleChange("descriptionOfItem", e.target.value)}
                />
              </Field>

              {/* Row 3: Unit & Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="skm, LS, etc."
                    value={formData.unit}
                    onChange={(e) => handleChange("unit", e.target.value)}
                  />
                </Field>
                <Field>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0.00"
                    value={formData.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                  />
                </Field>
              </div>
            </FieldGroup>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button className="bg-gray-100 mr-2" variant="ghost" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button className="bg-teal-700" type="submit">
              Add Row
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
