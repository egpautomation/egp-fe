// src/components/TenderTabs/TurnoverHistoryTab.tsx

// @ts-nocheck
import React, { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

// --- Componente principale ---
export const TurnoverHistoryTab = ({
  yearlyTotals,
  tdsRequiredFY,
  setTdsRequiredFY,
  tdsRequiredBestYear,
  setTdsRequiredBestYear,
}) => {
  const { id } = useParams(); // egpEmail from URL
  // Local state moved to parent
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingData, setExistingData] = useState(null);
  const [savedFinancialYears, setSavedFinancialYears] = useState([]);

  // Fetch existing data on component mount
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        setLoading(true);
        // Fetch tender preparation directly by _id (not by search)
        const response = await axiosInstance.get(`/tender-preparation/${id}`);
        const tenderPrep = response.data?.data;

        if (tenderPrep) {
          setExistingData(tenderPrep);

          // Extract saved financial years from API data
          const savedYears = [];
          for (let i = 1; i <= 5; i++) {
            const yearName = tenderPrep[`FinancialYear${i}Name`];
            const yearAmount = tenderPrep[`FinancialYear${i}Amount`];
            if (yearName) {
              savedYears.push({
                year: yearName,
                amount: Number(yearAmount) || 0,
              });
            }
          }
          setSavedFinancialYears(savedYears);

          // Set input fields logic moved to parent component
        }
      } catch (error) {
        console.error("Error fetching existing data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExistingData();
    }
  }, [id]);

  // Filtra e ordina gli anni in base all'input "TDS_Required_FY"
  const filteredAndSortedYears = useMemo(() => {
    const fyValue = Number(tdsRequiredFY);
    if (!fyValue || fyValue <= 0) return [];

    return yearlyTotals
      .sort((a, b) => b.year.localeCompare(a.year)) // Ordina dal più recente al meno recente
      .slice(0, fyValue); // Prendi gli ultimi N anni
  }, [yearlyTotals, tdsRequiredFY]);

  // Trova i migliori anni in base al fatturato
  const bestYears = useMemo(() => {
    // If we have saved data and no new input, show saved data
    if (savedFinancialYears.length > 0 && !tdsRequiredBestYear) {
      return savedFinancialYears;
    }

    // Otherwise calculate from filtered years
    const bestYearValue = Number(tdsRequiredBestYear);
    if (!bestYearValue || bestYearValue <= 0) return savedFinancialYears;

    return [...filteredAndSortedYears]
      .sort((a, b) => b.amount - a.amount) // Ordina per importo decrescente
      .slice(0, bestYearValue); // Prendi i migliori N anni
  }, [filteredAndSortedYears, tdsRequiredBestYear, savedFinancialYears]);

  // Calcola la somma dei migliori anni
  const sumOfBestYears = useMemo(
    () => bestYears.reduce((sum, year) => sum + year.amount, 0),
    [bestYears]
  );

  // Calcola il fatturato medio annuo
  const averageAnnualTurnover = useMemo(() => {
    const bestYearValue = Number(tdsRequiredBestYear);
    if (bestYearValue > 0) {
      return sumOfBestYears / bestYearValue;
    }
    // If no input but we have saved data, use saved average
    if (existingData?.AverageAnnualTurnover) {
      return Number(existingData.AverageAnnualTurnover);
    }
    return 0;
  }, [sumOfBestYears, tdsRequiredBestYear, existingData]);

  // Handle save data
  const handleSave = async () => {
    if (bestYears.length === 0) {
      toast.error("No data to save. Please ensure there are completed contracts.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Saving turnover history...");

    try {
      // Prepare data - take top 5 best years
      const top5BestYears = bestYears.slice(0, 5);

      // Build save data object with only required fields - ensure valid numbers, no NaN
      const tdsFY = parseInt(String(tdsRequiredFY), 10);
      const tdsBest = parseInt(String(tdsRequiredBestYear), 10);
      const avgTurnover = parseFloat(String(averageAnnualTurnover));

      const saveData = {
        tdsYearFinancial: !isNaN(tdsFY) && isFinite(tdsFY) ? tdsFY : 0,
        tdsYearBest: !isNaN(tdsBest) && isFinite(tdsBest) ? tdsBest : 0,
        AverageAnnualTurnover: !isNaN(avgTurnover) && isFinite(avgTurnover) ? avgTurnover : 0,
      };

      // Add FinancialYear1Name, FinancialYear1Amount, etc. for top 5 years
      top5BestYears.forEach((year, index) => {
        const yearNum = index + 1;
        const amount = parseFloat(year.amount) || 0;
        saveData[`FinancialYear${yearNum}Name`] = String(year.year || "");
        saveData[`FinancialYear${yearNum}Amount`] = isNaN(amount) ? 0 : amount;
      });

      // Fill remaining years with empty values if less than 5
      for (let i = top5BestYears.length + 1; i <= 5; i++) {
        saveData[`FinancialYear${i}Name`] = "";
        saveData[`FinancialYear${i}Amount`] = 0;
      }

      // Final validation - ensure all number fields are valid numbers, not NaN
      Object.keys(saveData).forEach((key) => {
        const value = saveData[key];
        if (
          key.includes("Amount") ||
          key === "AverageAnnualTurnover" ||
          key === "tdsYearFinancial" ||
          key === "tdsYearBest"
        ) {
          // This is a number field
          const numValue = parseFloat(value);
          if (isNaN(numValue) || !isFinite(numValue)) {
            saveData[key] = 0;
          } else {
            saveData[key] = numValue;
          }
        } else if (value === undefined || value === null) {
          saveData[key] = "";
        }
      });

      // Use the id directly - it's already the tender preparation _id from URL
      const tenderPreparationId = id;

      // Create clean payload with ONLY the turnover history fields
      // Explicitly define each field to avoid any accidental field inclusion
      // Do NOT include jobOrder, egpEmail, tenderId, or any other existing fields
      const tdsFYNum = parseInt(String(tdsRequiredFY), 10);
      const tdsBestNum = parseInt(String(tdsRequiredBestYear), 10);
      const avgTurnoverNum = parseFloat(String(averageAnnualTurnover));

      // Build payload explicitly - only allowed fields
      const cleanPayload = {};

      // Add only turnover-related fields - send as strings to match backend schema
      cleanPayload.tdsYearFinancial = String(tdsFYNum || 0);
      cleanPayload.tdsYearBest = String(tdsBestNum || 0);
      cleanPayload.AverageAnnualTurnover =
        isNaN(avgTurnoverNum) || !isFinite(avgTurnoverNum)
          ? 0
          : Number(parseFloat(avgTurnoverNum.toFixed(2)));

      // Add Financial Year fields - ensure all are valid numbers/strings
      for (let i = 1; i <= 5; i++) {
        const nameKey = `FinancialYear${i}Name`;
        const amountKey = `FinancialYear${i}Amount`;
        const nameValue = saveData[nameKey];
        const amountValue = saveData[amountKey];

        // Ensure name is a string
        cleanPayload[nameKey] =
          nameValue === undefined || nameValue === null ? "" : String(nameValue);

        // Ensure amount is a valid number
        const amount = parseFloat(String(amountValue || 0));
        cleanPayload[amountKey] =
          isNaN(amount) || !isFinite(amount) ? 0 : Number(parseFloat(amount.toFixed(2)));
      }

      // Verify payload does NOT contain jobOrder or other fields
      const allowedFields = [
        "tdsYearFinancial",
        "tdsYearBest",
        "AverageAnnualTurnover",
        "FinancialYear1Name",
        "FinancialYear1Amount",
        "FinancialYear2Name",
        "FinancialYear2Amount",
        "FinancialYear3Name",
        "FinancialYear3Amount",
        "FinancialYear4Name",
        "FinancialYear4Amount",
        "FinancialYear5Name",
        "FinancialYear5Amount",
      ];

      // Remove any field that's not in the allowed list (extra safety)
      Object.keys(cleanPayload).forEach((key) => {
        if (!allowedFields.includes(key)) {
          console.warn(`Removing unexpected field from payload: ${key}`);
          delete cleanPayload[key];
        }
      });

      // Now patch the data - only send turnover history fields
      // Backend should NOT validate jobOrder since it's not in the payload
      const response = await axiosInstance.patch(
        `/tender-preparation/${tenderPreparationId}`,
        cleanPayload
      );

      if (response.data?.success) {
        toast.success("Turnover history saved successfully", { id: toastId });

        // Refresh saved data to show updated values - fetch directly by ID
        const updatedResponse = await axiosInstance.get(`/tender-preparation/${id}`);
        const updatedPrep = updatedResponse.data?.data;

        if (updatedPrep) {
          setExistingData(updatedPrep);

          // Update saved financial years
          const updatedYears = [];
          for (let i = 1; i <= 5; i++) {
            const yearName = updatedPrep[`FinancialYear${i}Name`];
            const yearAmount = updatedPrep[`FinancialYear${i}Amount`];
            if (yearName) {
              updatedYears.push({
                year: yearName,
                amount: Number(yearAmount) || 0,
              });
            }
          }
          setSavedFinancialYears(updatedYears);
        }
      } else {
        throw new Error(response.data?.message || "Failed to save");
      }
    } catch (error) {
      console.error("Error saving turnover history:", error);
      console.error("Error response:", error?.response?.data);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to save turnover history";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-purple-50 p-4 rounded-lg space-y-6">
      <h3 className="font-semibold text-purple-800 text-xl">
        Annual Turnover History & Calculation
      </h3>

      {/* Campi di input per i filtri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <Label htmlFor="tdsRequiredFY">TDS Required (Last N Financial Years)</Label>
          <Input
            id="tdsRequiredFY"
            type="number"
            value={tdsRequiredFY}
            onChange={(e) => setTdsRequiredFY(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tdsRequiredBestYear">TDS Required (Best N Years)</Label>
          <Input
            id="tdsRequiredBestYear"
            type="number"
            value={tdsRequiredBestYear}
            onChange={(e) => setTdsRequiredBestYear(e.target.value)}
          />
        </div>
      </div>

      {/* Tabella degli anni filtrati */}
      <div>
        <h4 className="font-semibold text-lg mb-2">
          Turnover for the Last {tdsRequiredFY} Financial Years
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left bg-white rounded-lg shadow-sm">
            <thead className="bg-gray-700 text-white">
              <tr className="text-left">
                <th className="p-3">SL</th>
                <th className="p-3">Financial Year</th>
                <th className="p-3 text-right">Amount (BDT)</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedYears.length > 0 ? (
                filteredAndSortedYears.map((item, index) => (
                  <tr key={item.year} className="border-b">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{item.year}</td>
                    <td className="p-3 text-right font-mono">
                      {item.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabella dei migliori anni */}
      <div>
        <h4 className="font-semibold text-lg mb-2">
          Best {tdsRequiredBestYear} Years Based on Turnover
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left bg-white rounded-lg shadow-sm">
            <thead className="bg-gray-700 text-white">
              <tr className="text-left">
                <th className="p-3">SL</th>
                <th className="p-3">Financial Year</th>
                <th className="p-3 text-right">Amount (BDT)</th>
              </tr>
            </thead>
            <tbody>
              {bestYears.length > 0 ? (
                bestYears.map((item, index) => (
                  <tr key={item.year} className="border-b">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{item.year}</td>
                    <td className="p-3 text-right font-mono">
                      {item.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    No data to determine best years.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-200 font-bold">
              <tr>
                <td colSpan="2" className="p-3 text-right">
                  Sum of Best Years
                </td>
                <td className="p-3 text-right font-mono">
                  {sumOfBestYears.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Risultato finale */}
      <div className="bg-white p-4 rounded-lg shadow-md text-center space-y-4">
        <div>
          <h4 className="font-semibold text-lg mb-2">Average Annual Turnover</h4>
          <p className="text-2xl font-bold text-green-600">
            BDT{" "}
            {averageAnnualTurnover.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || bestYears.length === 0}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
        >
          {saving ? "Saving..." : "Save Turnover History"}
        </Button>
      </div>
    </div>
  );
};
