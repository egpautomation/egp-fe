// @ts-nocheck
import React from 'react';
import { Download, FileText, TrendingUp, BarChart3, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import XLSX from 'xlsx-js-style';

interface DownloadsTabProps {
    ongoingContracts: any[];
    completedContracts: any[];
    yearlyTotals: any[];
    totalOngoingCommitments: number;
    egpEmail: string;
    companyName?: string;
    tenderId?: string;
    descriptionOfWorks?: string;
    turnoverData?: any[];
    currentTender?: any;
    tdsRequiredFY?: string | number;
    tdsRequiredBestYear?: string | number;
}

export const DownloadsTab: React.FC<DownloadsTabProps> = ({
    ongoingContracts,
    completedContracts,
    yearlyTotals,
    totalOngoingCommitments,
    egpEmail,
    companyName = 'Company',
    tenderId,
    descriptionOfWorks,
    turnoverData = [],
    currentTender,
    tdsRequiredFY,
    tdsRequiredBestYear
}) => {

    // Helper function to add header to PDF
    const addPDFHeader = (doc: any, title: string) => {
        const pageWidth = doc.internal.pageSize.width;

        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(title, pageWidth / 2, 15, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont(undefined, 'bold'); // Label bold

        let currentY = 25;
        const leftMargin = 14;

        // Company
        doc.text(`Company:`, leftMargin, currentY);
        doc.setFont(undefined, 'normal');
        doc.text(companyName, leftMargin + 25, currentY);
        currentY += 5;

        // Email
        doc.setFont(undefined, 'bold');
        doc.text(`Email:`, leftMargin, currentY);
        doc.setFont(undefined, 'normal');
        doc.text(egpEmail, leftMargin + 25, currentY);
        currentY += 5;

        // Tender ID
        if (tenderId) {
            doc.setFont(undefined, 'bold');
            doc.text(`Tender ID:`, leftMargin, currentY);
            doc.setFont(undefined, 'normal');
            doc.text(String(tenderId), leftMargin + 25, currentY);
            currentY += 5;
        }

        // Description of Works
        if (descriptionOfWorks) {
            doc.setFont(undefined, 'bold');
            doc.text(`Description of Works:`, leftMargin, currentY);
            currentY += 5;

            doc.setFont(undefined, 'normal');
            const splitDescription = doc.splitTextToSize(descriptionOfWorks, pageWidth - (leftMargin * 2));
            doc.text(splitDescription, leftMargin, currentY);
            currentY += (splitDescription.length * 5) + 2;
        } else {
            currentY += 5;
        }

        return currentY; // Return Y position for content start
    };

    // Helper function to format date
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
        } catch {
            return 'N/A';
        }
    };

    // Download Ongoing Contracts - Grouped by Financial Year
    const handlePrintOngoing = () => {
        try {
            const doc = new jsPDF('landscape');
            let currentY = addPDFHeader(doc, 'Ongoing Works Summary');

            const groupedByYear = ongoingContracts.reduce((acc, contract) => {
                const year = contract.financialYear || 'Unknown';
                if (!acc[year]) acc[year] = [];
                acc[year].push(contract);
                return acc;
            }, {});

            const sortedYears = Object.keys(groupedByYear).sort((a, b) => b.localeCompare(a));
            let grandTotalWorksInHandPerNYear = 0;

            sortedYears.forEach((year, yearIndex) => {
                const contracts = groupedByYear[year];

                // Add Financial Year separator (text only, no green bar)
                doc.setFontSize(11);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text(`Financial Year: ${year}`, 14, currentY + 4);
                currentY += 8;

                const yearTableData = contracts.map((contract) => {
                    const worksInHand = parseFloat(contract.WorksInHand || 0);
                    const nYearValue = parseFloat(contract.nYear || 0);
                    const worksInHandPerNYear = nYearValue > 0 ? worksInHand / nYearValue : 0;
                    return [
                        contract.tenderId || 'N/A', contract.packageNo || 'N/A',
                        contract.procuringEntityName || 'N/A', contract.descriptionOfWorks || 'N/A',
                        formatDate(contract.commencementDate), formatDate(contract.contractEndDate),
                        parseFloat(contract.revisedContractValue || 0).toLocaleString('en-IN'),
                        parseFloat(contract.actualPaymentJvShare || 0).toLocaleString('en-IN'),
                        contract.jvShare || 'N/A', contract.nYear || 'N/A',
                        parseFloat(contract.RemainingWorks || 0).toLocaleString('en-IN'),
                        worksInHand.toLocaleString('en-IN'),
                        worksInHandPerNYear.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    ];
                });

                const yearTotals = contracts.reduce((acc, contract) => {
                    const worksInHand = parseFloat(contract.WorksInHand || 0);
                    const nYearValue = parseFloat(contract.nYear || 0);
                    acc.revisedValue += parseFloat(contract.revisedContractValue || 0);
                    acc.payment += parseFloat(contract.actualPaymentJvShare || 0);
                    acc.remainingWorks += parseFloat(contract.RemainingWorks || 0);
                    acc.worksInHand += worksInHand;
                    acc.worksInHandPerNYear += nYearValue > 0 ? worksInHand / nYearValue : 0;
                    return acc;
                }, { revisedValue: 0, payment: 0, remainingWorks: 0, worksInHand: 0, worksInHandPerNYear: 0 });

                grandTotalWorksInHandPerNYear += yearTotals.worksInHandPerNYear;

                yearTableData.push([
                    { content: `Total for ${year}`, colSpan: 6, styles: { fontStyle: 'bold', halign: 'right', fillColor: [220, 220, 220] } },
                    { content: yearTotals.revisedValue.toLocaleString('en-IN'), styles: { fontStyle: 'bold', halign: 'right', fillColor: [220, 220, 220] } },
                    { content: yearTotals.payment.toLocaleString('en-IN'), styles: { fontStyle: 'bold', halign: 'right', fillColor: [220, 220, 220] } },
                    { content: '', styles: { fillColor: [220, 220, 220] } },
                    { content: '', styles: { fillColor: [220, 220, 220] } },
                    { content: yearTotals.remainingWorks.toLocaleString('en-IN'), styles: { fontStyle: 'bold', halign: 'right', fillColor: [220, 220, 220] } },
                    { content: yearTotals.worksInHand.toLocaleString('en-IN'), styles: { fontStyle: 'bold', halign: 'right', fillColor: [220, 220, 220] } },
                    { content: yearTotals.worksInHandPerNYear.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), styles: { fontStyle: 'bold', halign: 'right', fillColor: [220, 220, 220] } }
                ]);

                autoTable(doc, {
                    startY: currentY,
                    head: [['Tender ID', 'Package No', 'Procuring Entity', 'Description', 'Commencement', 'End Date', 'Revised Contract Value', 'Payment Amount', 'JV Share (%)', 'N Year', 'Remaining Works', 'Works in Hand', 'Works in Hand / N Year']],
                    body: yearTableData,
                    theme: 'grid',
                    headStyles: { fillColor: [52, 73, 94], textColor: 255, fontStyle: 'bold', fontSize: 6, halign: 'center' },
                    styles: { fontSize: 5.5, cellPadding: 1, overflow: 'linebreak' },
                    columnStyles: {
                        0: { cellWidth: 16 }, // Tender ID
                        1: { cellWidth: 16 }, // Package No
                        2: { cellWidth: 26 }, // Procuring Entity
                        3: { cellWidth: 42 }, // Description
                        4: { cellWidth: 16, halign: 'center' }, // Commencement
                        5: { cellWidth: 16, halign: 'center' }, // End Date
                        6: { cellWidth: 20, halign: 'right' }, // Revised Contract Value
                        7: { cellWidth: 20, halign: 'right' }, // Payment Amount
                        8: { cellWidth: 10, halign: 'center' }, // JV Share
                        9: { cellWidth: 10, halign: 'center' }, // N Year
                        10: { cellWidth: 20, halign: 'right' }, // Remaining Works
                        11: { cellWidth: 20, halign: 'right' }, // Works in Hand
                        12: { cellWidth: 23, halign: 'right' } // Works in Hand / N Year
                    }
                });

                currentY = (doc as any).lastAutoTable.finalY + 8;
                if (yearIndex < sortedYears.length - 1 && currentY > 180) {
                    doc.addPage();
                    currentY = 20;
                }
            });

            if (currentY > 170) {
                doc.addPage();
                currentY = 20;
            }

            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.setFillColor(52, 73, 94);
            doc.setTextColor(255, 255, 255);
            doc.rect(14, currentY, 267, 8, 'F');
            doc.text('GRAND TOTAL (All Years)', 16, currentY + 5.5);
            currentY += 10;

            autoTable(doc, {
                startY: currentY,
                body: [[
                    { content: 'Total Works in Hand / N Year', styles: { fontStyle: 'bold', fontSize: 9 } },
                    { content: grandTotalWorksInHandPerNYear.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), styles: { fontStyle: 'bold', fontSize: 9, halign: 'right', fillColor: [255, 235, 59], textColor: [0, 0, 0] } }
                ]],
                theme: 'grid',
                columnStyles: { 0: { cellWidth: 180 }, 1: { cellWidth: 87 } }
            });

            const fileName = `${companyName}_RecentOngoingWork_${tenderId}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    // Download Tender List as Excel (Styled)
    const handleDownloadTenderListExcel = () => {
        try {
            // Get years from saved turnover data
            const validYears = turnoverData.map(item => item.period);

            // Filter completedContracts to only include those with years in saved turnover data
            const filteredContracts = completedContracts.filter(contract =>
                validYears.includes(contract.financialYear)
            );

            // Sort by financial year (descending) and then by tender ID
            const sortedContracts = filteredContracts.sort((a, b) => {
                const yearCompare = b.financialYear.localeCompare(a.financialYear);
                if (yearCompare !== 0) return yearCompare;
                return (a.tenderId || '').localeCompare(b.tenderId || '');
            });

            // 1. Create a new workbook
            const wb = XLSX.utils.book_new();

            // 2. Define headers and metadata
            const headers = [
                'Financial Year',
                'S. No.',
                'Tender ID',
                'Package No',
                'Procuring Entity',
                'Description of Works',
                'JV Share (%)',
                'Payment Amount (BDT)',
                'Status'
            ];

            // 3. Prepare data rows
            const dataRows = sortedContracts.map((contract, index) => [
                contract.financialYear || 'N/A',
                index + 1,
                contract.tenderId || 'N/A',
                contract.packageNo || 'N/A',
                contract.procuringEntityName || 'N/A',
                contract.descriptionOfWorks || 'N/A',
                contract.jvShare || 'N/A',
                parseFloat(contract.actualPaymentJvShare || 0), // Number for Excel
                contract.Status_Complite_ongoing || 'N/A'
            ]);

            // 4. Construct the worksheet data array (Metadata + Headers + Data)
            const wsData = [
                [{ v: 'Tender List & Summary Report', s: { font: { bold: true, sz: 16, color: { rgb: "333333" } } } }],
                [], // Empty row
                [{ v: 'Company:', s: { font: { bold: true } } }, companyName || 'N/A'],
                [{ v: 'Email:', s: { font: { bold: true } } }, egpEmail || 'N/A'],
                [{ v: 'Tender ID:', s: { font: { bold: true } } }, String(tenderId || 'N/A')],
                [], // Empty row
                headers.map(h => ({ v: h, s: { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "4F81BD" } }, alignment: { horizontal: "center" } } })), // Styled Header Row
                ...dataRows.map((row, rowIndex) => row.map((cell, cellIndex) => ({
                    v: cell,
                    s: {
                        alignment: { wrapText: true, vertical: "top" },
                        border: {
                            top: { style: "thin", color: { rgb: "CCCCCC" } },
                            bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                            left: { style: "thin", color: { rgb: "CCCCCC" } },
                            right: { style: "thin", color: { rgb: "CCCCCC" } }
                        },
                        fill: rowIndex % 2 === 0 ? { fgColor: { rgb: "F9FAFB" } } : undefined // Alternating row color
                    }
                })))
            ];

            // 5. Create worksheet
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            // 6. Set column widths
            ws['!cols'] = [
                { wch: 15 }, // Financial Year
                { wch: 8 },  // S. No.
                { wch: 20 }, // Tender ID
                { wch: 20 }, // Package No
                { wch: 30 }, // Procuring Entity
                { wch: 50 }, // Description (Wide)
                { wch: 12 }, // JV Share
                { wch: 20 }, // Payment Amount
                { wch: 15 }  // Status
            ];

            // Merge title row
            if (!ws['!merges']) ws['!merges'] = [];
            ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } });

            // 7. Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, "Tender List");

            // 8. Write file
            XLSX.writeFile(wb, `${companyName}_TenderListSummary_${tenderId}.xlsx`);

        } catch (error) {
            console.error('Error generating Excel:', error);
            alert('Failed to generate Excel. Please try again.');
        }
    };

    // Download Turnover History
    const handlePrintTurnover = () => {
        try {
            const doc = new jsPDF();
            let currentY = addPDFHeader(doc, 'Turnover Analysis Report');

            // Use yearlyTotals (real-time data) instead of turnoverData (saved DB data)
            // yearlyTotals structure: { year: string, amount: number }
            const savedTurnoverData = yearlyTotals.map(item => ({
                year: item.year,
                amount: item.amount || 0
            }));

            // Determine limits from props (default to 5 if not provided)
            const nYears = Number(tdsRequiredFY) || 5;

            // --- Table 1: Turnover for the Last N Financial Years ---
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`Turnover for the Last ${nYears} Financial Years`, 14, currentY);
            currentY += 6;

            // Show saved years (limit based on nYears)
            const lastNYears = savedTurnoverData.slice(0, nYears);

            const tableData1 = lastNYears.map((item, index) => [
                index + 1,
                item.year,
                item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            ]);

            autoTable(doc, {
                startY: currentY,
                head: [['SL', 'Financial Year', 'Amount (BDT)']],
                body: tableData1,
                theme: 'grid',
                headStyles: { fillColor: [52, 73, 94], textColor: 255, fontStyle: 'bold', fontSize: 10, halign: 'center' },
                styles: { fontSize: 9, cellPadding: 3 },
                columnStyles: {
                    0: { cellWidth: 20, halign: 'center' },
                    1: { cellWidth: 80, halign: 'center' },
                    2: { cellWidth: 80, halign: 'right' }
                },
                margin: { left: 14 }
            });

            currentY = (doc as any).lastAutoTable.finalY + 15;

            // Determine best years limit from props (default to 5)
            const bestNYearsLimit = Number(tdsRequiredBestYear) || 5;

            // --- Table 2: Best N Years Based on Turnover ---
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`Best ${bestNYearsLimit} Years Based on Turnover`, 14, currentY);
            currentY += 6;

            // Sort by amount descending to find best years
            const bestYears = [...savedTurnoverData].sort((a, b) => b.amount - a.amount).slice(0, bestNYearsLimit);

            const tableData2 = bestYears.map((item, index) => [
                index + 1,
                item.year,
                item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            ]);

            // Calculate Sum of Best Years
            const sumBestYears = bestYears.reduce((sum, item) => sum + item.amount, 0);

            // Add sum row
            tableData2.push([
                { content: 'Sum of Best Years', colSpan: 2, styles: { fontStyle: 'bold', halign: 'right', fillColor: [220, 220, 220] } },
                { content: sumBestYears.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), styles: { fontStyle: 'bold', halign: 'right', fillColor: [220, 220, 220] } }
            ]);

            autoTable(doc, {
                startY: currentY,
                head: [['SL', 'Financial Year', 'Amount (BDT)']],
                body: tableData2,
                theme: 'grid',
                headStyles: { fillColor: [52, 73, 94], textColor: 255, fontStyle: 'bold', fontSize: 10, halign: 'center' },
                styles: { fontSize: 9, cellPadding: 3 },
                columnStyles: {
                    0: { cellWidth: 20, halign: 'center' },
                    1: { cellWidth: 80, halign: 'center' },
                    2: { cellWidth: 80, halign: 'right' }
                },
                margin: { left: 14 }
            });

            const fileName = `${companyName}_TurnoverHistory_${tenderId}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error('Error generating Turnover PDF:', error);
            alert(`Failed to generate PDF. Error: ${error?.message || 'Unknown error'}`);
        }
    };

    // Download Capacity Report
    const handlePrintCapacity = () => {
        try {
            const doc = new jsPDF();
            let currentY = addPDFHeader(doc, 'Tender Capacity Calculation');

            // Get saved values from currentTender or use defaults (MUST be declared first)
            const tdsRequiredFY = Number(currentTender?.tdsYearFinancialCapacity) || 5;
            const proposedYear = Number(currentTender?.proposeYear) || 1;
            const factor = 1.25;

            // Input parameters section
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text('Tender Capacity Calculation', 14, currentY);
            currentY += 8;

            // Parameters table
            const parametersData = [
                ['TDS Required (Last N Financial Years)', String(tdsRequiredFY)],
                ['Proposed Project Year (N)', String(proposedYear)]
            ];

            autoTable(doc, {
                startY: currentY,
                body: parametersData,
                theme: 'plain',
                styles: { fontSize: 9, cellPadding: 2 },
                columnStyles: {
                    0: { cellWidth: 130 },
                    1: { cellWidth: 50, halign: 'center' }
                }
            });

            currentY = (doc as any).lastAutoTable.finalY + 10;

            // Calculate valueA: Maximum value from last N years (matching TenderCapacityTab logic)
            let valueA = 0;
            if (currentTender?.Maximumvalue) {
                // Use saved maximum value if available
                valueA = Number(currentTender.Maximumvalue);
            } else if (yearlyTotals && yearlyTotals.length > 0 && tdsRequiredFY) {
                // Calculate from yearlyTotals: get last N years and find maximum
                const relevantYears = yearlyTotals
                    .sort((a, b) => b.year.localeCompare(a.year))
                    .slice(0, tdsRequiredFY);
                valueA = Math.max(0, ...relevantYears.map(y => y.amount));
            }

            const assessedCapacity = (valueA * proposedYear * factor) - (totalOngoingCommitments || 0);

            const calculationData = [
                [`(A) Maximum value of Works performed in any one year during last ${tdsRequiredFY} years`, valueA.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
                ['(N) Completion time of the proposed work in years', proposedYear.toFixed(2)],
                ['(B) Value of Existing commitments and works to be completed', (totalOngoingCommitments || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
                ['Factor', factor.toFixed(2)],
                [{ content: 'Assessed Tender Capacity = (A × N × 1.25 - B)', styles: { fontStyle: 'bold', fillColor: [220, 220, 220] } }, { content: assessedCapacity.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), styles: { fontStyle: 'bold', fillColor: [220, 220, 220] } }]
            ];

            autoTable(doc, {
                startY: currentY,
                head: [['Description', 'Value (BDT)']],
                body: calculationData,
                theme: 'grid',
                headStyles: { fillColor: [52, 73, 94], textColor: 255, fontStyle: 'bold', fontSize: 9, halign: 'center' },
                styles: { fontSize: 9, cellPadding: 3 },
                columnStyles: {
                    0: { cellWidth: 130 },
                    1: { cellWidth: 50, halign: 'right' }
                }
            });

            currentY = (doc as any).lastAutoTable.finalY + 10;

            // Final result box
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setFillColor(240, 248, 255);
            doc.rect(14, currentY, 182, 20, 'F');

            doc.setTextColor(0, 0, 0);
            doc.text('Final Assessed Tender Capacity', 105, currentY + 7, { align: 'center' });

            doc.setFontSize(14);
            doc.setTextColor(0, 128, 0);
            doc.text(`BDT ${assessedCapacity.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 105, currentY + 15, { align: 'center' });

            const fileName = `${companyName}_TenderCapacity_${tenderId}.pdf`;
            doc.save(fileName);
        } catch (error: any) {
            console.error('Error generating PDF:', error);
            alert(`Failed to generate PDF: ${error?.message || 'Unknown error'}`);
        }
    };

    // Get recent ongoing contracts (last 5)
    const recentOngoing = ongoingContracts.slice(0, 5);

    // Calculate Capacity for UI Display (Moved to top level)
    const tdsRequiredFY_UI = Number(currentTender?.tdsYearFinancialCapacity) || 5;
    const proposedYear_UI = Number(currentTender?.proposeYear) || 1;
    const factor_UI = 1.25;

    let valueA_UI = 0;
    if (currentTender?.Maximumvalue) {
        valueA_UI = Number(currentTender.Maximumvalue);
    } else if (yearlyTotals && yearlyTotals.length > 0) {
        const relevantYears = yearlyTotals
            .sort((a, b) => b.year.localeCompare(a.year))
            .slice(0, tdsRequiredFY_UI);
        valueA_UI = Math.max(0, ...relevantYears.map(y => y.amount));
    }

    const assessedCapacity_UI = (valueA_UI * proposedYear_UI * factor_UI) - (totalOngoingCommitments || 0);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Download Center</h2>
                <p className="text-gray-600">Download PDF reports for different sections of your tender data</p>
            </div>

            {/* Download Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Ongoing Contracts Card */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Briefcase className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle>Recent Ongoing Work</CardTitle>
                                <CardDescription>Latest {recentOngoing.length} ongoing projects</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="text-sm text-gray-600">
                                <p>• Total Ongoing: <span className="font-semibold">{ongoingContracts.length}</span></p>
                                <p>• Showing Recent: <span className="font-semibold">{recentOngoing.length}</span></p>
                            </div>
                            <Button
                                onClick={handlePrintOngoing}
                                className="w-full"
                                variant="default"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Ongoing Contracts PDF
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Tender List Summary Card */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <CardTitle>Tender List & Summary</CardTitle>
                                <CardDescription>Tenders from saved turnover years</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="text-sm text-gray-600">
                                <p>• Filtered Years: <span className="font-semibold">{turnoverData.length}</span></p>
                                <p>• Data Source: <span className="font-semibold">Saved Turnover Years</span></p>
                            </div>
                            <Button
                                onClick={handleDownloadTenderListExcel}
                                className="w-full"
                                variant="default"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Tender List Excel
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Turnover History Card */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <CardTitle>Turnover History</CardTitle>
                                <CardDescription>Saved turnover data analysis</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="text-sm text-gray-600">
                                <p>• Saved Years: <span className="font-semibold">{turnoverData.length}</span></p>
                                <p>• Data Source: <span className="font-semibold">Turnover History Tab</span></p>
                            </div>
                            <Button
                                onClick={handlePrintTurnover}
                                className="w-full"
                                variant="default"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Turnover History PDF
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Tender Capacity Card */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <CardTitle>Tender Capacity</CardTitle>
                                <CardDescription>Capacity analysis and commitments</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="text-sm text-gray-600">
                                <p>• Ongoing Commitments: <span className="font-semibold">৳ {(totalOngoingCommitments || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                                <p>• Assessed Capacity: <span className={`font-semibold ${assessedCapacity_UI >= 0 ? 'text-green-600' : 'text-red-600'}`}>৳ {assessedCapacity_UI.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                            </div>
                            <Button
                                onClick={handlePrintCapacity}
                                className="w-full"
                                variant="default"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Capacity Report PDF
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
