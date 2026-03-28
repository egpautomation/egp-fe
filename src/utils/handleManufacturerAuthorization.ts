// @ts-nocheck
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "@/lib/formateDate";

export const handleDownloadManufacturerAuthorization = (companyData: any, currentTender: any) => {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let yPos = 20;

  // --- Header Section ---
  doc.setFont("Times-Roman", "bold");
  doc.setFontSize(28);
  doc.setTextColor(30, 58, 138);

  doc.text(companyData?.companyName || "N/A", pageWidth / 2, yPos, {
    align: "center",
  });

  yPos += 8;

  doc.setFontSize(10);
  doc.setTextColor(88, 28, 135);

  doc.text(
    `Proprietor Name: ${companyData?.proprietorName || "N/A"},\nAddress: ${companyData?.companyAddress || "N/A"},\nE-mail: ${companyData?.egpEmail || "N/A"}`,
    pageWidth / 2,
    yPos,
    { align: "center" }
  );

  yPos += 14;

  doc.setDrawColor(88, 28, 135);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // --- Ref & Date ---
  yPos += 6;

  doc.setFont("Times-Roman", "normal");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  doc.text("Ref:", margin, yPos);
  doc.text(`Date: ${formatDate(new Date(), "dd-MM-yyyy")}`, pageWidth - margin, yPos, {
    align: "right",
  });

  // --- Title ---
  yPos += 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  doc.text("Manufacturer’s Authorisation Letter (Form e-PG2-5)", pageWidth / 2, yPos, {
    align: "center",
  });

  doc.line(pageWidth / 2 - 60, yPos + 1, pageWidth / 2 + 60, yPos + 1);

  // --- Tender Info (Table Style) ---
  yPos += 10;

  const tenderInfo = [
    ["Invitation for Tender No:", currentTender?.tenderId || "N/A", "Date:", ""],
    ["Tender Package No:", currentTender?.packageNo || "N/A", "", ""],
    ["Tender Lot No:", "", "", ""],
  ];

  autoTable(doc, {
    startY: yPos,
    body: tenderInfo,
    theme: "plain",
    styles: {
      fontSize: 11,
      cellPadding: 2,
      font: "helvetica",
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: "bold" },
      1: { cellWidth: 50 },
      2: { cellWidth: 20, fontStyle: "bold" },
      3: { cellWidth: contentWidth - 130 },
    },
    margin: { left: margin - 2 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // --- To Section ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const toText = `To: ${currentTender?.officialDesignation || "N/A"},
${currentTender?.procuringEntityName || currentTender?.division || "N/A"},
${currentTender?.locationDistrict || "N/A"}`;

  doc.text(toText, margin, yPos);

  yPos += 20;

  // --- Body Section ---
  const lineHeight = 6;

  const body1 = `WHEREAS`;
  doc.text(body1, margin, yPos);
  yPos += lineHeight;

  const body2 = `\nWe ${companyData?.companyName || "[insert complete name of Manufacturer]"}`;
  const split2 = doc.splitTextToSize(body2, contentWidth);
  doc.text(split2, margin, yPos);
  yPos += split2.length * lineHeight + 5;

  const body3 = `who are official manufacturers of [insert type of goods manufactured], having factories at ${companyData?.companyAddress || "[insert full address of Manufacturer’s factories]"}, do hereby`;
  const split3 = doc.splitTextToSize(body3, contentWidth);
  doc.text(split3, margin, yPos);
  yPos += split3.length * lineHeight + 5;

  const body4 = `authorize [insert complete name of Tenderer] to supply the following Goods, manufactured by us [insert name and or brief description of the Goods].`;
  const split4 = doc.splitTextToSize(body4, contentWidth);
  doc.text(split4, margin, yPos);
  yPos += split4.length * lineHeight + 8;

  const body5 = `We hereby extend our full guarantee and warranty as stated under GCC Clause 32 of the General Conditions of Contract, with respect to the Goods offered by the above Tenderer.`;
  const split5 = doc.splitTextToSize(body5, contentWidth);
  doc.text(split5, margin, yPos);
  yPos += split5.length * lineHeight + 10;

  // --- Signature Section ---
  const signatureY = pageHeight - 90;

  doc.text("Signed: [insert signature(s) of authorized representative(s) of the Manufacturer] ", margin, signatureY);

  doc.text("Name: [insert complete name(s) of authorized representative(s) of the Manufacturer]", margin, signatureY + 8);

  doc.text("Address: [insert full address including Fax and e-mail]", margin, signatureY + 16);

  doc.text("Title: [insert title] ", margin, signatureY + 24);

  doc.text(`Date: ${formatDate(new Date(), "dd-MM-yyyy")}`, margin, signatureY + 32);

  // --- Download ---
  doc.save(`Manufacturer_Authorization_${currentTender?.tenderId || "Tender"}.pdf`);
};
