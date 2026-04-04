"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Demo Data
const demoSors = [
  {
    code: "02/06/01(a)",
    dept: "RHD",
    year: "2025-26",
    category: "Earth Work",
    description: "Embankment Fill from Borrow pit",
    rates: [125.50, 130.75, 128.00, 132.25, 129.80, 131.50],
  },
  {
    code: "03/07/01c",
    dept: "RHD",
    year: "2025-26",
    category: "Bituminous Work",
    description: "Bituminous Tack Coat",
    rates: [45.20, 47.80, 46.50, 48.10, 46.00, 47.25],
  },
  {
    code: "03/11/02",
    dept: "RHD",
    year: "2025-26",
    category: "Bituminous Work",
    description: "Premix Carpeting 40mm",
    rates: [1850.00, 1920.00, 1880.00, 1950.00, 1900.00, 1935.00],
  },
];

export default function SimilarRatesModal({ setUnitPrice }: { setUnitPrice: (val: number) => void }) {
  const [open, setOpen] = useState(false);

  const handleSelectRate = (value: number) => {
    setUnitPrice(value);
    setOpen(false); // Close modal on selection
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <Search size={18} className="text-slate-500 hover:text-blue-600" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] lg:max-w-6xl p-0 overflow-hidden border-none shadow-2xl rounded-xl">
        {/* Header Section */}
        <DialogHeader className="px-6 py-5 flex flex-row items-center gap-3 bg-white border-b border-slate-100">
          <Search className="w-6 h-6 text-blue-600 stroke-[3px]" />
          <DialogTitle className="text-xl font-bold text-slate-800">
            Similar Items & Rates
          </DialogTitle>
        </DialogHeader>

        {/* Table Content */}
        <div className="p-4 md:p-6 bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-200">
                <TableHead className="font-bold text-slate-900 h-12">Item Code</TableHead>
                <TableHead className="font-bold text-slate-900">Department</TableHead>
                <TableHead className="font-bold text-slate-900 leading-tight">Year Of<br/>Rate</TableHead>
                <TableHead className="font-bold text-slate-900">Category</TableHead>
                <TableHead className="font-bold text-slate-900 w-[240px]">Description</TableHead>
                
                {/* Standard Rate Headers */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableHead key={i} className="font-bold text-slate-900 text-right">Rate0{i}</TableHead>
                ))}
                
                {/* Blue Highlighted Header */}
                <TableHead className="font-bold text-white bg-blue-600 text-right rounded-t-md px-4">
                  Rate06
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {demoSors.map((row, idx) => (
                <TableRow key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-slate-700 py-5">{row.code}</TableCell>
                  <TableCell className="text-slate-600">{row.dept}</TableCell>
                  <TableCell className="text-slate-600">{row.year}</TableCell>
                  <TableCell className="text-slate-600">{row.category}</TableCell>
                  <TableCell className="text-slate-500 text-sm leading-snug">{row.description}</TableCell>
                  
                  {/* Interactive Rate Cells */}
                  {row.rates.map((rate, i) => (
                    <TableCell
                      key={i}
                      onClick={() => handleSelectRate(rate)}
                      className={`
                        text-right font-semibold cursor-pointer transition-all duration-150
                        hover:bg-blue-600 hover:text-white active:scale-95 px-4
                        ${i === 5 ? "bg-blue-50/50 text-blue-700 font-bold" : "text-slate-700"}
                      `}
                    >
                      {rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}