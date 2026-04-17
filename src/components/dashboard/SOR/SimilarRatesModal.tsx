"use client";

import { useEffect, useMemo, useState } from "react";
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

const rateKeys: (keyof SORItem)[] = ["rate_1", "rate_2", "rate_3", "rate_4", "rate_5", "rate_6"];

export default function SimilarRatesModal({
  setUnitPrice,
  itemCode,
  descriptionOfItem,
}: {
  setUnitPrice: (val: number) => void;
  itemCode: string;
  descriptionOfItem?: string;
}) {
  const [open, setOpen] = useState(false);
  const [sors, setSors] = useState<SORItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await fetch(`${config.apiBaseUrl}/departments`);
        const data = await res.json();
        if (data?.success) setDepartments(data.data || []);
      } catch {}
    };
    fetchDepts();
  }, []);

  useEffect(() => {
    if (!open) return;
    const fetchSors = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (itemCode) params.set("itemCode", itemCode);
        if (descriptionOfItem) params.set("descriptionOfItem", descriptionOfItem);
        const res = await fetch(
          `${config.apiBaseUrl}/sor/similar-rates?${params.toString()}`,
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
  }, [open, itemCode, descriptionOfItem]);

  const handleSelectRate = (value: number) => {
    if (!value) return;
    setUnitPrice(value);
    setOpen(false);
  };

  // Group SOR data by departmentShortName
  const grouped = useMemo(() => {
    const map = new Map<string, SORItem[]>();
    sors.forEach((s) => {
      const key = s.departmentShortName || "Unknown";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return map;
  }, [sors]);

  // Get headers for a specific department
  const getHeaders = (deptShortName: string): string[] => {
    const dept = departments.find(
      (d: any) =>
        d.shortName === deptShortName ||
        d.detailsName === deptShortName ||
        d.organization?.includes(deptShortName),
    );
    const headers: string[] = [];
    for (let i = 1; i <= 6; i++) {
      headers.push(dept?.[`rate_${i}`] || `Rate0${i}`);
    }
    return headers;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <Search size={18} className="text-slate-500 hover:text-blue-600" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] lg:max-w-6xl p-0 overflow-hidden border-none shadow-2xl rounded-xl">
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

        <div className="p-4 md:p-6 bg-white overflow-x-auto max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-10 text-slate-400">Loading...</div>
          ) : sors.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              No SOR data found for item code &quot;{itemCode}&quot;
            </div>
          ) : (
            Array.from(grouped.entries()).map(([deptName, rows]) => {
              const headers = getHeaders(deptName);
              return (
                <div key={deptName} className="mb-8 last:mb-0">
                  {/* Department Group Title */}
                  <h3 className="text-lg font-bold text-blue-700 mb-3 pb-2 border-b-2 border-blue-200">
                    {deptName}
                  </h3>

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
                        {headers.map((header, i) =>
                          i === 5 ? (
                            <TableHead key={i} className="font-bold text-white bg-blue-600 text-right rounded-t-md px-4">
                              {header}
                            </TableHead>
                          ) : (
                            <TableHead key={i} className="font-bold text-slate-900 text-right">
                              {header}
                            </TableHead>
                          ),
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row, idx) => (
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
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
