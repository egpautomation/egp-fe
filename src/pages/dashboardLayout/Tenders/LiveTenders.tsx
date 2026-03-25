// @ts-nocheck
import { config } from "@/lib/config";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useAllTenders from "@/hooks/useAllTenders";
// import useAllTenderDepartments from "@/hooks/useAllTenderDepartments";
// import useAllTenderCategories from "@/hooks/getAllTenderCategories";
import {
  Search,
  X,
  ChevronDown,
  Eye,
  Bookmark,
  Copy,
  Share2,
  Calendar,
  MapPin,
  Building2,
  Tag,
  Filter,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "@/shared/Pagination/Pagination";
import { formatDate } from "@/lib/formateDate";
import { motion } from "framer-motion";
import districts from "@/utils/districts";
import TenderStatsSection from "./TenderStatsSection";
import ViewTender from "./ViewTender";
import { DatePickerWithRange } from "@/components/mainlayout/DatePickerWithRage";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const METHODS = ["LTM", "OTM", "OSTETM", "RFQ"];

// Filter Section Component
const FilterSection = ({ title, children, searchPlaceholder, searchValue, onSearchChange, count }) => (
  <AccordionItem value={title} className="border-0">
    <div className="mb-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <AccordionTrigger className="flex items-center justify-between bg-primary px-4 py-3 text-left text-sm font-semibold text-white hover:bg-primary/90 hover:no-underline [&[data-state=open]>svg]:rotate-180">
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

// Filter Checkbox Item
const FilterCheckbox = ({ label, count, checked, onCheckedChange }) => (
  <div className="flex items-start gap-2 py-1.5">
    <Checkbox
      id={label}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="mt-0.5 h-4 w-4 rounded border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:text-white"
    />
    <label htmlFor={label} className="flex flex-1 cursor-pointer items-start justify-between text-sm leading-5">
      <span className="text-slate-700">{label}</span>
      {count !== undefined && <span className="ml-2 text-xs text-slate-400">{count}</span>}
    </label>
  </div>
);

const LiveTenders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [pageLimit, setPageLimit] = useState(
    Number(searchParams.get("limit")) || 20
  );
  const [date, setDate] = useState({
    from: "",
    to: "",
  });

  // Multi-select filter states
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category") ? [searchParams.get("category")] : []
  );
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [selectedProcurementNatures, setSelectedProcurementNatures] = useState([]);

  // Search within filters
  const [deptSearch, setDeptSearch] = useState("");
  const [catSearch, setCatSearch] = useState("");
  const [locSearch, setLocSearch] = useState("");
  const [procSearch, setProcSearch] = useState("");

  // const { departments } = useAllTenderDepartments();
  // const { categories } = useAllTenderCategories();
  const [filterCounts, setFilterCounts] = useState({
    departments: [],
    categories: [],
    locations: [],
    methods: [],
    procurementNatures: [],
  });

  const { fetchAllTenders, tenders, loading, setLoading, tendersCount } = useAllTenders(
    searchTerm,
    date?.from,
    date?.to,
    selectedMethods.join("||"),
    selectedDepartments.join("||"),
    selectedCategories.join("||"),
    selectedLocations.join("||"),
    selectedProcurementNatures.join("||"),
    currentPage,
    pageLimit
  );
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const skeleton = new Array(pageLimit).fill(Math?.random());

  const hasActiveFilters =
    selectedDepartments.length > 0 ||
    selectedCategories.length > 0 ||
    selectedLocations.length > 0 ||
    selectedMethods.length > 0 ||
    searchTerm;

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDepartments([]);
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedMethods([]);
    setSelectedProcurementNatures([]);
    setCurrentPage(1);
  };

  const toggleSelection = (setter, list, value) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
    setCurrentPage(1);
  };

  const filteredDepartments = useMemo(() => {
    const list = filterCounts.departments || [];
    if (!deptSearch) return list;
    return list.filter((d) =>
      d.name?.toLowerCase().includes(deptSearch.toLowerCase())
    );
  }, [filterCounts.departments, deptSearch]);

  const filteredCategories = useMemo(() => {
    const list = filterCounts.categories || [];
    if (!catSearch) return list;
    return list.filter((c) =>
      c.name?.toLowerCase().includes(catSearch.toLowerCase())
    );
  }, [filterCounts.categories, catSearch]);

  const filteredLocations = useMemo(() => {
    const list = filterCounts.locations?.map(l => l.name) || [];
    if (!locSearch) return list;
    return list.filter((d) =>
      d.toLowerCase().includes(locSearch.toLowerCase())
    );
  }, [filterCounts.locations, locSearch]);

  const filteredProcurementNatures = useMemo(() => {
    const list = filterCounts.procurementNatures || [];
    if (!procSearch) return list;
    return list.filter((p) =>
      p.name?.toLowerCase().includes(procSearch.toLowerCase())
    );
  }, [filterCounts.procurementNatures, procSearch]);

  const displayTenders = useMemo(() => {
    let list = tenders || [];

    // Client-side filter for Nature since backend might ignore it
    if (selectedProcurementNatures.length > 0) {
      list = list.filter(t => selectedProcurementNatures.includes(t.procurementNature));
    }

    return list;
  }, [tenders, selectedProcurementNatures]);

  useEffect(() => {
    let ignore = false;

    const CACHE_KEY = "live_tenders_filter_counts_v2";
    const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

    const loadFilterCounts = async () => {
      try {
        // ── STEP 1: Try cache first (instant load, no API call needed) ──
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, ts } = JSON.parse(cached);
          if (Date.now() - ts < CACHE_TTL) {
            // Cache is still valid — set immediately without any loading block
            if (!ignore) setFilterCounts(data);
            return; // Done — no API call needed
          }
        }

        // ── STEP 2: Cache miss or expired — fetch from optimized backend endpoint ──
        const response = await import("@/lib/axiosInstance").then(m => m.default.get('/tenders/tender-filter-counts'));

        if (!ignore && response.data?.success) {
          const data = {
            departments: response.data.data.departments || [],
            categories: response.data.data.categories || [],
            locations: response.data.data.locations || [],
            methods: response.data.data.methods || [],
            procurementNatures: response.data.data.procurementNatures || [],
          };
          setFilterCounts(data);
          // Save to sessionStorage for next visit
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
        }
      } catch (error) {
        console.error("Failed to fetch filter counts:", error);
      }
    };

    loadFilterCounts();

    return () => { ignore = true; };
  }, []);

  // ── NEW: Dynamic counts based on active filters ──
  useEffect(() => {
    let ignore = false;
    
    // If no filters are active, we don't need to do local counting (initial global fetch handles it)
    if (!hasActiveFilters) {
      // Re-fetch global counts if we cleared filters to ensure they are fresh
      const refreshGlobalCounts = async () => {
         const response = await import("@/lib/axiosInstance").then(m => m.default.get('/tenders/tender-filter-counts'));
         if (!ignore && response.data?.success) {
           setFilterCounts({
             departments: response.data.data.departments || [],
             categories: response.data.data.categories || [],
             locations: response.data.data.locations || [],
             methods: response.data.data.methods || [],
             procurementNatures: response.data.data.procurementNatures || [],
           });
         }
      };
      refreshGlobalCounts();
      return;
    }

    const updateDynamicCounts = async () => {
      try {
        // Fetch ALL tenders matching current filters to count accurately
        const allFilteredTenders = await fetchAllTenders();
        
        if (!ignore && allFilteredTenders) {
          const deptMap = {};
          const catMap = {};
          const locMap = {};
          const methodMap = {};
          const natureMap = {};

          allFilteredTenders.forEach(t => {
            const d = t.organization || t.department;
            if (d) deptMap[d] = (deptMap[d] || 0) + 1;

            const c = t.category || t.tenderCategory || t.tender_subCategories;
            if (c) catMap[c] = (catMap[c] || 0) + 1;

            const l = t.locationDistrict;
            if (l) locMap[l] = (locMap[l] || 0) + 1;

            const m = t.procurementMethod;
            if (m) methodMap[m] = (methodMap[m] || 0) + 1;

            const n = t.procurementNature;
            if (n) natureMap[n] = (natureMap[n] || 0) + 1;
          });

          setFilterCounts({
            departments: Object.entries(deptMap).map(([name, count]) => ({ name, count })),
            categories: Object.entries(catMap).map(([name, count]) => ({ name, count })),
            locations: Object.entries(locMap).map(([name, count]) => ({ name, count })),
            methods: Object.entries(methodMap).map(([name, count]) => ({ name, count })),
            procurementNatures: Object.entries(natureMap).map(([name, count]) => ({ name, count })),
          });
        }
      } catch (error) {
        console.error("Failed to update dynamic counts:", error);
      }
    };

    updateDynamicCounts();

    return () => { ignore = true; };
  }, [
    searchTerm,
    selectedDepartments.length,
    selectedCategories.length,
    selectedLocations.length,
    selectedMethods.length,
    selectedProcurementNatures.length
  ]);

  const departmentCountMap = useMemo(
    () =>
      Object.fromEntries(
        (filterCounts?.departments || []).map((item) => [item.name, item.count || 0])
      ),
    [filterCounts?.departments]
  );

  const categoryCountMap = useMemo(
    () =>
      Object.fromEntries(
        (filterCounts?.categories || []).map((item) => [item.name, item.count || 0])
      ),
    [filterCounts?.categories]
  );

  const locationCountMap = useMemo(
    () =>
      Object.fromEntries(
        (filterCounts?.locations || []).map((item) => [item.name, item.count || 0])
      ),
    [filterCounts?.locations]
  );

  const methodCountMap = useMemo(
    () =>
      Object.fromEntries(
        (filterCounts?.methods || []).map((item) => [item.name, item.count || 0])
      ),
    [filterCounts?.methods]
  );

  // Calculate counts from backend filter-counts API
  const getDepartmentCount = (deptName) => {
    return departmentCountMap?.[deptName] || 0;
  };

  const getCategoryCount = (catName) => {
    return categoryCountMap?.[catName] || 0;
  };

  const getLocationCount = (locName) => {
    return locationCountMap?.[locName] || 0;
  };

  const getMethodCount = (methodName) => {
    return methodCountMap?.[methodName] || 0;
  };

  const getNatureCount = (natureName) => {
    const item = filterCounts.procurementNatures.find(p => p.name === natureName);
    return item ? item.count : 0;
  };

  const downloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      const doc = new jsPDF("l", "mm", "a4");

    const tableColumn = [
      "Tender ID",
      "Department",
      "Description",
      "Location",
      "Details",
      "Quality criteria",

    ];

    const tableRows = [];
    const allTenders = displayTenders || [];

    allTenders.forEach((item) => {
      const tenderIdAndMore = [
        `${item?.tenderId || "N/A"}`,
        `${item?.procurementType || "N/A"}`,
        `${item?.procurementMethod || "N/A"}`,
        `${item?.tenderStatus || "N/A"}`,
      ].join("\n");
      const details = [
        `LAST SELLING DATE: ${formatDate(
          item?.documentLastSelling,
          "MM-dd-yyyy"
        )}`,
        `CLOSING DATE: ${formatDate(item?.openingDateTime, "MM-dd-yyyy")}`,
        `DOCUMENT PRICE: ${item?.documentPrice || "N/A"}`,
        `TENDER SECURITY: ${item?.tenderSecurity || "N/A"}`,
        `ESTIMATED AMOUNT: ${item?.estimatedCost || "N/A"}`,
        `LINE OF CREDIT: ${item?.liquidAssets || "N/A"}`,
      ].join("\n");

      const others = [
        `GENERAL EXPERIENCE: ${item?.generalExperience || "N/A"}`,
        `JVCA: ${item?.jvca || "N/A"}`,
        `SIMILAR NATURE WORK: ${item?.similarNatureWork || "N/A"}`,
        `TURNOVER AMOUNT: ${item?.turnoverAmount || "N/A"}`,
        `LIQUID ASSET: ${item?.liquidAssets || "N/A"}`,
        `TENDER CAPACITY: ${item?.tenderCapacity || "N/A"}`,
        `WORKING LOCATION: ${item?.workingLocation || "N/A"}`,
      ].join("\n");
      const Description = [
        `${item?.descriptionOfWorks || "N/A"}`,
      ].join("\n");

      const rowData = [
        tenderIdAndMore,
        item?.organization || item?.department,
        Description,
        item?.locationDistrict,
        details,
        others,

      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      margin: { top: 20, bottom: 25, left: 10, right: 10 }, // ensures safe print area
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 2.5,
        overflow: "linebreak",
        textColor: [0, 0, 0], // Dark black text
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Tender ID
        1: { cellWidth: 40 }, // Department
        2: { cellWidth: 70 }, // Description
        3: { cellWidth: 30 }, // Location
        4: { cellWidth: 60 }, // Details
        5: { cellWidth: 47 }, // Quality criteria / Others
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.1,
        lineColor: [200, 200, 200],
        fontSize: 11,
        fontStyle: "bold",
        halign: "start",
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },

      didDrawPage: (data) => {
        const pageNumber = doc.internal.getNumberOfPages();

        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(
          "E-GP Tender Automation (Live Tenders)",
          data.settings.margin.left,
          15
        );

        const date = new Date();
        const formattedDate = `${date.getDate()} ${date.toLocaleString(
          "default",
          { month: "long" }
        )} ${date.getFullYear()}`;
        doc.setFontSize(10);
        doc.text(
          formattedDate,
          doc.internal.pageSize.width -
          data.settings.margin.right -
          doc.getTextWidth(formattedDate),
          15
        );

        const pageHeight = doc.internal.pageSize.height;
        const centerX = doc.internal.pageSize.width / 2;

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
        // Line 2 – full text, centered with links
        const prefix = "Visit us: ";
        const website = "etenderbd.com";
        const mid = " | WhatsApp: ";
        const whatsapp = "01926-959331";

        const fullText = prefix + website + mid + whatsapp;
        const fullWidth = doc.getTextWidth(fullText);
        const startX = centerX - fullWidth / 2;

        // Draw prefix
        doc.text(prefix, startX, line2Y);

        // Website link
        const prefixWidth = doc.getTextWidth(prefix);
        doc.textWithLink(website, startX + prefixWidth, line2Y, {
          url: "https://etenderbd.com",
        });

        // Mid text
        const websiteWidth = doc.getTextWidth(website);
        doc.text(mid, startX + prefixWidth + websiteWidth, line2Y);

        // WhatsApp link
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
      },

      pageBreak: "auto",
    });

      doc.save("live-tenders.pdf");
    } catch (error) {
      console.error("PDF generate error:", error);
    } finally {
      setIsPdfLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage);
    params.set("limit", pageLimit);
    setSearchParams(params);
  }, [currentPage, pageLimit]);


  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full p-4 lg:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Left Sidebar - Filters - now moved to right via grid order */}
          <div className="space-y-4 lg:order-2">
            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="w-full justify-center gap-2 rounded-lg border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search tenders, categories, organizations..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 rounded-lg border-slate-200 pl-10 pr-4 text-sm shadow-sm"
              />
            </div>

            {/* Filter Sections */}
            <Accordion type="multiple" defaultValue={["Organizations"]} className="space-y-2">
              {/* Organizations */}
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
                      key={dept._id || dept.name}
                      label={dept.name}
                      count={getDepartmentCount(dept.name)}
                      checked={selectedDepartments.includes(dept.name)}
                      onCheckedChange={() => toggleSelection(setSelectedDepartments, selectedDepartments, dept.name)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Categories */}
              <FilterSection
                title="Categories"
                searchPlaceholder="Search categories..."
                searchValue={catSearch}
                onSearchChange={setCatSearch}
                count={filteredCategories?.length}
              >
                <div className="space-y-1">
                  {filteredCategories?.map((cat) => (
                    <FilterCheckbox
                      key={cat._id || cat.name}
                      label={cat.name}
                      count={getCategoryCount(cat.name)}
                      checked={selectedCategories.includes(cat.name)}
                      onCheckedChange={() => toggleSelection(setSelectedCategories, selectedCategories, cat.name)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Locations */}
              <FilterSection
                title="Locations"
                searchPlaceholder="Search divisions, districts, upazilas..."
                searchValue={locSearch}
                onSearchChange={setLocSearch}
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

              {/* Tendering Method */}
              <FilterSection title="Tendering Method" count={METHODS.length}>
                <div className="space-y-1">
                  {METHODS.map((method) => (
                    <FilterCheckbox
                      key={method}
                      label={method}
                      count={getMethodCount(method)}
                      checked={selectedMethods.includes(method)}
                      onCheckedChange={() => toggleSelection(setSelectedMethods, selectedMethods, method)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Nature */}
              <FilterSection
                title="Nature"
                searchPlaceholder="Search nature..."
                searchValue={procSearch}
                onSearchChange={setProcSearch}
                count={filteredProcurementNatures?.length}
              >
                <div className="space-y-1">
                  {filteredProcurementNatures?.map((proc) => (
                    <FilterCheckbox
                      key={proc.name}
                      label={proc.name}
                      count={proc.count}
                      checked={selectedProcurementNatures.includes(proc.name)}
                      onCheckedChange={() => toggleSelection(setSelectedProcurementNatures, selectedProcurementNatures, proc.name)}
                    />
                  ))}
                </div>
              </FilterSection>
            </Accordion>
          </div>

          {/* Main Content - Tender List - now on left */}
          <div className="space-y-4 lg:order-1">
            {/* Header */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white">
                  <Filter className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800">Live Tenders</h1>
                  <p className="text-sm text-slate-500">
                    {tendersCount} results found
                    {hasActiveFilters && (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Filtered</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={downloadPdf}
                  variant="outline"
                  className="h-9 text-sm gap-1.5"
                  disabled={loading || tendersCount === 0 || isPdfLoading}
                >
                  {isPdfLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
                  ) : (
                    <ExternalLink size={14} className="rotate-180" />
                  )}
                  {isPdfLoading ? "Processing..." : "Print Table"}
                </Button>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {displayTenders?.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl border p-4 shadow-sm space-y-3">
                  {/* Card content goes here */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Tender ID: {item?.tenderId}</span>
                    <a
                      href={`https://www.eprocure.gov.bd/resources/common/ViewTender.jsp?id=${item?.tenderId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full border border-emerald-300 bg-gradient-to-r from-emerald-500 to-green-600 px-2 py-1 text-xs font-semibold leading-none text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-green-700 hover:shadow-md"
                      title="View on e-GP"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
                        <ExternalLink className="h-2.5 w-2.5" />
                      </span>
                      <span>e-GP</span>
                    </a>
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">
                    <Link
                      className="underline whitespace-break-spaces text-slate-700 hover:text-teal-600"
                      to={`/dashboard/view-tender/${item?._id}`}
                    >
                      {item?.descriptionOfWorks}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Organization:</span> {item?.organization || item?.department}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Location:</span> {item?.locationDistrict}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <p><span className="font-medium">Last Selling Date:</span> {formatDate(item?.documentLastSelling, "MM-dd-yyyy")}</p>
                    <p><span className="font-medium">Closing Date:</span> {formatDate(item?.openingDateTime, "MM-dd-yyyy")}</p>
                    <p><span className="font-medium">Document Price:</span> {item?.documentPrice}</p>
                    <p><span className="font-medium">Tender Security:</span> {item?.tenderSecurity}</p>
                    <p><span className="font-medium">Estimated Amount:</span> {item?.estimatedCost}</p>
                    <p><span className="font-medium">Line Of Credit:</span> {item?.liquidAssets}</p>
                  </div>
                  <div className="text-xs text-slate-600">
                    <p><span className="font-medium">General Experience:</span> {item?.generalExperience || "N/A"}</p>
                    <p><span className="font-medium">JVCA:</span> {item?.jvca || "N/A"}</p>
                    <p><span className="font-medium">Similar Nature Work:</span> {item?.similarNatureWork || "N/A"}</p>
                    <p><span className="font-medium">Turnover Amount:</span> {item?.turnoverAmount || "N/A"}</p>
                    <p><span className="font-medium">Liquid Asset:</span> {item?.liquidAssets || "N/A"}</p>
                    <p><span className="font-medium">Tender Capacity:</span> {item?.tenderCapacity || "N/A"}</p>
                    <p className="flex items-start gap-1">
                      <span className="font-medium whitespace-nowrap">Working Location:</span>
                      <span className="inline-block max-w-[150px] truncate" title={item?.workingLocation || "N/A"}>
                        {item?.workingLocation || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Original Table Design */}
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm hidden lg:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold rounded-tl-lg">
                      Tender Id
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold">
                      Organization
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold">
                      Description
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold">
                      Location
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold">
                      Details
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold">
                      Quality Criteria
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!loading ? (
                    displayTenders?.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`${idx % 2 === 1 ? "bg-slate-50" : "bg-white"} hover:bg-slate-100 transition-colors`}
                      >
                        <td className="px-4 py-3 text-sm align-top">
                          {item?.tenderId}
                        </td>
                        <td className="px-4 py-3 text-sm align-top">
                          {item?.organization || item?.department}
                        </td>
                        <td className="px-4 py-3 text-xs text-justify min-w-[200px] max-w-[300px] align-top">
                          <Link
                            className="underline whitespace-break-spaces text-slate-700 hover:text-teal-600"
                            to={`/dashboard/view-tender/${item?._id}`}
                          >
                            {item?.descriptionOfWorks}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm align-top">
                          {item?.locationDistrict}
                        </td>
                        <td className="px-4 py-3 text-sm align-top whitespace-nowrap">
                          <p>
                            <span className="font-medium text-slate-600">Last Selling Date: </span>
                            {formatDate(item?.documentLastSelling, "MM-dd-yyyy")}
                          </p>
                          <p>
                            <span className="font-medium text-slate-600">Closing Date: </span>
                            {formatDate(item?.openingDateTime, "MM-dd-yyyy")}
                          </p>
                          <p>
                            <span className="font-medium text-slate-600">Document Price: </span>
                            {item?.documentPrice}
                          </p>
                          <p>
                            <span className="font-medium text-slate-600">Tender Security: </span>
                            {item?.tenderSecurity}
                          </p>
                          <p>
                            <span className="font-medium text-slate-600">Estimated Amount: </span>
                            {item?.estimatedCost}
                          </p>
                          <p>
                            <span className="font-medium text-slate-600">Line Of Credit: </span>
                            {item?.liquidAssets}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-sm align-top whitespace-nowrap">
                          <p>
                            <span className="font-medium text-slate-600">General Experience: </span>
                            {item?.generalExperience || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-slate-600">JVCA: </span>
                            {item?.jvca || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-slate-600">Similar Nature Work: </span>
                            {item?.similarNatureWork || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-slate-600">Turnover Amount: </span>
                            {item?.turnoverAmount || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-slate-600">Liquid Asset: </span>
                            {item?.liquidAssets || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-slate-600">Tender Capacity: </span>
                            {item?.tenderCapacity || "N/A"}
                          </p>
                          <p className="flex items-start gap-1">
                            <span className="font-medium text-slate-600 whitespace-nowrap">Working Location: </span>
                            <span className="inline-block max-w-[150px] lg:max-w-[200px] truncate" title={item?.workingLocation || "N/A"}>
                              {item?.workingLocation || "N/A"}
                            </span>
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center align-top">
                          <a
                            href={`https://www.eprocure.gov.bd/resources/common/ViewTender.jsp?id=${item?.tenderId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-emerald-300 bg-gradient-to-r from-emerald-500 to-green-600 px-3.5 py-1.5 text-xs font-semibold leading-none text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-green-700 hover:shadow-md"
                            title="View on e-GP"
                          >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </span>
                            <span>e-GP</span>
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    skeleton.map((_, idx) => (
                      <tr key={idx}>
                        <td
                          colSpan={7}
                          className={`h-20 ${idx % 2 === 1 ? "bg-slate-200" : "bg-white"}`}
                        />
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {!loading && tenders?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Filter className="mb-4 h-12 w-12 text-slate-300" />
                  <p className="text-lg font-medium text-slate-600">No tenders found</p>
                  <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search criteria</p>
                  {hasActiveFilters && (
                    <Button onClick={handleClearFilters} variant="outline" className="mt-4">Clear all filters</Button>
                  )}
                </div>
              )}
            </div>

            {/* Pagination */}
            {tendersCount > 0 && (
              <Pagination
                data={{
                  pageLimit,
                  setCurrentPage,
                  setPageLimit,
                  count: tendersCount,
                  currentPage,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTenders;
