// src/components/TenderTabs/TenderListTab.tsx

// @ts-nocheck
import React, { useMemo, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- ইউটিলিটি কম্পোনেন্ট ---

// স্ট্যাটাস অনুযায়ী রঙিন ব্যাজ দেখানোর জন্য
const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 text-xs font-semibold rounded-full ${
      status === "Completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
    }`}
  >
    {status}
  </span>
);

// মাল্টি-সিলেক্ট ফিল্টার কম্পোনেন্ট
const MultiSelectFilter = ({ title, options, selectedValues, onChange }) => {
  const handleSelect = (value) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    onChange(newSelection);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {title} ({selectedValues.length}) <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onSelect={(e) => e.preventDefault()}
            onClick={() => handleSelect(option)}
          >
            <Checkbox checked={selectedValues.includes(option)} className="mr-2" />
            <span>{option}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// --- মূল কম্পোনেন্ট ---

export const TenderListTab = ({ data, loading }) => {
  const allFinancialYears = useMemo(
    () => [...new Set(data.map((item) => item.financialYear))].sort((a, b) => b.localeCompare(a)),
    [data]
  );

  // ডিফল্টভাবে সব অর্থবছর সিলেক্ট করা থাকবে
  const [selectedYears, setSelectedYears] = useState(allFinancialYears);

  // 처음 로드 시 selectedYears 초기화
  useEffect(() => {
    setSelectedYears(allFinancialYears);
  }, [allFinancialYears]);

  const groupedAndFilteredData = useMemo(() => {
    if (!selectedYears.length) return {};

    const filteredData = data.filter((item) => selectedYears.includes(item.financialYear));

    const grouped = filteredData.reduce((acc, tender) => {
      const year = tender.financialYear;
      if (!acc[year]) {
        acc[year] = { tenders: [], total: 0 };
      }
      acc[year].tenders.push(tender);
      acc[year].total += parseFloat(tender.actualPaymentJvShare) || 0;
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a))
      .reduce((obj, key) => {
        obj[key] = grouped[key];
        return obj;
      }, {});
  }, [data, selectedYears]);

  const tableHeaders = [
    "S. No.",
    "Tender ID",
    "Package No",
    "Procuring Entity",
    "Description of Works",
    "JV Share (%)",
    "Payment Amount",
    "Status",
  ];

  return (
    <div className="bg-orange-50 p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h3 className="font-semibold text-orange-800 text-xl">Tender Summary List</h3>
        <MultiSelectFilter
          title="Filter by Financial Year"
          options={allFinancialYears}
          selectedValues={selectedYears}
          onChange={setSelectedYears}
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading contract information...</div>
      ) : Object.keys(groupedAndFilteredData).length === 0 ? (
        <div className="text-center py-10 text-gray-500">No completed contracts found.</div>
      ) : (
        Object.entries(groupedAndFilteredData).map(([year, groupData]) => (
          <div key={year} className="mb-8">
            <h4 className="text-lg font-bold text-gray-700 bg-orange-100 p-2 rounded-t-md">
              Financial Year: {year}
            </h4>

            {/* ডেস্কটপ ভিউ */}
            <div className="overflow-x-auto hidden lg:block">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    {tableHeaders.map((h) => (
                      <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {groupData.tenders.map((tender, index) => (
                    <tr key={tender.tenderId} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{tender.tenderId}</td>
                      <td className="px-4 py-3">{tender.packageNo}</td>
                      <td className="px-4 py-3">{tender.procuringEntityName}</td>
                      <td className="px-4 py-3">{tender.descriptionOfWorks}</td>
                      <td className="px-4 py-3 text-center">{tender.jvShare}%</td>
                      <td className="px-4 py-3 text-right font-mono">
                        {parseFloat(tender.actualPaymentJvShare).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={tender.Status_Complite_ongoing} />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-200 font-bold">
                  <tr>
                    <td colSpan={tableHeaders.length - 2} className="px-4 py-3 text-right">
                      Total for {year}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {groupData.total.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* মোবাইল ভিউ */}
            <div className="lg:hidden bg-white p-2 rounded-b-md">
              {groupData.tenders.map((tender, index) => (
                <div
                  key={tender.tenderId}
                  className="border rounded-lg p-3 space-y-2 mb-3 shadow-sm"
                >
                  <div className="flex justify-between border-b pb-2">
                    <h5 className="font-bold">{tender.tenderId}</h5>
                    <span className="text-sm">#{index + 1}</span>
                  </div>
                  <p>
                    <strong>Package No:</strong> {tender.packageNo}
                  </p>
                  <p>
                    <strong>Payment Amount:</strong> BDT{" "}
                    {parseFloat(tender.actualPaymentJvShare).toLocaleString("en-IN")}
                  </p>
                  <p>
                    <strong>Status:</strong> <StatusBadge status={tender.Status_Complite_ongoing} />
                  </p>
                </div>
              ))}
              <div className="text-right font-bold p-3 bg-gray-200 rounded-md">
                Total for {year}: BDT{" "}
                {groupData.total.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
