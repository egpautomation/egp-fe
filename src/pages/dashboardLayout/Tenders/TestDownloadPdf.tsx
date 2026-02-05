// @ts-nocheck

import { jsPDF } from 'jspdf';
import html2canvas from "html2canvas-pro";

const DownloadPDF = () => {
  const downloadPdf = async () => {
    const element = document.getElementById("table-to-download");
    const originalStyles = {
      overflow: element.style.overflow,
      display: element.style.display,
      height: element.style.height,
      width: element.style.width,
    };
  
    // Apply PDF-optimized styles
    element.style.overflow = "visible";
    element.style.display = "block";
    element.style.height = "auto";
    element.style.width = "100%"; // Ensures table fits page
    element.style.padding = "10px";
    element.style.margin = "0";
    element.style.fontSize = "10px"; // Smaller font to fit more rows
  
    try {
      // Capture the entire table (even if long)
      const canvas = await html2canvas(element, {
        scale: 1, // Lower scale to fit more content
        scrollY: -window.scrollY,
        useCORS: true,
        windowWidth: element.scrollWidth,
        width: element.scrollWidth,
        height: element.scrollHeight,
        logging: true, // Helps debug missing content
      });
  
      const pdf = new jsPDF("p", "mm", "legal"); // Portrait mode
      const imgWidth = 190; // Slightly less than page width (215mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      // Split into multiple pages if too tall
      const scaleFactor = imgWidth / imgProps.canvasWidth;
    const scaledCanvasHeight = imgProps.canvasHeight * scaleFactor;

    const pageHeightPx = (pageHeight - topMargin) / scaleFactor; // Convert mm to canvas px

    let position = 0;

    while (position < imgProps.canvasHeight) {
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = imgProps.canvasWidth;
      pageCanvas.height = Math.min(pageHeightPx, imgProps.canvasHeight - position);

      const pageCtx = pageCanvas.getContext("2d");
      pageCtx.drawImage(
        canvas,
        0,
        position,
        imgProps.canvasWidth,
        pageCanvas.height,
        0,
        0,
        imgProps.canvasWidth,
        pageCanvas.height
      );

      const imgData = pageCanvas.toDataURL("image/png");

      if (position > 0) pdf.addPage();
      pdf.addImage(
        imgData,
        "PNG",
        0,
        topMargin,
        imgWidth,
        (pageCanvas.height * imgWidth) / imgProps.canvasWidth
      );

      position += pageHeightPx;
      }
  
      pdf.save("ltm-tenders.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      // Restore original styles
      Object.assign(element.style, originalStyles);
    }
  };

  return (
    <div>
    {/* এই div বা টেবিলটি PDF-এ কনভার্ট হবে */}
    <div id="table-to-download" style={{ padding: "20px", background: "#f9f9f9" }}>
      <h2>আপনার টেবিল বা কন্টেন্ট</h2>
      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ক্রমিক</th>
            <th>নাম</th>
            <th>বয়স</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>রাহুল</td>
            <td>25</td>
          </tr>
          <tr>
            <td>2</td>
            <td>প্রিয়া</td>
            <td>30</td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* PDF ডাউনলোড বাটন */}
    <button
      onClick={downloadPdf}
      style={{ marginTop: "20px", padding: "10px 20px", background: "#4CAF50", color: "white" }}
    >
      PDF ডাউনলোড করুন
    </button>
  </div>
  );
};

export default DownloadPDF;
