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

const PromotionalTender = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const localToday = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(localToday);

  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [deptSearch, setDeptSearch] = useState("");
  const [filterCounts, setFilterCounts] = useState({
    departments: [],
  });

  const { fetchAllTenders, tenders, loading, setLoading, tendersCount } = useAllTenders(
    "", // searchTerm
    selectedDate, // from
    selectedDate, // to
    "", // method
    selectedDepartments.join(","), // department
    "", // category
    "", // location
    "", // procurementNature
    currentPage,
    pageLimit
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
        "Last Selling Date"
      ];

      const tableRows: any[] = [];
      // Fetch all underlying filtered data before printing
      const allTenders = await fetchAllTenders();

      allTenders.forEach((item: any) => {
        const rowData = [
          item?.tenderId || "N/A",
          item?.organization || item?.department || "N/A",
          item?.descriptionOfWorks || "N/A",
          item?.documentPrice ? `BDT ${item.documentPrice}` : "N/A",
          item?.tenderSecurity ? `BDT ${item.tenderSecurity}` : "N/A",
          item?.estimatedCost ? `BDT ${item.estimatedCost}` : "N/A",
          formatDate(item?.documentLastSelling, "dd-MM-yyyy")
        ];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30, // Lowered start to properly clear header
        margin: { top: 25, bottom: 45, left: 14, right: 14 },
        styles: {
          fontSize: 9,
          cellPadding: 4,
          textColor: [40, 40, 40],
          lineColor: [220, 220, 220],
          lineWidth: 0.1,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [220, 38, 38], // Professional Red theme
          textColor: 255,
          fontSize: 10,
          fontStyle: "bold",
          halign: "left",
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250],
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
          doc.setFontSize(18);
          doc.setTextColor(220, 38, 38);
          doc.setFont("helvetica", "bold");
          doc.text("Promotional Tenders Report", data.settings.margin.left, 18);

          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.setFont("helvetica", "normal");
          doc.text(`Generated on: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.getWidth() - data.settings.margin.right, 18, { align: 'right' });
        }
      });

      const randomPromo = promotionalTexts[Math.floor(Math.random() * promotionalTexts.length)];

      const finalY = (doc as any).lastAutoTable.finalY || 30;

      // Ensure there is space for the promo text box
      if (finalY > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage();
        (doc as any).lastAutoTable.finalY = 20;
      }

      const currentFinalY = (doc as any).lastAutoTable.finalY || 20;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold"); // Start bold for the title part

      const promoLines = doc.splitTextToSize(randomPromo, doc.internal.pageSize.getWidth() - 40);
      const boxHeight = promoLines.length * 6 + 16;
      const boxY = currentFinalY + 15;

      // Promo Box Background
      doc.setFillColor(254, 242, 242); // Light red background
      doc.setDrawColor(220, 38, 38);   // Solid red border
      doc.setLineWidth(0.5);
      doc.roundedRect(14, boxY, doc.internal.pageSize.getWidth() - 28, boxHeight, 3, 3, 'FD'); // Filled and drawn with rounded corners

      // Promo Text
      doc.setTextColor(185, 28, 28); // Darker red text
      doc.setFont("helvetica", "normal");

      // Print lines, optionally making the first line bold
      promoLines.forEach((line: string, i: number) => {
        if (i === 0) doc.setFont("helvetica", "bold");
        else doc.setFont("helvetica", "normal");

        doc.text(line, 20, boxY + 12 + (i * 6));
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
        // We use a direct API call here so the organization counts aren't restricted by the date filter
        const response = await import("@/lib/axiosInstance").then(m => m.default.get('/tenders', {
          params: { page: 1, limit: 10000 }
        }));
        const allTenders = response.data?.data;

        if (!ignore && allTenders) {
          const deptCounts: Record<string, number> = {};
          allTenders.forEach((tender: any) => {
            const d = tender.organization || tender.department || tender.ministry || tender.procuringEntityName;
            if (d) deptCounts[d] = (deptCounts[d] || 0) + 1;
          });
          setFilterCounts({
            departments: Object.entries(deptCounts).map(([name, count]) => ({ name, count: count as number })),
          });
        }
      } catch (error) {
        console.error("Failed to calculate filter counts:", error);
      }
    };
    loadFilterCounts();
    return () => { ignore = true; };
  }, []);

  const departmentCountMap = useMemo(
    () => Object.fromEntries((filterCounts?.departments || []).map((item) => [item.name, item.count || 0])),
    [filterCounts?.departments]
  );

  const filteredDepartments = useMemo(() => {
    const list = filterCounts.departments || [];
    if (!deptSearch) return list;
    return list.filter((d) => d.name?.toLowerCase().includes(deptSearch.toLowerCase()));
  }, [filterCounts.departments, deptSearch]);

  const toggleSelection = (setter, list, value) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
    setCurrentPage(1);
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

  const FilterSection = ({ title, children, searchPlaceholder, searchValue, onSearchChange, count }) => (
    <AccordionItem value={title} className="border-0">
      <div className="mb-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <AccordionTrigger className="flex items-center justify-between bg-teal-600 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-teal-700 hover:no-underline [&[data-state=open]>svg]:rotate-180 [&>svg]:text-white">
          <span className="flex items-center gap-2">{title}</span>
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
          <p className="text-red-500 mt-2 text-xl font-bold">শেষ তারিখ: {getBengaliDate(selectedDate)}</p>
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
                        বিক্রির শেষ তারিখ
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {loading ? (
                        Array.from({ length: pageLimit }).map((_, idx) => (
                          <TableRow key={idx}>
                            <TableCell colSpan={7} className="h-16">
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
                              <span className="font-medium text-red-700">{formatDate(tender.documentLastSelling, "dd MMMM yyyy")}</span>
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
                    <span className="flex items-center gap-2">Last Selling Date</span>
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
                      count={departmentCountMap[dept.name]}
                      checked={selectedDepartments.includes(dept.name)}
                      onCheckedChange={() => toggleSelection(setSelectedDepartments, selectedDepartments, dept.name)}
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
