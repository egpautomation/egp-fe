"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useState } from "react";

export default function ViewSORModal({ data }: { data: any }) {
  const [open, setOpen] = useState(false);
  const Field = ({ label, value }: any) => (
    <div className="flex flex-col space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium text-sm">
        {value || <span className="text-muted-foreground">—</span>}
      </span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye className="cursor-pointer" />
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            SOR Details
            <Badge className="mt-5" variant="outline">
              Item Code: {data?.itemCode}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* 🔹 Basic Info */}
          <div className="bg-muted/40 p-4 rounded-xl border">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Basic Information</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Department" value={data?.departmentShortName} />
              <Field label="Year" value={data?.yearOfRate} />
              <Field label="Category" value={data?.category} />
              <Field label="Sub Category" value={data?.subCategory} />
              <Field label="Sub Sub Category" value={data?.subSubCategory} />
              <Field label="Group Name" value={data?.group_name} />
            </div>
          </div>

          {/* 🔹 Description */}
          <div className="bg-muted/40 p-4 rounded-xl border">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Description</h3>

            <p className="text-sm leading-relaxed text-gray-700">{data?.description || "—"}</p>
          </div>

          {/* 🔹 Additional Info */}
          <div className="bg-muted/40 p-4 rounded-xl border">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              Additional Information
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Unit" value={data?.unit} />
              <Field label="Source" value={data?.sourceOfRate} />
              <Field label="Reference" value={data?.reference} />

              <div className="col-span-2 md:col-span-1">
                <span className="text-xs text-muted-foreground">Attachment</span>
                {data?.attachment ? (
                  <a
                    href={data.attachment}
                    target="_blank"
                    className="block mt-1 text-sm text-blue-600 hover:underline"
                  >
                    📎 View Attachment
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">—</p>
                )}
              </div>
            </div>
          </div>

          {/* 🔹 Rates */}
          <div className="bg-muted/40 p-4 rounded-xl border">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Rates</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="p-3 rounded-lg bg-white border shadow-sm">
                  <p className="text-xs text-muted-foreground">Rate {num}</p>
                  <p className="font-semibold text-sm mt-1">
                    {data?.[`rate_${num}`] ?? "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div  className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
