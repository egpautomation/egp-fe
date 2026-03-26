// @ts-nocheck
import { formatDate } from "@/lib/formateDate";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const handleAuthorizationLetterDownload = (companyData:any, currentTender:any) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 20;
  // --- Footer / Signature Image Section ---
  const imgUrl = "https://picsum.photos/id/237/200/300";
  const imgWidth = 40; // Adjust width as needed
  const imgHeight = 15; // Adjust height as needed
  
  // Calculate position: 30mm from the bottom of the page
  const imgYPos = pageHeight - 50 - imgHeight; 
  const imgXPos = pageWidth - margin - imgWidth; // Bottom Right alignment

  try {
    // Add the signature image
    doc.addImage(imgUrl, 'JPEG', imgXPos, imgYPos, imgWidth, imgHeight);
    
    // Optional: Add a label under or above the signature
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Authorized Signature", imgXPos + (imgWidth / 2), imgYPos + imgHeight + 5, { align: "center" });
  } catch (error) {
    console.error("Could not load signature image:", error);
  }
  // --- Header Section ---
  doc.setFont("Times-Roman", "bold");
  doc.setFontSize(32);
  doc.setTextColor(30, 58, 138); 
  doc.text(companyData?.companyName || "N/A", pageWidth / 2, yPos, { align: "center" });

  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(88, 28, 135); 
  doc.text(
    `Address: ${companyData?.companyAddress || "N/A"}, \n Proprietor Name: ${companyData?.proprietorName} \n  E-mail: ${companyData?.egpEmail || "N/A"}  `,
    pageWidth / 2,
    yPos,
    { align: "center" }
  );
  

  yPos += 14;
  doc.setDrawColor(88, 28, 135);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // --- Ref & Date ---
  yPos += 4;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont("Times-Roman", "normal");
  doc.text("Ref:", margin, yPos);
  doc.text(`Date: ${formatDate(new Date(), "dd-MM-yyyy")}`, pageWidth - margin, yPos, { align: "right" });

  // --- Title ---
  yPos += 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("LETTER OF AUTHORIZATION", pageWidth / 2, yPos, { align: "center" });
  doc.line(pageWidth / 2 - 35, yPos + 1, pageWidth / 2 + 35, yPos + 1);

  // --- Tender Details Table ---
  yPos += 10;
  const tenderInfo = [
    ["Invitation for Tender No:", currentTender?.tenderId || "N/A"],
    ["Tender Package No:", currentTender?.packageNo || "N/A"],
    ["Lot Description:", `${currentTender?.procurementNature || ""} ${currentTender?.descriptionOfWorks || ""}`],
  ];

  autoTable(doc, {
    startY: yPos,
    body: tenderInfo,
    theme: "plain",
    styles: { fontSize: 11, cellPadding: 2, font: "helvetica" },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: "bold" },
      1: { cellWidth: contentWidth - 50 },
    },
    margin: { left: margin },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // --- To Section ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const toText = `To: ${currentTender?.officialDesignation || "N/A"},\n${currentTender?.procuringEntityName || currentTender?.division || "N/A"},\n${currentTender?.locationDistrict || "N/A"}`;
  doc.text(toText, margin, yPos);

  yPos += 25;

  // --- Body Text (Alignment changed to "left" to avoid stretching) ---
  const body1 = `I, the undersigned, being the Sole Proprietor of the firm ${companyData?.companyName || "N/A"}, do hereby authorize Md Didarul Alam, Proprietor, residing at ${companyData?.companyAddress || "N/A"}, to sign and execute all documents related to the tender on behalf of the firm. His specimen signatures are provided below for verification.`;

  const body2 = `Furthermore, we understand that, according to your conditions, the Tenderer’s Financial Capacity i.e. Liquid Asset must be substantiated by a Letter of Commitment of Bank’s Undertaking for Line of Credit.`;

  const body3 = `In witness whereof, authorised representative of the Bank has hereunto signed and sealed this Letter of Commitment.`;

  // Set line height to roughly 1.5 for better readability
  const lineHeight = 6; 

  const splitBody1 = doc.splitTextToSize(body1, contentWidth);
  doc.text(splitBody1, margin, yPos, { align: "left" });
  yPos += splitBody1.length * lineHeight + 5; // Add extra 5mm spacing between paragraphs

  const splitBody2 = doc.splitTextToSize(body2, contentWidth);
  doc.text(splitBody2, margin, yPos, { align: "left" });
  yPos += splitBody2.length * lineHeight + 5;

  const splitBody3 = doc.splitTextToSize(body3, contentWidth);
  doc.text(splitBody3, margin, yPos, { align: "left" });

  // --- Final Download ---
  doc.save(`Authorization_Letter_${currentTender?.tenderId || "Tender"}.pdf`);
};