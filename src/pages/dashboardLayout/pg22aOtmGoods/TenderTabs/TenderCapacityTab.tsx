// src/components/TenderTabs/TenderCapacityTab.tsx

// @ts-nocheck
import React, { useMemo, useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

// --- মূল কম্পোনেন্ট ---
export const TenderCapacityTab = ({
    yearlyTotals,
    totalOngoingCommitments,
    egpEmail,
    tdsRequiredFY: externalTdsRequiredFY,
    setTdsRequiredFY: externalSetTdsRequiredFY,
    proposedProjectYear: externalProposedProjectYear,
    setProposedProjectYear: externalSetProposedProjectYear
}) => {
    // Use external state if provided, otherwise use local state (for backwards compatibility)
    const [localTdsRequiredFY, setLocalTdsRequiredFY] = useState('');
    const [localProposedProjectYear, setLocalProposedProjectYear] = useState('');

    const tdsRequiredFY = externalTdsRequiredFY !== undefined ? externalTdsRequiredFY : localTdsRequiredFY;
    const setTdsRequiredFY = externalSetTdsRequiredFY || setLocalTdsRequiredFY;
    const proposedProjectYear = externalProposedProjectYear !== undefined ? externalProposedProjectYear : localProposedProjectYear;
    const setProposedProjectYear = externalSetProposedProjectYear || setLocalProposedProjectYear;

    const [isUpdating, setIsUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [existingData, setExistingData] = useState(null);
    const factor = 1.25;

    // Fetch existing data on component mount
    useEffect(() => {
        const fetchExistingData = async () => {
            try {
                setLoading(true);
                if (!egpEmail) return;

                // Search for tender preparation by egpEmail
                const searchResponse = await axiosInstance.get(`/tender-preparation?searchTerm=${encodeURIComponent(egpEmail)}&page=1&limit=10`);
                const tenderPreparations = searchResponse.data?.data || [];

                if (tenderPreparations.length > 0) {
                    // Find the tender-preparation with matching egpEmail
                    const tenderPrep = tenderPreparations.find(tp => tp.egpEmail === egpEmail) || tenderPreparations[0];
                    setExistingData(tenderPrep);

                    // Populate form fields with existing data if available
                    if (tenderPrep.tdsYearFinancialCapacity) {
                        setTdsRequiredFY(String(tenderPrep.tdsYearFinancialCapacity));
                    }
                    if (tenderPrep.proposeYear) {
                        setProposedProjectYear(String(tenderPrep.proposeYear));
                    }


                }
            } catch (error) {
                console.error('Error fetching existing data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (egpEmail) {
            fetchExistingData();
        }
    }, [egpEmail]);

    // A = শেষ N বছরের মধ্যে সর্বোচ্চ টার্নওভার
    const valueA = useMemo(() => {
        const fyValue = Number(tdsRequiredFY);

        // If no input but we have saved data, use saved maximum value
        if (!fyValue && existingData?.Maximumvalue) {
            return Number(existingData.Maximumvalue);
        }

        if (!yearlyTotals || yearlyTotals.length === 0 || !fyValue) return 0;

        const relevantYears = yearlyTotals
            .sort((a, b) => b.year.localeCompare(a.year)) // নতুন থেকে পুরোনো বছর অনুযায়ী সাজানো
            .slice(0, fyValue); // শেষ N বছরের ডেটা নেওয়া

        // সর্বোচ্চ অ্যামাউন্ট খুঁজে বের করা
        return Math.max(0, ...relevantYears.map(y => y.amount));
    }, [yearlyTotals, tdsRequiredFY, existingData]);

    // যে বছরে সর্বোচ্চ টার্নওভার হয়েছিল সেই বছর খুঁজে বের করা
    const financialYearOfMaxValue = useMemo(() => {
        const fyValue = Number(tdsRequiredFY);

        // If no input but we have saved data, use saved year
        if (!fyValue && existingData?.FinancialYearofMaximumvalue) {
            return existingData.FinancialYearofMaximumvalue;
        }

        if (!yearlyTotals || yearlyTotals.length === 0 || !fyValue) return '';

        const relevantYears = yearlyTotals
            .sort((a, b) => b.year.localeCompare(a.year))
            .slice(0, fyValue);

        if (relevantYears.length === 0) return '';

        const maxYear = relevantYears.reduce((max, current) =>
            current.amount > max.amount ? current : max
            , relevantYears[0]);

        return maxYear?.year || '';
    }, [yearlyTotals, tdsRequiredFY, existingData]);

    // N = প্রস্তাবিত প্রকল্পের সময়কাল
    const valueN = Number(proposedProjectYear) || 0;

    // B = চলমান কাজের মোট পরিমাণ
    const valueB = totalOngoingCommitments;

    // Assessed Tender Capacity গণনা
    const assessedCapacity = useMemo(() => {
        // If no input but we have saved data, use saved capacity
        if (!Number(proposedProjectYear) && !Number(tdsRequiredFY) && existingData?.FinalAssessedTenderCapacity) {
            return Number(existingData.FinalAssessedTenderCapacity);
        }
        return (valueA * valueN * factor) - valueB;
    }, [valueA, valueN, factor, valueB, proposedProjectYear, tdsRequiredFY, existingData]);

    // Update Handler - follows TurnoverHistoryTab approach
    const handleUpdate = async () => {
        if (!egpEmail) {
            toast.error('Email ID is missing');
            return;
        }

        setIsUpdating(true);
        const toastId = toast.loading('Updating Tender Capacity...');

        try {
            // First, get tender-preparation ID by egpEmail (same as TurnoverHistoryTab)
            const searchResponse = await axiosInstance.get(`/tender-preparation?searchTerm=${encodeURIComponent(egpEmail)}&page=1&limit=10`);
            const tenderPreparations = searchResponse.data?.data || [];

            if (tenderPreparations.length === 0) {
                throw new Error('Tender preparation not found for this email. Please create a tender preparation first.');
            }

            // Find the tender-preparation with matching egpEmail
            const tenderPrep = tenderPreparations.find(tp => tp.egpEmail === egpEmail) || tenderPreparations[0];
            const tenderPreparationId = tenderPrep._id;



            // Parse and validate all number values to avoid NaN
            const maxValue = parseFloat(String(valueA || 0));
            const bValue = parseFloat(String(valueB || 0));
            const assessedCap = parseFloat(String(assessedCapacity || 0));
            const tdsYear = parseInt(String(tdsRequiredFY || 0), 10);
            const propYear = parseInt(String(proposedProjectYear || 0), 10);

            // Create clean payload with ONLY the tender capacity fields
            // Following TurnoverHistoryTab pattern - explicitly define each field
            const cleanPayload = {
                FinancialYearofMaximumvalue: String(financialYearOfMaxValue || ''),
                Maximumvalue: (isNaN(maxValue) || !isFinite(maxValue)) ? 0 : Number(parseFloat(maxValue.toFixed(2))),
                valueB: (isNaN(bValue) || !isFinite(bValue)) ? 0 : Number(parseFloat(bValue.toFixed(2))),
                FinalAssessedTenderCapacity: (isNaN(assessedCap) || !isFinite(assessedCap)) ? 0 : Number(parseFloat(assessedCap.toFixed(2))),
                tdsYearFinancialCapacity: (isNaN(tdsYear) || !isFinite(tdsYear)) ? 0 : Number(tdsYear),
                proposeYear: (isNaN(propYear) || !isFinite(propYear)) ? 0 : Number(propYear)
            };

            // Define allowed fields for tender capacity
            const allowedFields = [
                'FinancialYearofMaximumvalue',
                'Maximumvalue',
                'valueB',
                'FinalAssessedTenderCapacity',
                'tdsYearFinancialCapacity',
                'proposeYear'
            ];

            // Remove any field that's not in the allowed list (extra safety)
            Object.keys(cleanPayload).forEach(key => {
                if (!allowedFields.includes(key)) {
                    console.warn(`Removing unexpected field from payload: ${key}`);
                    delete cleanPayload[key];
                }
            });



            // Use _id for PATCH request (not egpEmail)
            const response = await axiosInstance.patch(
                `/tender-preparation/${tenderPreparationId}`,
                cleanPayload
            );

            if (response.data?.success) {
                toast.success('Tender Capacity updated successfully', { id: toastId });

                // Refresh saved data to show updated values
                const updatedResponse = await axiosInstance.get(`/tender-preparation?searchTerm=${encodeURIComponent(egpEmail)}&page=1&limit=10`);
                const updatedPreparations = updatedResponse.data?.data || [];
                if (updatedPreparations.length > 0) {
                    const updatedPrep = updatedPreparations.find(tp => tp.egpEmail === egpEmail) || updatedPreparations[0];
                    setExistingData(updatedPrep);

                }
            } else {
                throw new Error(response.data?.message || 'Failed to update');
            }
        } catch (error) {
            console.error('Error updating tender capacity:', error);
            console.error('Error response:', error?.response?.data);
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update Tender Capacity';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    // টেবিলের সারির জন্য ডেটা
    const calculationRows = [
        { label: `(A) Maximum value of Works performed in any one year during last ${tdsRequiredFY} years`, value: valueA },
        { label: `(N) Completion time of the proposed work in years`, value: valueN },
        { label: `(B) Value of Existing commitments and works to be completed`, value: valueB },
        { label: 'Factor', value: factor },
    ];

    return (
        <div className="bg-indigo-50 p-4 rounded-lg space-y-6">
            <h3 className="font-semibold text-indigo-800 text-xl">Tender Capacity Calculation</h3>

            {/* ইনপুট ফিল্ড */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <Label htmlFor="tdsRequiredFY">TDS Required (Last N Financial Years)</Label>
                    <Input id="tdsRequiredFY" type="number" value={tdsRequiredFY} onChange={(e) => setTdsRequiredFY(Number(e.target.value) || 0)} />
                </div>
                <div>
                    <Label htmlFor="proposedProjectYear">Proposed Project Year (N)</Label>
                    <Input id="proposedProjectYear" type="number" value={proposedProjectYear} onChange={(e) => setProposedProjectYear(Number(e.target.value) || 0)} />
                </div>
            </div>

            {/* ক্যালকুলেশন টেবিল */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left bg-white rounded-lg shadow-sm">
                    <thead className="bg-gray-700 text-white">
                        <tr>
                            <th className="p-3 w-3/4">Description</th>
                            <th className="p-3 text-right">Value (BDT)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calculationRows.map(row => (
                            <tr key={row.label} className="border-b">
                                <td className="p-3 font-medium">{row.label}</td>
                                <td className="p-3 text-right font-mono">
                                    {row.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-200 font-bold text-lg">
                        <tr>
                            <td className="p-3 text-right">Assessed Tender Capacity = (A × N × {factor.toFixed(2)} - B)</td>
                            <td className="p-3 text-right font-mono">
                                {assessedCapacity.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* চূড়ান্ত ফলাফল প্রদর্শনের জন্য একটি কার্ড */}
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <h4 className="font-semibold text-lg mb-2">Final Assessed Tender Capacity</h4>
                <p className={`text-3xl font-bold ${assessedCapacity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    BDT {assessedCapacity.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {financialYearOfMaxValue && (
                    <p className="text-sm text-gray-600 mt-2">
                        Financial Year of Maximum Value: <span className="font-semibold">{financialYearOfMaxValue}</span>
                    </p>
                )}
            </div>

            {/* Update Button */}
            <div className="flex justify-center">
                <Button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="px-8 py-2"
                >
                    {isUpdating ? 'Saving...' : 'Save Tender Capacity'}
                </Button>
            </div>
        </div>
    );
};