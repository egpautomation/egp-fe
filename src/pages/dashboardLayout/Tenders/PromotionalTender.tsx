// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Building2,
  Tag,
  ExternalLink,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  Download,
  Eye,
  Share2,
  ChevronDown,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/formateDate";
import Pagination from "@/shared/Pagination/Pagination";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import useAllTenders from "@/hooks/useAllTenders";

const FilterSection = ({ title, children, searchPlaceholder, searchValue, onSearchChange, count }) => (
  <AccordionItem value={title} className="border-0">
    <div className="mb-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <AccordionTrigger className="flex items-center justify-between bg-teal-600 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-teal-700 hover:no-underline [&[data-state=open]>svg]:rotate-180 [&>svg]:text-white">
        <span className="flex items-center gap-2">{title}</span>
        <span className="ml-auto mr-2 flex items-center gap-1 rounded bg-white/20 px-2 py-0.5 text-xs">
          Browse
          <ChevronDown className="h-3 w-3 transition-transform duration-200" />
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-3 pt-2">
        {searchPlaceholder && (
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue || ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="h-9 rounded-md border-slate-200 pl-9 text-sm"
            />
          </div>
        )}
        <div className="max-h-64 overflow-y-auto pr-1">{children}</div>
        {count !== undefined && (
          <div className="mt-2 border-t border-slate-100 pt-2 text-xs text-slate-500">{count} items found</div>
        )}
      </AccordionContent>
    </div>
  </AccordionItem>
);

const FilterCheckbox = ({ label, count, checked, onCheckedChange }) => (
  <div className="flex items-start gap-2 py-1.5">
    <Checkbox
      id={label}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="mt-0.5 h-4 w-4 rounded border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:text-white"
    />
    <label htmlFor={label} className="flex flex-1 cursor-pointer items-start justify-between text-sm leading-5">
      <span className="text-slate-700">{label}</span>
      {count !== undefined && <span className="ml-2 text-xs text-slate-400">{count}</span>}
    </label>
  </div>
);

