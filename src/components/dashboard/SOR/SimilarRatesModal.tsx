"use client";

import { useEffect, useState } from "react";
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
import config from "@/lib/config";

interface SORItem {
  _id: string;
  itemCode: string;
  departmentShortName: string;
  yearOfRate: number;
  category: string;
  description: string;
  rate_1: number;
  rate_2: number;
  rate_3: number;
  rate_4: number;
  rate_5: number;
  rate_6: number;
}

export default function SimilarRatesModal({
  setUnitPrice,
  itemCode,
}: {
  setUnitPrice: (val: number) => void;
  itemCode: string;
}) {
  const [open, setOpen] = useState(false);
  const [sors, setSors] = useState<SORItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !itemCode) return;
    const fetchSors = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${config.apiBaseUrl}/sor?itemCode=${encodeURIComponent(itemCode)}&page=1&limit=50`,
        );
        const data = await res.json();
        setSors(data?.data || []);
      } catch {
        setSors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSors();
  }, [open, itemCode]);

  const handleSelectRate = (value: number) => {
    if (!value) return;
    setUnitPrice(value);
    setOpen(false);
  };

  const rateKeys: (keyof SORItem)[] = ["rate_1", "rate_2", "rate_3", "rate_4", "rate_5", "rate_6"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <Search size={18} className="text-slate-500 hover:text-blue-600" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] lg:max-w-6xl p-0 overflow-hidden border-none shadow-2xl rounded-xl">
        {/* Header */}
        <DialogHeader className="px-6 py-5 flex flex-row items-center gap-3 bg-white border-b border-slate-100">
          <Search className="w-6 h-6 text-blue-600 stroke-[3px]" />
          <DialogTitle className="text-xl font-bold text-slate-800">
            Similar Items & Rates
            {itemCode && (
              <span className="ml-2 text-sm font-normal text-slate-500">
                — Item Code: {itemCode}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Table */}
        <div className="p-4 md:p-6 bg-white overflow-x-auto max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-10 text-slate-400">Loading...</div>
          ) : sors.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              No SOR data found for item code "{itemCode}"
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-200">
                  <TableHead className="font-bold text-slate-900 h-12">Item Code</TableHead>
                  <TableHead className="font-bold text-slate-900">Department</TableHead>
                  <TableHead className="font-bold text-slate-900 leading-tight">
                    Year Of
                    <br />
                    Rate
                  </TableHead>
                  <TableHead className="font-bold text-slate-900">Category</TableHead>
                  <TableHead className="font-bold text-slate-900 w-[240px]">Description</TableHead>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableHead key={i} className="font-bold text-slate-900 text-right">
                      Rate0{i}
                    </TableHead>
                  ))}
                  <TableHead className="font-bold text-white bg-blue-600 text-right rounded-t-md px-4">
                    Rate06
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sors.map((row, idx) => (
                  <TableRow
                    key={idx}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-700 py-5">{row.itemCode}</TableCell>
                    <TableCell className="text-slate-600">{row.departmentShortName}</TableCell>
                    <TableCell className="text-slate-600">{row.yearOfRate}</TableCell>
                    <TableCell className="text-slate-600">{row.category}</TableCell>
                    <TableCell className="text-slate-500 text-sm leading-snug">
                      {row.description}
                    </TableCell>
                    {rateKeys.map((key, i) => {
                      const rate = row[key] as number;
                      return (
                        <TableCell
                          key={i}
                          onClick={() => handleSelectRate(rate)}
                          className={`
                            text-right font-semibold cursor-pointer transition-all duration-150
                            hover:bg-blue-600 hover:text-white active:scale-95 px-4
                            ${rate ? "" : "text-slate-300 cursor-default"}
                            ${i === 5 ? "bg-blue-50/50 text-blue-700 font-bold" : "text-slate-700"}
                          `}
                        >
                          {rate
                            ? rate.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : "—"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
