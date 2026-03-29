// src/components/TenderTabs/OngoingTenderTab.tsx

// @ts-nocheck
import React, { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

// --- ইউটিলিটি কম্পোনেন্ট ---
const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 text-xs font-semibold rounded-full ${
      status === "Completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
    }`}
  >
    {status}
  </span>
);

// --- মূল কম্পোনেন্ট ---
export const OngoingTenderTab = ({ data, loading, setReload }) => {
  const [nYear, setNYear] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  // শুধু "Ongoing" স্ট্যাটাসের ডেটা ফিল্টার করুন
  const ongoingData = useMemo(
    () => data.filter((item) => item.Status_Complite_ongoing === "ongoing"),
    [data]
  );

  // অর্থবছর অনুযায়ী ডেটা গ্রুপ করুন
  const groupedData = useMemo(() => {
    return ongoingData.reduce((acc, item) => {
      const year = item.financialYear;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(item);
      return acc;
    }, {});
  }, [ongoingData]);

  // Effect removed: Calculation is now handled in parent component for better performance

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
    } catch {
      return "N/A";
    }
  };

  // Initialize nYear state from data
  useEffect(() => {
    const initialNYear = {};
    data.forEach((item) => {
      // Try multiple possible ID fields
      const itemId = item._id || item.id || item.contractId || item.tenderId;
      if (itemId) {
        initialNYear[itemId] = item.nYear || "";
      }
    });
    setNYear(initialNYear);
  }, [data]);

  // Handle nYear input change
  const handleNYearChange = (contractId, value) => {
    setNYear((prev) => ({
      ...prev,
      [contractId]: value,
    }));
  };

  // Handle update nYear
  const handleUpdateNYear = async (contractId, contractItem) => {
    // Backend now accepts MongoDB _id directly
    const idToUse = contractItem?._id || contractId;

    if (!idToUse) {
      toast.error("Contract ID is missing");
      return;
    }

    // Get the nYear value from state using the _id as key
    const yearValue = nYear[contractItem?._id] || nYear[contractId] || contractItem?.nYear;
    if (!yearValue || isNaN(yearValue) || parseFloat(yearValue) <= 0) {
      toast.error("Please enter a valid number for N Year");
      return;
    }

    setUpdatingId(idToUse);
    const toastId = toast.loading("Updating N Year...");

    try {
      const nYearValue = parseFloat(yearValue);

      const response = await axiosInstance.patch(`/contract-information/${idToUse}`, {
        nYear: nYearValue,
      });

      if (response.data?.success) {
        toast.success("N Year updated successfully", { id: toastId });
        if (setReload) {
          setReload((prev) => prev + 1);
        }
      } else {
        throw new Error(response.data?.message || "Failed to update");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to update N Year";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    { Header: "Tender ID", accessor: "tenderId" },
    { Header: "Package No", accessor: "packageNo" },
    { Header: "Procuring Entity", accessor: "procuringEntityName" },
    { Header: "Description", accessor: "descriptionOfWorks" },
    { Header: "Commencement", accessor: (item) => formatDate(item.commencementDate) },
    { Header: "End Date", accessor: (item) => formatDate(item.contractEndDate) },
    {
      Header: "Revised Contract Value",
      accessor: (item) => parseFloat(item.revisedContractValue || 0).toLocaleString("en-IN"),
    },
    {
      Header: "Payment Amount",
      accessor: (item) => parseFloat(item.actualPaymentJvShare || 0).toLocaleString("en-IN"),
    },
    { Header: "JV Share (%)", accessor: "jvShare" },
    { Header: "N Year", accessor: "nYear", isEditable: true },
    {
      Header: "Remaining Works",
      accessor: (item) => {
        const value = parseFloat(item.RemainingWorks || 0);
        return value > 0 ? value.toLocaleString("en-IN") : "0";
      },
    },
    {
      Header: "Works in Hand",
      accessor: (item) => {
        const value = parseFloat(item.WorksInHand || 0);
        return value > 0 ? value.toLocaleString("en-IN") : "0";
      },
    },
    {
      Header: "Works in Hand / N Year",
      accessor: (item) => {
        const worksInHand = parseFloat(item.WorksInHand || 0);
        const nYearValue = parseFloat(nYear[item._id] || item.nYear || 0);
        const value = nYearValue > 0 ? worksInHand / nYearValue : 0;

        return value > 0
          ? value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : "0.00";
      },
    },
    { Header: "Action", accessor: "action", isAction: true },
  ];

  const tableData = useMemo(() => {
    return Object.entries(groupedData).map(([year, tenders]) => {
      const totals = tenders.reduce(
        (acc, item) => {
          const revisedValue = parseFloat(item.revisedContractValue) || 0;
          const payment = parseFloat(item.actualPaymentJvShare) || 0;
          const remainingWorks = parseFloat(item.RemainingWorks || 0);
          const worksInHand = parseFloat(item.WorksInHand || 0);

          const nYearValue = parseFloat(nYear[item._id] || item.nYear || 0);
          const worksInHandPerNYear = nYearValue > 0 ? worksInHand / nYearValue : 0;

          acc.revisedContractValue += revisedValue;
          acc.paymentAmount += payment;
          acc.totalRemainingWorks += remainingWorks;
          acc.totalWorksInHand += worksInHand;
          acc.totalWorksInHandPerNYear += worksInHandPerNYear;
          return acc;
        },
        {
          revisedContractValue: 0,
          paymentAmount: 0,
          totalRemainingWorks: 0,
          totalWorksInHand: 0,
          totalWorksInHandPerNYear: 0,
        }
      );

      return { year, tenders, totals };
    });
  }, [groupedData, nYear]);

  // Calculate Grand Total across all financial years
  const grandTotal = useMemo(() => {
    return tableData.reduce(
      (acc, group) => {
        acc.revisedContractValue += group.totals.revisedContractValue;
        acc.paymentAmount += group.totals.paymentAmount;
        acc.totalRemainingWorks += group.totals.totalRemainingWorks;
        acc.totalWorksInHand += group.totals.totalWorksInHand;
        acc.totalWorksInHandPerNYear += group.totals.totalWorksInHandPerNYear;
        return acc;
      },
      {
        revisedContractValue: 0,
        paymentAmount: 0,
        totalRemainingWorks: 0,
        totalWorksInHand: 0,
        totalWorksInHandPerNYear: 0,
      }
    );
  }, [tableData]);

  return (
    <div className="bg-green-50 p-4 rounded-lg space-y-4">
      <h3 className="font-semibold text-green-800 text-xl mb-4">Ongoing Works Summary</h3>
      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading ongoing contracts...</p>
      ) : tableData.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No ongoing contracts found.</p>
      ) : (
        tableData.map((group) => (
          <div key={group.year} className="mb-6">
            <h4 className="text-lg font-bold text-gray-700 bg-green-100 p-2 rounded-t-md">
              Financial Year: {group.year}
            </h4>

            {/* ডেস্কটপ ভিউ */}
            <div className="overflow-x-auto hidden lg:block">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    {columns.map((col) => {
                      // Define width classes for different columns
                      let widthClass = "";
                      if (col.Header === "Tender ID") widthClass = "w-24";
                      else if (col.Header === "Package No") widthClass = "w-40";
                      else if (col.Header === "Procuring Entity") widthClass = "w-48";
                      else if (col.Header === "Description") widthClass = "w-64 max-w-xs";
                      else if (col.Header === "Commencement") widthClass = "w-32";
                      else if (col.Header === "End Date") widthClass = "w-32";
                      else if (col.Header === "Revised Contract Value") widthClass = "w-32";
                      else if (col.Header === "Payment Amount") widthClass = "w-32";
                      else if (col.Header === "JV Share (%)") widthClass = "w-20";
                      else if (col.Header === "N Year") widthClass = "w-20";
                      else widthClass = "w-24";

                      return (
                        <th
                          key={col.Header}
                          className={`px-4 py-3 font-medium whitespace-nowrap ${widthClass}`}
                        >
                          {col.Header}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {group.tenders.map((item) => (
                    <tr key={item.tenderId || item._id} className="hover:bg-gray-50">
                      {columns.map((column, index) => {
                        // Handle action column - only Update button
                        if (column.isAction) {
                          // Use _id directly as backend now accepts MongoDB _id
                          const itemId = item._id;
                          return (
                            <td key={index} className="px-4 py-3 text-center">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateNYear(itemId, item)}
                                disabled={updatingId === itemId}
                                className="h-8 text-xs px-3"
                              >
                                {updatingId === itemId ? "Updating..." : "Update"}
                              </Button>
                            </td>
                          );
                        }

                        // Handle editable N Year column - with input field
                        if (column.isEditable && column.Header === "N Year") {
                          return (
                            <td key={index} className="px-4 py-3 text-center">
                              <Input
                                type="number"
                                min="1"
                                value={nYear[item._id] || item.nYear || ""}
                                onChange={(e) => handleNYearChange(item._id, e.target.value)}
                                className="w-20 h-8 text-sm text-center"
                                placeholder="N Year"
                              />
                            </td>
                          );
                        }

                        const cellValue = column.Cell
                          ? column.Cell({ row: { original: item } })
                          : typeof column.accessor === "function"
                            ? column.accessor(item)
                            : item[column.accessor];
                        // Apply different styling based on column type
                        const isNumericColumn = [
                          "Revised Contract Value",
                          "Payment Amount",
                          "JV Share (%)",
                          "Remaining Works",
                          "Works in Hand",
                          "Works in Hand / N Year",
                        ].includes(column.Header);
                        const isDescriptionColumn = column.Header === "Description";

                        let cellClass = "";
                        if (isNumericColumn) {
                          cellClass = "px-4 py-3 text-right font-mono";
                        } else if (isDescriptionColumn) {
                          cellClass = "px-4 py-3 text-left max-w-xs truncate";
                        } else {
                          cellClass = "px-4 py-3 text-left";
                        }

                        // Handle empty values - show '0' for numeric columns, 'N/A' for others
                        let displayValue = cellValue;
                        if (cellValue === null || cellValue === undefined || cellValue === "") {
                          if (isNumericColumn) {
                            displayValue = "0";
                          } else {
                            displayValue = "N/A";
                          }
                        }
                        return (
                          <td
                            key={index}
                            className={cellClass}
                            title={isDescriptionColumn ? displayValue : undefined}
                          >
                            {displayValue}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-200 font-bold">
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-right">
                      Total for {group.year}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {group.totals.revisedContractValue.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {group.totals.paymentAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right"></td>
                    <td className="px-4 py-3 text-right"></td>
                    <td className="px-4 py-3 text-right font-mono">
                      {group.totals.totalRemainingWorks.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {group.totals.totalWorksInHand.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {group.totals.totalWorksInHandPerNYear.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-right"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* মোবাইল ভিউ */}
            <div className="lg:hidden bg-white p-2 rounded-b-md">
              {group.tenders.map((item, index) => (
                <div
                  key={item.tenderId || item._id}
                  className="border rounded-lg p-3 space-y-2 mb-3 shadow-sm"
                >
                  <div className="flex justify-between border-b pb-2">
                    <h5 className="font-bold">{item.tenderId}</h5>
                    <span className="text-sm">#{index + 1}</span>
                  </div>
                  <p>
                    <strong>Package No:</strong> {item.packageNo}
                  </p>
                  <p>
                    <strong>Description:</strong> {item.descriptionOfWorks}
                  </p>
                  <p>
                    <strong>Payment Amount:</strong> BDT{" "}
                    {parseFloat(item.actualPaymentJvShare || 0).toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-2">
                    <strong>N Year:</strong>
                    <Input
                      type="number"
                      min="1"
                      value={nYear[item._id] || item.nYear || ""}
                      onChange={(e) => handleNYearChange(item._id, e.target.value)}
                      className="flex-1 h-8 text-sm"
                      placeholder="N Year"
                    />
                  </div>
                  <p>
                    <strong>Remaining Works:</strong> BDT{" "}
                    {parseFloat(item.RemainingWorks || 0) > 0
                      ? parseFloat(item.RemainingWorks || 0).toLocaleString("en-IN")
                      : "0"}
                  </p>
                  <p>
                    <strong>Works in Hand:</strong> BDT{" "}
                    {parseFloat(item.WorksInHand || 0) > 0
                      ? parseFloat(item.WorksInHand || 0).toLocaleString("en-IN")
                      : "0"}
                  </p>
                  <p>
                    <strong>Works in Hand / N Year:</strong> BDT{" "}
                    {(() => {
                      const worksInHand = parseFloat(item.WorksInHand || 0);
                      const nYearValue = parseFloat(nYear[item._id] || item.nYear || 0);
                      const value = nYearValue > 0 ? worksInHand / nYearValue : 0;
                      return value > 0
                        ? value.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "0.00";
                    })()}
                  </p>
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateNYear(item._id, item)}
                      disabled={updatingId === item._id}
                      className="w-full h-8 text-xs"
                    >
                      {updatingId === item._id ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </div>
              ))}
              <div className="text-right font-bold p-3 bg-gray-200 rounded-md space-y-1">
                <div>
                  Total for {group.year}: BDT {group.totals.paymentAmount.toLocaleString("en-IN")}
                </div>
                <div>
                  Total Works in Hand: BDT {group.totals.totalWorksInHand.toLocaleString("en-IN")}
                </div>
                <div>
                  Total Works in Hand / N Year ={" "}
                  {group.totals.totalWorksInHandPerNYear.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Grand Total Section - shown only if there's data */}
      {!loading && tableData.length > 0 && (
        <div className="mt-6">
          {/* Desktop Grand Total */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <tfoot className="bg-gray-700 text-white font-bold text-base">
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-right">
                    GRAND TOTAL (All Years)
                  </td>
                  <td className="px-4 py-4 text-right font-mono"></td>
                  <td className="px-4 py-4 text-right font-mono"></td>
                  <td className="px-4 py-4 text-right"></td>
                  <td className="px-4 py-4 text-right"></td>
                  <td className="px-4 py-4 text-right font-mono"></td>
                  <td className="px-4 py-4 text-right font-mono"></td>
                  <td className="px-4 py-4 text-right font-mono text-yellow-300">
                    {grandTotal.totalWorksInHandPerNYear.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-4 text-right"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile Grand Total */}
          <div className="lg:hidden bg-green-700 text-white p-4 rounded-lg space-y-2 font-bold">
            <div className="text-lg border-b border-green-500 pb-2">GRAND TOTAL (All Years)</div>
            <div className="flex justify-between text-yellow-300 text-lg pt-2">
              <span>Works in Hand / N Year:</span>
              <span>
                {grandTotal.totalWorksInHandPerNYear.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
