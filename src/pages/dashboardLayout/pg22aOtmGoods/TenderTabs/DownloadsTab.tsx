// @ts-nocheck
import React from 'react';
import { Download, FileText, TrendingUp, BarChart3, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    currentTender
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
            doc.text(tenderId, leftMargin + 25, currentY);
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

            const fileName = `${companyName}${tenderId}OngoingContracts.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    // Download Tender List - Grouped by Financial Year
    const handlePrintTenderList = () => {
        try {
            const doc = new jsPDF('landscape');
            let currentY = addPDFHeader(doc, 'Tender Summary List');

            // Get years from saved turnover data instead of yearlyTotals
            const validYears = turnoverData.map(item => item.period);

            // Filter completedContracts to only include those with years in saved turnover data
            const filteredContracts = completedContracts.filter(contract =>
                validYears.includes(contract.financialYear)
            );

            // Group filtered contracts by Financial Year
            const groupedByYear = filteredContracts.reduce((acc, contract) => {
                const year = contract.financialYear || 'Unknown';
                if (!acc[year]) acc[year] = [];
                acc[year].push(contract);
                return acc;
            }, {});

            const sortedYears = Object.keys(groupedByYear).sort((a, b) => b.localeCompare(a));

            sortedYears.forEach((year, yearIndex) => {
                const contracts = groupedByYear[year];

                // Add Financial Year separator
                doc.setFontSize(11);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text(`Financial Year: ${year}`, 14, currentY + 4);
                currentY += 8;

                const yearTableData = contracts.map((contract, index) => [
                    index + 1,
                    contract.tenderId || 'N/A',
                    contract.packageNo || 'N/A',
                    contract.procuringEntityName || 'N/A',
                    contract.descriptionOfWorks || 'N/A',
                    contract.jvShare || 'N/A',
                    parseFloat(contract.actualPaymentJvShare || 0).toLocaleString('en-IN'),
                    contract.Status_Complite_ongoing || 'N/A'
                ]);

                // Calculate year total
                const yearTotal = contracts.reduce((sum, contract) =>
                    sum + (parseFloat(contract.actualPaymentJvShare) || 0), 0
                );

                // Add year total row
                yearTableData.push([
                    { content: `Total for ${year}`, colSpan: 6, styles: { fontStyle: 'bold', halign: 'right', fillColor: [220, 220, 220] } },
                    { content: yearTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), styles: { fontStyle: 'bold', halign: 'right', fillColor: [220, 220, 220] } },
                    { content: '', styles: { fillColor: [220, 220, 220] } }
                ]);

                autoTable(doc, {
                    startY: currentY,
                    head: [['S. No.', 'Tender ID', 'Package No', 'Procuring Entity', 'Description of Works', 'JV Share (%)', 'Payment Amount', 'Status']],
                    body: yearTableData,
                    theme: 'grid',
                    headStyles: { fillColor: [52, 73, 94], textColor: 255, fontStyle: 'bold', fontSize: 6, halign: 'center' },
                    styles: { fontSize: 5.5, cellPadding: 1, overflow: 'linebreak' },
                    columnStyles: {
                        0: { cellWidth: 12, halign: 'center' },
                        1: { cellWidth: 22 },
                        2: { cellWidth: 22 },
                        3: { cellWidth: 45 },
                        4: { cellWidth: 80 },
                        5: { cellWidth: 18, halign: 'center' },
                        6: { cellWidth: 30, halign: 'right' },
                        7: { cellWidth: 26, halign: 'center' }
                    }
                });

                currentY = (doc as any).lastAutoTable.finalY + 8;
                if (yearIndex < sortedYears.length - 1 && currentY > 180) {
                    doc.addPage();
                    currentY = 20;
                }
            });

            const fileName = `${companyName}${tenderId}TenderListSummary.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    // Download Turnover History
    const handlePrintTurnover = () => {
        try {
            const doc = new jsPDF();
            let currentY = addPDFHeader(doc, 'Turnover Analysis Report');

            // Use saved turnover data instead of yearlyTotals
            // Convert turnoverData to the format needed for PDF generation
            const savedTurnoverData = turnoverData.map(item => ({
                year: item.period,
                amount: parseFloat(item.amountBDT.replace(/[^0-9.-]+/g, '')) || 0
            }));

            // --- Table 1: Turnover for the Last 4 Financial Years ---
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('Turnover for the Last 4 Financial Years', 14, currentY);
            currentY += 6;

            // Show saved years (limit to 4 for the first table)
            const last4Years = savedTurnoverData.slice(0, 4);

            const tableData1 = last4Years.map((item, index) => [
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

            // --- Table 2: Best 3 Years Based on Turnover ---
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('Best 3 Years Based on Turnover', 14, currentY);
            currentY += 6;

            // Sort by amount descending to find best years
            const bestYears = [...savedTurnoverData].sort((a, b) => b.amount - a.amount).slice(0, 3);

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

            const fileName = `${companyName}${tenderId}TurnoverHistory.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
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

            const fileName = `${companyName}${tenderId}TenderCapacity.pdf`;
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
                                <CardTitle>Recent Ongoing Contracts</CardTitle>
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
                                onClick={handlePrintTenderList}
                                className="w-full"
                                variant="default"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Tender List PDF
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