const PromotionalTender = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const localToday = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(localToday);

  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [deptSearch, setDeptSearch] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [filterCounts, setFilterCounts] = useState({
    departments: [],
    locations: [],
  });

  const { fetchAllTenders, tenders, loading, setLoading, tendersCount } = useAllTenders(
    "", // searchTerm
    selectedDate, // from
    selectedDate, // to
    "", // method
    selectedDepartments.join("||"), // department
    "", // category
    selectedLocations.join("||"), // location
    "", // procurementNature
    currentPage,
    pageLimit,
    "publicationDateTime"
  );

  const promotionalTexts = [
    `New Tender Notice - eGP + Full Data Sheet
- Work Location
- Publication Date | Last Selling | Opening Date
- Estimated Value
- Tender Security
- Turnover Amount
- Liquid Assets
- Tender Capacity
Get extra details - not available in newspapers or other websites!`,
    `E-GP Tender Automation - Simplify SLT Calculation
- Easily calculate SLT (Similar Nature Task)
- Upload TOR2 PDF and calculate instantly
- No registration or passcode required
Check now: www.etenderbd.com`,
    `E-GP Tender Automation - Simplify your tender process!
- Easily calculate SLT
- Upload TOR2 PDF and calculate instantly
- No registration or passcode required
Check now: www.etenderbd.com`
  ];

  const downloadPdf = async () => {
    try {
      setIsPdfLoading(true);
      const doc = new jsPDF("l", "mm", "a4"); // Landscape for better table fit

      const tableColumn = [
        "Tender ID",
        "Organization",
        "Description",
        "Document Price",
        "Security",
        "Estimated Cost",
        "Closing Date"
      ];

      const tableRows: any[] = [];
      // Use currently visible page data
      const allTenders = tenders || [];

      allTenders.forEach((item: any) => {
        const rowData = [
          item?.tenderId || "N/A",
          item?.organization || item?.department || "N/A",
          item?.descriptionOfWorks || "N/A",
          item?.documentPrice ? `BDT ${item.documentPrice}` : "N/A",
          item?.tenderSecurity ? `BDT ${item.tenderSecurity}` : "N/A",
          item?.estimatedCost ? `BDT ${item.estimatedCost}` : "N/A",
          formatDate(item?.openingDateTime, "dd-MM-yyyy")
        ];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30, // Lowered start to properly clear header
        margin: { top: 25, bottom: 45, left: 14, right: 14 },
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 4,
          textColor: [0, 0, 0], // Dark black text
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontSize: 10,
          fontStyle: "bold",
          halign: "left",
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255],
        },
        columnStyles: {
          0: { cellWidth: 25, halign: "center", fontStyle: "bold" },
          1: { cellWidth: 45 },
          2: { cellWidth: 'auto' }, // Let desc take remaining space
          3: { cellWidth: 28, halign: "right" },
          4: { cellWidth: 28, halign: "right" },
          5: { cellWidth: 32, halign: "right", fontStyle: "bold" },
          6: { cellWidth: 28, halign: "center" },
        },
        didDrawPage: (data) => {
          const pageNumber = doc.internal.getNumberOfPages();

          doc.setFontSize(18);
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "bold");
          doc.text("Promotional Tenders Report", data.settings.margin.left, 18);

          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
          doc.text(`Generated on: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.getWidth() - data.settings.margin.right, 18, { align: 'right' });

          const pageHeight = doc.internal.pageSize.getHeight();
          const centerX = doc.internal.pageSize.getWidth() / 2;

          const line1Y = pageHeight - 18;
          const line2Y = line1Y + 4;
          const line3Y = line2Y + 4;

          doc.setFontSize(8);
          doc.setTextColor(0, 0, 0);

          doc.text(
            `© ${new Date().getFullYear()} E-GP Tender Automation — All Rights Reserved.`,
            centerX,
            line1Y,
            { align: "center" }
          );
          
          const prefix = "Visit us: ";
          const website = "etenderbd.com";
          const mid = " | WhatsApp: ";
          const whatsapp = "01926-959331";

          const fullText = prefix + website + mid + whatsapp;
          const fullWidth = doc.getTextWidth(fullText);
          const startX = centerX - fullWidth / 2;

          doc.text(prefix, startX, line2Y);

          const prefixWidth = doc.getTextWidth(prefix);
          doc.textWithLink(website, startX + prefixWidth, line2Y, {
            url: "https://etenderbd.com",
          });

          const websiteWidth = doc.getTextWidth(website);
          doc.text(mid, startX + prefixWidth + websiteWidth, line2Y);

          const midWidth = doc.getTextWidth(mid);
          doc.textWithLink(
            whatsapp,
            startX + prefixWidth + websiteWidth + midWidth,
            line2Y,
            {
              url: `https://wa.me/8801926959331`,
            }
          );
          doc.text(`Page ${pageNumber}`, centerX, line3Y, { align: "center" });
        }
      });


      doc.save(`Promotional_Tenders_${getBengaliDate(selectedDate).replace(/ /g, '_')}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsPdfLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadFilterCounts = async () => {
      try {
        setLoading(true);
        // Fetch ALL tenders for the selected date directly to get accurate global counts for that day
        const response = await import("@/lib/axiosInstance").then(m => m.default.get('/tenders', {
          params: {
            from: selectedDate,
            to: selectedDate,
            dateType: "publicationDateTime",
            page: 1,
            limit: 10000
          }
        }));

        const allTendersForDate = response.data?.data || [];

        if (!ignore) {
          const deptCounts = {};
          const locCounts = {};

          allTendersForDate.forEach(tender => {
            const d = tender.organization || tender.department;
            if (d) deptCounts[d] = (deptCounts[d] || 0) + 1;

            const l = tender.locationDistrict;
            if (l) locCounts[l] = (locCounts[l] || 0) + 1;
          });

          const counts = {
            departments: Object.entries(deptCounts).map(([name, count]) => ({ name, count })),
            locations: Object.entries(locCounts).map(([name, count]) => ({ name, count })),
          };
          setFilterCounts(counts);
        }
      } catch (error) {
        console.error("Failed to calculate promotional filter counts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterCounts();
    return () => { ignore = true; };
  }, [selectedDate]); // Re-run whenever selectedDate changes

  const filteredDepartments = useMemo(() => {
    const list = filterCounts.departments || [];
    if (!deptSearch) return list;
    return list.filter((d) => d.name?.toLowerCase().includes(deptSearch.toLowerCase()));
  }, [filterCounts.departments, deptSearch]);

  const filteredLocations = useMemo(() => {
    const list = filterCounts.locations?.map(l => l.name) || [];
    if (!locationSearch) return list;
    return list.filter((d) =>
      d.toLowerCase().includes(locationSearch.toLowerCase())
    );
  }, [filterCounts.locations, locationSearch]);

  const departmentCountMap = useMemo(
    () => Object.fromEntries((filterCounts?.departments || []).map((item) => [item.name, item.count || 0])),
    [filterCounts?.departments]
  );

  const locationCountMap = useMemo(
    () => Object.fromEntries((filterCounts?.locations || []).map((item) => [item.name, item.count || 0])),
    [filterCounts?.locations]
  );

  const toggleSelection = (setter, list, value) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
    setCurrentPage(1);
  };

  const getDepartmentCount = (deptName) => {
    return departmentCountMap?.[deptName] || 0;
  };

  const getLocationCount = (locName) => {
    return locationCountMap?.[locName] || 0;
  };

  // Filter options
  const priorities = ["সব", "উচ্চ", "মাঝারি", "নিম্ন"];
  const categories = ["সব", "পরিবেশ ব্যবস্থাপনা", "স্বাস্থ্যসেবা", "নিরাপত্তা ব্যবস্থা", "তথ্য প্রযুক্তি", "বিদ্যুৎ ও জ্বালানি"];

  // Filter and sort data

  // Pagination

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "উচ্চ":
        return "bg-red-100 text-red-800 border-red-200";
      case "মাঝারি":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "নিম্ন":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "উচ্চ":
        return <TrendingUp className="h-3 w-3" />;
      case "মাঝারি":
        return <Clock className="h-3 w-3" />;
      case "নিম্ন":
        return <Star className="h-3 w-3" />;
      default:
        return null;
    }
  };


  const getBengaliDate = (dateString: string) => {
    if (!dateString) return "নির্বাচন করুন";
    try {
      return new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
    } catch (e) {
      return "নির্বাচন করুন";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center flex flex-col items-center"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-red-600">টেন্ডার বিজ্ঞপ্তি</h1>
          <p className="text-red-500 mt-2 text-xl font-bold">প্রকাশনা তারিখ: {getBengaliDate(selectedDate)}</p>
          <Button
            onClick={downloadPdf}
            disabled={isPdfLoading}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white gap-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isPdfLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-white" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isPdfLoading ? "Downloading..." : "Download PDF"}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Table Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:order-1 space-y-4"
          >
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                      <TableHead className="px-4 py-4 text-slate-700 font-bold text-center">
                        ক্রম নং
                      </TableHead>
                      <TableHead className="px-4 py-4 text-slate-700 font-bold text-center">
                        টেন্ডার আইডি
                      </TableHead>
                      <TableHead className="px-4 py-4 text-slate-700 font-bold text-center">
                        প্রতিষ্ঠানের নাম
                      </TableHead>
                      <TableHead className="px-4 py-4 text-slate-700 font-bold text-center">
                        কাজের সংক্ষিপ্ত বিবরণ
                      </TableHead>
                      <TableHead className="px-4 py-4 text-slate-700 font-bold text-center">
                        দরপত্র দলিলের মূল্য
                      </TableHead>
                      <TableHead className="px-4 py-4 text-slate-700 font-bold text-center">
                        দরপত্র নিরাপত্তা
                      </TableHead>
                      <TableHead className="px-4 py-4 text-slate-700 font-bold text-center">
                        আনুমানিক মূল্য
                      </TableHead>
                      <TableHead className="px-4 py-4 text-slate-700 font-bold text-center">
                        দরপত্র শেষ তারিখ
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {loading ? (
                        Array.from({ length: pageLimit }).map((_, idx) => (
                          <TableRow key={idx}>
                            <TableCell colSpan={8} className="h-16">
                              <div className="flex items-center justify-center w-full">
                                <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        tenders?.map((tender, index) => (
                          <motion.tr
                            key={tender._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className={`border-b border-slate-100 hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                              }`}
                          >
                            <TableCell className="px-4 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                                {(currentPage - 1) * pageLimit + index + 1}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-mono text-xs">
                                  {tender.tenderId}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-center">
                              <span className="font-medium text-slate-700">{tender.organization || tender.department || "N/A"}</span>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-center">
                              <div className="max-w-xs mx-auto">
                                <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed">
                                  {tender.descriptionOfWorks}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-center">
                              <span className="font-semibold text-green-700">BDT {tender.documentPrice}</span>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-center">
                              <span className="font-medium text-orange-700">BDT {tender.tenderSecurity}</span>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-center">
                              <span className="font-medium text-slate-700">BDT {tender.estimatedCost}</span>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-center">
                              <span className="font-medium text-red-700">{formatDate(tender.openingDateTime, "MM-dd-yyyy")}</span>
                            </TableCell>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>

              {!loading && tenders?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 bg-slate-100 rounded-full mb-4">
                    <Search className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">কোন টেন্ডার পাওয়া যায়নি</h3>
                  <p className="text-slate-500 mb-4">অনুগ্রহ করে আপনার অনুসন্ধান শর্তাবলী পরিবর্তন করুন</p>
                </div>
              )}
            </Card>
            <Pagination
              data={{
                pageLimit,
                setCurrentPage,
                setPageLimit,
                count: tendersCount,
                currentPage,
              }}
            />

            {/* Notice Banner */}
            <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 px-4 py-2.5 text-slate-700 text-sm font-medium shadow-sm">
              <span className="shrink-0 font-bold">বিজ্ঞপ্তি :</span>
              <span>দরপত্রের সকল পোর্ট দেখুন E-GP ওয়েবসাইটে</span>
              <a
                href="https://etenderbd.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline underline-offset-2 text-blue-600 hover:text-blue-800 transition-colors font-semibold"
              >
                (www.etenderbd.com)
              </a>
            </div>

            {/* Contact Info Bar */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 px-4 py-2.5 text-slate-600 text-xs shadow-sm">
              <a href="mailto:support@etenderbd.com" className="flex items-center gap-1.5 hover:text-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                support@etenderbd.com
              </a>
              <a href="tel:01926959331" className="flex items-center gap-1.5 hover:text-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                01926-959331
              </a>
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ঢাকা, বাংলাদেশ
              </span>
              <a href="https://www.facebook.com/etenderinfo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                facebook.com/etenderinfo
              </a>
            </div>

            {/* Promotional Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">

              {/* Card 1 — নতুন টেন্ডার নোটিশ */}
              <div className="rounded-xl border border-blue-200 overflow-hidden shadow-sm">
                <div className="bg-[#318CE7] px-4 py-3">
                  <h3 className="text-white font-bold text-base leading-snug">নতুন টেন্ডার নোটিশ – eGP + পূর্ণ ডেটা শীট</h3>
                </div>
                <div className="bg-white px-4 py-3 space-y-1.5">
                  {[
                    "কাজের লোকেশন",
                    "প্রকাশনা তারিখ | লাস্ট সেলিং | ওপেনিং ডেট",
                    "প্রাক্কলিত মূল্য",
                    "টেন্ডার সিকিউরিটি",
                    "টার্ণওভার অ্যামাউন্ট",
                    "লিকুইড অ্যাসেটস",
                    "টেন্ডার ক্যাপাসিটি",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-green-500 mt-0.5 shrink-0">✅</span>
                      <span>• {item}</span>
                    </div>
                  ))}
                  <p className="text-sm font-bold text-slate-800 pt-2 border-t border-slate-100">
                    অতিরিক্ত যা পাচ্ছেন – অন্যান্য ওয়েবসাইটে দেওয়া পত্রিকায় তা নেই!
                  </p>
                  <a
                    href="https://etenderbd.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 bg-[#318CE7] hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    এখনই দেখুন →
                  </a>
                </div>
              </div>

              {/* Card 2 — SLT Calculation */}
              <div className="rounded-xl border border-blue-200 overflow-hidden shadow-sm">
                <div className="bg-[#318CE7] px-4 py-3">
                  <h3 className="text-white font-bold text-base leading-snug">E-GP Tender Automation – টেন্ডার প্রক্রিয়া সহজ করুন!</h3>
                </div>
                <div className="bg-white px-4 py-3 space-y-1.5">
                  {[
                    "SLT Calculation সহজ করুন",
                    "TOR2 PDF আপলোড করে ক্যালকুলেট",
                    "কোনো রেজিস্ট্রেশন বা পাসকোড লাগবে না",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-blue-500 mt-0.5 shrink-0">●</span>
                      <span>{item}</span>
                    </div>
                  ))}
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <a
                      href="https://etenderbd.com/stl-calculation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1.5 bg-[#318CE7] hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
                    >
                      এখনই চেক করুন: www.etenderbd.com
                    </a>
                    <p className="text-xs text-slate-400 mt-1 text-center">www.etenderbd.com/stl-calculation</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:order-2 space-y-4"
          >
            {selectedDepartments.length > 0 && (
              <Button
                onClick={() => {
                  setSelectedDepartments([]);
                  setSelectedLocations([]);
                  setSelectedDate(localToday);
                  setCurrentPage(1);
                }}
                variant="outline"
                className="w-full justify-center gap-2 rounded-lg border-slate-300 text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}

            <Accordion type="multiple" defaultValue={["Date Filter", "Organizations"]} className="space-y-2">
              <AccordionItem value="Date Filter" className="border-0">
                <div className="mb-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <AccordionTrigger className="flex items-center justify-between bg-teal-600 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-teal-700 hover:no-underline [&[data-state=open]>svg]:rotate-180 [&>svg]:text-white">
                    <span className="flex items-center gap-2">Publication Date</span>
                    <span className="ml-auto mr-2 flex items-center gap-1 rounded bg-white/20 px-2 py-0.5 text-xs">
                      Browse
                      <ChevronDown className="h-3 w-3 transition-transform duration-200" />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-4">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="h-10 rounded-md border-slate-200 pl-10 text-sm w-full font-medium text-slate-700"
                      />
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>

              <FilterSection
                title="Organizations"
                searchPlaceholder="Search organizations..."
                searchValue={deptSearch}
                onSearchChange={setDeptSearch}
                count={filteredDepartments?.length}
              >
                <div className="space-y-1">
                  {filteredDepartments?.map((dept) => (
                    <FilterCheckbox
                      key={dept.name}
                      label={dept.name}
                      count={getDepartmentCount(dept.name)}
                      checked={selectedDepartments.includes(dept.name)}
                      onCheckedChange={() => toggleSelection(setSelectedDepartments, selectedDepartments, dept.name)}
                    />
                  ))}
                </div>
              </FilterSection>

              <FilterSection
                title="Locations"
                searchPlaceholder="Search locations..."
                searchValue={locationSearch}
                onSearchChange={setLocationSearch}
                count={filteredLocations?.length}
              >
                <div className="space-y-1">
                  {filteredLocations?.map((loc) => (
                    <FilterCheckbox
                      key={loc}
                      label={loc}
                      count={getLocationCount(loc)}
                      checked={selectedLocations.includes(loc)}
                      onCheckedChange={() => toggleSelection(setSelectedLocations, selectedLocations, loc)}
                    />
                  ))}
                </div>
              </FilterSection>
            </Accordion>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalTender;
