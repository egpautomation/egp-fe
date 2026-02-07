// @ts-nocheck
import { config } from "@/lib/config";
import { Detail } from "@/components/mainlayout/Tenders/Detail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSingleData from "@/hooks/useSingleData";
import { formatDate } from "@/lib/formateDate";
import { ArrowLeft, Plus, Copy, Calendar, MapPin, Building2, FileText, DollarSign, CheckCircle2, Info, Download, Share2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import UpdateTenderDialog from "@/components/dashboard/UpdateTenderDialog";

const ViewTender = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const url = `${config.apiBaseUrl}/tenders/${id}`;
  const { data: formData, loading, setReload } = useSingleData(url);

  const openingDateTime = formatDate(formData?.openingDateTime, "eee MMM dd yyyy");
  const lastSelling = formatDate(formData?.documentLastSelling, "eee MMM dd yyyy");
  const publicationTime = formatDate(formData?.publicationDateTime, "eee MMM dd yyyy");

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    // Replace localhost with production domain
    const currentUrl = window.location.href.replace(
      /http:\/\/localhost:\d+/,
      config.egpSiteUrl
    );
    navigator.clipboard.writeText(currentUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Tender Details", 105, 15, { align: "center" });

    // Tender ID and Status
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Tender ID: ${formData?.tenderId || "N/A"}`, 15, 30);

    if (formData?.tenderStatus) {
      doc.setFontSize(12);
      doc.setTextColor(0, 128, 0);
      doc.text(`Status: ${formData?.tenderStatus}`, 15, 38);
      doc.setTextColor(0, 0, 0);
    }

    let yPos = 48;

    // Organization
    if (formData?.organization) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Organization:", 15, yPos);
      doc.setFont("helvetica", "normal");
      const orgLines = doc.splitTextToSize(formData?.organization, 180);
      doc.text(orgLines, 15, yPos + 5);
      yPos += 5 + (orgLines.length * 5) + 3;
    }

    // Description of Works
    if (formData?.descriptionOfWorks) {
      doc.setFont("helvetica", "bold");
      doc.text("Description of Works:", 15, yPos);
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(formData?.descriptionOfWorks, 180);
      doc.text(descLines, 15, yPos + 5);
      yPos += 5 + (descLines.length * 5) + 8;
    }

    // Key Information Table
    const keyInfoData = [
      ["Estimated Cost", formatCurrency(formData?.estimatedCost)],
      ["Last Selling Date", lastSelling],
      ["Closing Date", openingDateTime],
      ["Publication Date", publicationTime],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [["Key Information", ""]],
      body: keyInfoData,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246],
        fontSize: 12,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: "bold" },
        1: { cellWidth: 120 },
      },
      margin: { left: 15, right: 15 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 8;

    // Basic Information
    const basicInfoData = [
      ["Procurement Type", formData?.procurementType || "N/A"],
      ["Procurement Nature", formData?.procurementNature || "N/A"],
      ["Procurement Method", formData?.procurementMethod || "N/A"],
      ["Package No", formData?.packageNo || "N/A"],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [["Basic Information", ""]],
      body: basicInfoData,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246],
        fontSize: 12,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: "bold" },
        1: { cellWidth: 120 },
      },
      margin: { left: 15, right: 15 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 8;

    // Organization & Entity
    const orgEntityData = [
      ["Ministry", formData?.ministry || "N/A"],
      ["Organization", formData?.organization || "N/A"],
      ["Division", formData?.division || "N/A"],
      ["Entity Name", formData?.procuringEntityName || "N/A"],
      ["Official Designation", formData?.officialDesignation || "N/A"],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [["Organization & Entity", ""]],
      body: orgEntityData,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246],
        fontSize: 12,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: "bold" },
        1: { cellWidth: 120 },
      },
      margin: { left: 15, right: 15 },
    });

    // Check if new page needed
    if ((doc as any).lastAutoTable.finalY > 240) {
      doc.addPage();
      yPos = 15;
    } else {
      yPos = (doc as any).lastAutoTable.finalY + 8;
    }

    // Location Information
    const locationData = [
      ["Location District", formData?.locationDistrict || "N/A"],
      ["Working Location", formData?.workingLocation || "N/A"],
      ["Department", formData?.department || "N/A"],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [["Location Information", ""]],
      body: locationData,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246],
        fontSize: 12,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: "bold" },
        1: { cellWidth: 120 },
      },
      margin: { left: 15, right: 15 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 8;

    // Financial Information
    const financialData = [
      ["Estimated Cost", formatCurrency(formData?.estimatedCost)],
      ["Document Price", formatCurrency(formData?.documentPrice)],
      ["Tender Security", formatCurrency(formData?.tenderSecurity)],
      ["Turnover Amount", formatCurrency(formData?.turnoverAmount)],
      ["Liquid Assets", formatCurrency(formData?.liquidAssets)],
      ["Tender Capacity", formatCurrency(formData?.tenderCapacity)],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [["Financial Information", ""]],
      body: financialData,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246],
        fontSize: 12,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: "bold" },
        1: { cellWidth: 120 },
      },
      margin: { left: 15, right: 15 },
    });

    // Check if new page needed
    if ((doc as any).lastAutoTable.finalY > 240) {
      doc.addPage();
      yPos = 15;
    } else {
      yPos = (doc as any).lastAutoTable.finalY + 8;
    }

    // Eligibility & Quality Criteria
    const eligibilityData = [
      ["General Experience", formData?.generalExperience || "N/A"],
      ["Financial Criteria", formData?.financialCriteria || "N/A"],
      ["Eligibility of Tender Document", formData?.eligibilityOfTenderDocument || "N/A"],
      ["Types of Similar Nature", formData?.typesOfSimilarNature || "N/A"],
      ["JVCA", formData?.jvca || "N/A"],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [["Eligibility & Quality Criteria", ""]],
      body: eligibilityData,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246],
        fontSize: 12,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: "bold" },
        1: { cellWidth: 120 },
      },
      margin: { left: 15, right: 15 },
    });

    // Project Information (if exists)
    if (formData?.projectName) {
      yPos = (doc as any).lastAutoTable.finalY + 8;

      if (yPos > 240) {
        doc.addPage();
        yPos = 15;
      }

      const projectData = [
        ["Project Name", formData?.projectName || "N/A"],
        ["Source of Funds", formData?.sourceOfFunds || "N/A"],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [["Project Information", ""]],
        body: projectData,
        theme: "grid",
        headStyles: {
          fillColor: [59, 130, 246],
          fontSize: 12,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 70, fontStyle: "bold" },
          1: { cellWidth: 120 },
        },
        margin: { left: 15, right: 15 },
      });
    }

    // Similar Nature Work (if exists)
    if (formData?.similarNatureWork) {
      yPos = (doc as any).lastAutoTable.finalY + 8;

      if (yPos > 240) {
        doc.addPage();
        yPos = 15;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Similar Nature Work:", 15, yPos);
      doc.setFont("helvetica", "normal");
      const similarLines = doc.splitTextToSize(formData?.similarNatureWork, 180);
      doc.text(similarLines, 15, yPos + 5);
    }

    // Footer on all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;
      const centerX = doc.internal.pageSize.width / 2;

      const line1Y = pageHeight - 18;
      const line2Y = line1Y + 4;
      const line3Y = line2Y + 4;

      doc.setFontSize(8);
      doc.setTextColor(37, 37, 37);

      doc.text(
        `© ${new Date().getFullYear()} E-GP Tender Automation — All Rights Reserved.`,
        centerX,
        line1Y,
        { align: "center" }
      );

      // Website and contact info
      const prefix = "Visit us: ";
      const website = "egp.jubairahmad.com";
      const mid = " | WhatsApp: ";
      const whatsapp = "01926-959331";

      const fullText = prefix + website + mid + whatsapp;
      const fullWidth = doc.getTextWidth(fullText);
      const startX = centerX - fullWidth / 2;

      doc.text(prefix, startX, line2Y);

      const prefixWidth = doc.getTextWidth(prefix);
      doc.textWithLink(website, startX + prefixWidth, line2Y, {
        url: config.egpSiteUrl,
      });

      const websiteWidth = doc.getTextWidth(website);
      doc.text(mid, startX + prefixWidth + websiteWidth, line2Y);

      const midWidth = doc.getTextWidth(mid);
      doc.textWithLink(
        whatsapp,
        startX + prefixWidth + websiteWidth + midWidth,
        line2Y,
        {
          url: `https://wa.me/${config.supportWhatsApp}`,
        }
      );

      doc.text(`Page ${i} of ${pageCount}`, centerX, line3Y, { align: "center" });
    }

    doc.save(`tender-${formData?.tenderId || "details"}.pdf`);
  };

  const formatCurrency = (value) => {
    if (!value || value === "N/A") return "N/A";
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0
    }).format(value);
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("open") || statusLower.includes("active")) return "bg-green-500";
    if (statusLower.includes("closed")) return "bg-red-500";
    if (statusLower.includes("pending")) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const InfoCard = ({ icon: Icon, title, children }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
      </CardContent>
    </Card>
  );

  const DataField = ({ label, value, copyable = false }) => (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-0 group">
      <span className="text-sm font-medium text-gray-600 min-w-[140px]">{label}:</span>
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm text-gray-900 text-right flex-1 break-words">{value || "N/A"}</span>
        {copyable && value && (
          <Copy
            className="h-4 w-4 text-gray-400 hover:text-primary cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => copyToClipboard(value)}
          />
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading tender details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Button onClick={() => navigate(-1)} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={shareLink}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            <Button
              onClick={downloadPDF}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Print / Download PDF
            </Button>

            <Link to="/dashboard/create-job-order">
              <Button className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Order A Job
              </Button>
            </Link>

            <Button onClick={() => setUpdateDialogOpen(true)} variant="outline">
              Update Tender Info
            </Button>
          </div>

          {linkCopied && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm text-green-600 font-medium"
            >
              Link copied to clipboard!
            </motion.span>
          )}
          {copied && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm text-green-600 font-medium"
            >
              Copied!
            </motion.span>
          )}
        </div>

        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">Tender #{formData?.tenderId}</h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => copyToClipboard(formData?.tenderId)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-lg opacity-90">{formData?.organization || "No Organization"}</p>
                <p className="text-sm opacity-75">{formData?.descriptionOfWorks || "No description available"}</p>
              </div>
              {formData?.tenderStatus && (
                <Badge className={`${getStatusColor(formData?.tenderStatus)} text-white px-4 py-2 text-base`}>
                  {formData?.tenderStatus}
                </Badge>
              )}
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm opacity-75">Estimated Cost</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(formData?.estimatedCost)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm opacity-75">Last Selling Date</p>
                <p className="text-xl font-semibold mt-1">{lastSelling}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm opacity-75">Closing Date</p>
                <p className="text-xl font-semibold mt-1">{openingDateTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <InfoCard icon={Info} title="Basic Information">
            <DataField label="Tender ID" value={formData?.tenderId} copyable />
            <DataField label="Procurement Type" value={formData?.procurementType} />
            <DataField label="Procurement Nature" value={formData?.procurementNature} />
            <DataField label="Procurement Method" value={formData?.procurementMethod} />
            <DataField label="Package No" value={formData?.packageNo} />
          </InfoCard>

          {/* Organization & Entity */}
          <InfoCard icon={Building2} title="Organization & Entity">
            <DataField label="Ministry" value={formData?.ministry} />
            <DataField label="Organization" value={formData?.organization} />
            <DataField label="Division" value={formData?.division} />
            <DataField label="Department" value={formData?.department} />
            <DataField label="Entity Name" value={formData?.procuringEntityName} />
            <DataField label="Official Designation" value={formData?.officialDesignation} />
          </InfoCard>

          {/* Location Information */}
          <InfoCard icon={MapPin} title="Location Information">
            <DataField label="Location District" value={formData?.locationDistrict} />
            <DataField label="Working Location" value={formData?.workingLocation} />
          </InfoCard>

          {/* Timeline & Dates */}
          <InfoCard icon={Calendar} title="Timeline & Dates">
            <DataField label="Publication Date" value={publicationTime} />
            <DataField label="Last Selling Date" value={lastSelling} />
            <DataField label="Opening Date" value={openingDateTime} />
          </InfoCard>

          {/* Financial Information */}
          <InfoCard icon={DollarSign} title="Financial Information">
            <DataField label="Estimated Cost" value={formatCurrency(formData?.estimatedCost)} />
            <DataField label="Document Price" value={formatCurrency(formData?.documentPrice)} />
            <DataField label="Tender Security" value={formatCurrency(formData?.tenderSecurity)} />
            <DataField label="Turnover Amount" value={formatCurrency(formData?.turnoverAmount)} />
            <DataField label="Liquid Assets" value={formatCurrency(formData?.liquidAssets)} />
            <DataField label="Tender Capacity" value={formatCurrency(formData?.tenderCapacity)} />
            <DataField label="Minimum Year of Similar Work" value={formData?.yearofsimilarexperience} />
            {formData?.typesOfSimilarNature && formData.typesOfSimilarNature.includes(" : ") ? (
              <>
                <DataField label="Types of Similar Nature" value={formData.typesOfSimilarNature.split(" : ")[0]} />
                <DataField label="Type of Similar Nature Value" value={formData.typesOfSimilarNature.split(" : ")[1]} />
              </>
            ) : (
              <DataField label="Types of Similar Nature" value={formData?.typesOfSimilarNature} />
            )}
            <DataField label="JVCA" value={formData?.jvca} />
            <DataField label="General Experience" value={formData?.generalExperience} />
          </InfoCard>

          {/* Tender Details - Now beside Financial Information */}
          <InfoCard icon={FileText} title="Tender Details">
            <DataField label="Tender Category" value={formData?.tender_subCategories} />
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-600 mb-2">Description of Works:</p>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{formData?.descriptionOfWorks || "N/A"}</p>
            </div>
            {formData?.similarNatureWork && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-600 mb-2">Similar Nature Work:</p>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{formData?.similarNatureWork}</p>
              </div>
            )}
          </InfoCard>
        </div>

        {/* Project Information */}
        {formData?.projectName && (
          <InfoCard icon={FileText} title="Project Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataField label="Project Name" value={formData?.projectName} />
              <DataField label="Source of Funds" value={formData?.sourceOfFunds} />
            </div>
          </InfoCard>
        )}

        {/* Eligibility & Criteria - At the end */}
        <InfoCard icon={CheckCircle2} title="Eligibility & Quality Criteria">
          <DataField label="Financial Criteria" value={formData?.financialCriteria} />

          <div className="pt-4 border-t border-gray-100 col-span-2">
            <p className="text-sm font-medium text-gray-600 mb-3">Eligibility of Tender:</p>
            <div className="space-y-2 pl-2">
              {[
                formData?.eligibilityOfTenderDocument,
                formData?.tds_01,
                formData?.tds_03,
                formData?.tds_05,
                formData?.tds_06,
                formData?.tds_07,
                formData?.tds_08,
                formData?.tds_09,
                formData?.tds_10,
                formData?.tds_12,
                formData?.tds_14,
                formData?.tds_15,
                formData?.tds_18,
                formData?.tds_21,
                formData?.scope_title,
                formData?.scope_intro,
                formData?.scope_details,
                formData?.doc_list_title,
                formData?.doc_list_intro,
                formData?.doc_list_details
              ].filter(Boolean).map((item, index) => (
                <div key={index} className="flex gap-2 text-sm text-gray-900">
                  <span className="font-medium min-w-[20px]">{index + 1}.</span>
                  <span className="whitespace-pre-wrap">{item}</span>
                </div>
              ))}
              {[
                formData?.eligibilityOfTenderDocument,
                formData?.tds_01,
                formData?.tds_03,
                formData?.tds_05,
                formData?.tds_06,
                formData?.tds_07,
                formData?.tds_08,
                formData?.tds_09,
                formData?.tds_10,
                formData?.tds_12,
                formData?.tds_14,
                formData?.tds_15,
                formData?.tds_18,
                formData?.tds_21,
                formData?.scope_title,
                formData?.scope_intro,
                formData?.scope_details,
                formData?.doc_list_title,
                formData?.doc_list_intro,
                formData?.doc_list_details
              ].every(item => !item) && (
                  <p className="text-sm text-gray-500 italic ml-7">No eligibility details available.</p>
                )}
            </div>
          </div>
        </InfoCard>
        <UpdateTenderDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          tenderId={id}
          initialData={{
            turnoverAmount: formData?.turnoverAmount,
            liquidAssets: formData?.liquidAssets,
            tenderCapacity: formData?.tenderCapacity,
            yearofsimilarexperience: formData?.yearofsimilarexperience,
            typesOfSimilarNature: formData?.typesOfSimilarNature,
            jvca: formData?.jvca,
            tenderCategories: formData?.tenderCategories || [],
          }}
          onSuccess={() => setReload((prev) => prev + 1)}
        />
      </motion.div>
    </div>
  );
};

export default ViewTender;
