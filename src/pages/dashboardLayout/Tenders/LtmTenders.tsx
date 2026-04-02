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
import { Search, X, ChevronDown, AlignJustify, Filter, Printer, ExternalLink } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "@/shared/Pagination/Pagination";
import { formatDate } from "@/lib/formateDate";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import districts from "@/utils/districts";

// Filter Section Component
const FilterSection = ({
  title,
  children,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  count,
}) => (
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
          <div className="mt-2 border-t border-slate-100 pt-2 text-xs text-slate-500">
            {count} items found
          </div>
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
    <label
      htmlFor={label}
      className="flex flex-1 cursor-pointer items-start justify-between text-sm leading-5"
    >
      <span className="text-slate-700">{label}</span>
      {count !== undefined && <span className="ml-2 text-xs text-slate-400">{count}</span>}
    </label>
  </div>
);

const LtmTenders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageLimit, setPageLimit] = useState(Number(searchParams.get("limit")) || 20);

  // Multi-select filter states
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
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
    procurementNatures: [],
    methods: [],
  });
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const { fetchAllTenders, tenders, loading, setLoading, tendersCount } = useAllTenders(
    searchTerm,
    "", // from
    "", // to
    "LTM", // method locked to LTM
    selectedDepartments.join(","),
    selectedCategories.join(","),
    selectedLocations.join(","),
    selectedProcurementNatures.join(","),
    currentPage,
    pageLimit
  );

  const skeleton = new Array(pageLimit).fill(Math?.random());

  const hasActiveFilters =
    selectedDepartments.length > 0 ||
    selectedCategories.length > 0 ||
    selectedLocations.length > 0 ||
    searchTerm;

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDepartments([]);
    setSelectedCategories([]);
    setSelectedLocations([]);
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
    return list.filter((d) => d.name?.toLowerCase().includes(deptSearch.toLowerCase()));
  }, [filterCounts.departments, deptSearch]);

  const filteredCategories = useMemo(() => {
    const list = filterCounts.categories || [];
    if (!catSearch) return list;
    return list.filter((c) => c.name?.toLowerCase().includes(catSearch.toLowerCase()));
  }, [filterCounts.categories, catSearch]);

  const filteredLocations = useMemo(() => {
    const list = filterCounts.locations?.map((l) => l.name) || [];
    if (!locSearch) return list;
    return list.filter((d) => d.toLowerCase().includes(locSearch.toLowerCase()));
  }, [filterCounts.locations, locSearch]);

  const filteredProcurementNatures = useMemo(() => {
    const list = filterCounts.procurementNatures || [];
    if (!procSearch) return list;
    return list.filter((p) => p.name?.toLowerCase().includes(procSearch.toLowerCase()));
  }, [filterCounts.procurementNatures, procSearch]);

  const displayTenders = useMemo(() => {
    let list = tenders || [];

    // Client-side filter for Nature since backend ignores it
    if (selectedProcurementNatures.length > 0) {
      list = list.filter((t) => selectedProcurementNatures.includes(t.procurementNature));
    }

    // You could add others here if backend turns out to be unreliable for them too

    return list;
  }, [tenders, selectedProcurementNatures]);

  useEffect(() => {
    let ignore = false;

    const loadFilterCounts = async () => {
      try {
        setLoading(true);
        // Fetch all LTM tenders matching current filters to calculate accurate counts locally
        const allLtmTenders = await fetchAllTenders();

        if (!ignore && allLtmTenders) {
          const deptCounts = {};
          const catCounts = {};
          const locCounts = {};
          const procCounts = {};

          allLtmTenders.forEach((tender) => {
            const d = tender.organization || tender.department;
            if (d) deptCounts[d] = (deptCounts[d] || 0) + 1;

            const c = tender.category || tender.tenderCategory || tender.tender_subCategories;
            if (c) catCounts[c] = (catCounts[c] || 0) + 1;

            const l = tender.locationDistrict;
            if (l) locCounts[l] = (locCounts[l] || 0) + 1;

            const p = tender.procurementNature;
            if (p) procCounts[p] = (procCounts[p] || 0) + 1;
          });

          setFilterCounts({
            departments: Object.entries(deptCounts).map(([name, count]) => ({ name, count })),
            categories: Object.entries(catCounts).map(([name, count]) => ({ name, count })),
            locations: Object.entries(locCounts).map(([name, count]) => ({ name, count })),
            procurementNatures: Object.entries(procCounts).map(([name, count]) => ({
              name,
              count,
            })),
            methods: [{ name: "LTM", count: allLtmTenders.length }],
          });
        }
      } catch (error) {
        console.error("Failed to calculate LTM filter counts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterCounts();

    return () => {
      ignore = true;
    };
  }, [
    searchTerm,
    selectedDepartments.length,
    selectedCategories.length,
    selectedLocations.length,
    selectedProcurementNatures.length,
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

  const getDepartmentCount = (deptName) => departmentCountMap?.[deptName] || 0;
  const getCategoryCount = (catName) => categoryCountMap?.[catName] || 0;
  const getLocationCount = (locName) => locationCountMap?.[locName] || 0;
  const getNatureCount = (procName) => {
    const item = filterCounts.procurementNatures.find((p) => p.name === procName);
    return item ? item.count : 0;
  };

  const downloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      const doc = new jsPDF("l", "mm", "a4");

      const tableColumn = ["Tender ID", "Department", "Description", "Location", "Details"];

      const tableRows = [];
      const allTendersForPrint = displayTenders || [];

      allTendersForPrint.forEach((item) => {
        const tenderIdAndMore = [
          `${item?.tenderId || "N/A"}`,
          `${item?.procurementType || "N/A"}`,
          `${item?.procurementMethod || "N/A"}`,
          `${item?.tenderStatus || "N/A"}`,
        ].join("\n");
        const details = [
          `LAST SELLING DATE: ${formatDate(item?.documentLastSelling, "MM-dd-yyyy")}`,
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

        const rowData = [
          tenderIdAndMore,
          item?.organization || item?.department,
          item?.descriptionOfWorks || "N/A",
          item?.locationDistrict,
          details,
        ];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 25,
        margin: { top: 20, bottom: 25, left: 10, right: 10 },
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 2.5,
          overflow: "linebreak",
          textColor: [0, 0, 0], // Dark black text
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 40 },
          2: { cellWidth: 80 }, // Increased width as Quality Criteria is removed
          3: { cellWidth: 30 },
          4: { cellWidth: 70 }, // Increased width as Quality Criteria is removed
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontSize: 11,
          fontStyle: "bold",
          halign: "start",
          lineWidth: 0.1,
          lineColor: [200, 200, 200],
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255],
        },
        didDrawPage: (data) => {
          const pageNumber = doc.internal.getNumberOfPages();
          doc.setFontSize(18);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
          doc.text("E-GP Tender Automation (LTM Tenders)", data.settings.margin.left, 15);

          const dateStr = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(
            dateStr,
            doc.internal.pageSize.width - data.settings.margin.right - doc.getTextWidth(dateStr),
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
          doc.textWithLink(whatsapp, startX + prefixWidth + websiteWidth + midWidth, line2Y, {
            url: `https://wa.me/8801926959331`,
          });
          doc.text(`Page ${pageNumber}`, centerX, line3Y, { align: "center" });
        },
      });

      doc.save("ltm-tenders.pdf");
    } catch (error) {
      console.error("PDF Generate Error:", error);
    } finally {
      setIsPdfLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage);
    params.set("limit", pageLimit);
    setSearchParams(params);
  }, [currentPage, pageLimit, setSearchParams]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full p-4 lg:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Right Sidebar - Filters */}
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
                placeholder="Search LTM tenders..."
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
                      onCheckedChange={() =>
                        toggleSelection(setSelectedDepartments, selectedDepartments, dept.name)
                      }
                    />
                  ))}
                </div>
              </FilterSection>

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
                      onCheckedChange={() =>
                        toggleSelection(setSelectedCategories, selectedCategories, cat.name)
                      }
                    />
                  ))}
                </div>
              </FilterSection>

              <FilterSection
                title="Locations"
                searchPlaceholder="Search locations..."
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
                      onCheckedChange={() =>
                        toggleSelection(setSelectedLocations, selectedLocations, loc)
                      }
                    />
                  ))}
                </div>
              </FilterSection>

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
                      onCheckedChange={() =>
                        toggleSelection(
                          setSelectedProcurementNatures,
                          selectedProcurementNatures,
                          proc.name
                        )
                      }
                    />
                  ))}
                </div>
              </FilterSection>
            </Accordion>
          </div>

          {/* Main Content */}
          <div className="space-y-4 lg:order-1">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4874c7] text-white">
                  <AlignJustify className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800">LTM Live Tenders</h1>
                  <p className="text-sm text-slate-500">
                    {tendersCount} results found
                    {hasActiveFilters && (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Filtered
                      </span>
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
                    <Printer size={14} />
                  )}
                  {isPdfLoading ? "Processing..." : "Print as PDF"}
                </Button>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm max-lg:hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-4 py-3 text-left text-sm font-semibold rounded-tl-lg">
                      Tender Id
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Organization</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold w-96">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Details</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!loading
                    ? displayTenders?.map((item, idx) => (
                        <tr
                          key={idx}
                          className={`${idx % 2 === 1 ? "bg-slate-50" : "bg-white"} hover:bg-slate-100 transition-colors`}
                        >
                          <td className="px-4 py-3 text-sm align-top">{item?.tenderId}</td>
                          <td className="px-4 py-3 text-sm align-top">
                            {item?.organization || item?.department}
                          </td>
                          <td className="px-4 py-3 text-xs text-justify align-top">
                            <Link
                              className="underline whitespace-break-spaces text-slate-700 hover:text-[#4874c7]"
                              to={`/dashboard/view-tender/${item?._id}`}
                            >
                              {item?.descriptionOfWorks}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sm align-top">{item?.locationDistrict}</td>
                          <td className="px-4 py-3 text-sm align-top whitespace-nowrap text-slate-600">
                            <p>
                              <span className="font-medium">Selling: </span>
                              {formatDate(item?.documentLastSelling, "MM-dd-yyyy")}
                            </p>
                            <p>
                              <span className="font-medium">Closing: </span>
                              {formatDate(item?.openingDateTime, "MM-dd-yyyy")}
                            </p>
                            <p>
                              <span className="font-medium">Price: </span>
                              {item?.documentPrice}
                            </p>
                            <p>
                              <span className="font-medium">Security: </span>
                              {item?.tenderSecurity}
                            </p>
                            <p>
                              <span className="font-medium">Estimated: </span>
                              {item?.estimatedCost}
                            </p>
                            <p>
                              <span className="font-medium">Credit: </span>
                              {item?.liquidAssets}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-center align-top">
                            <a
                              href={`https://www.eprocure.gov.bd/resources/common/ViewTender.jsp?id=${item?.tenderId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              e-GP
                            </a>
                          </td>
                        </tr>
                      ))
                    : skeleton.map((_, idx) => (
                        <tr key={idx}>
                          <td
                            colSpan={6}
                            className={`h-20 ${idx % 2 === 1 ? "bg-slate-100" : "bg-white"}`}
                          />
                        </tr>
                      ))}
                </tbody>
              </table>
              {!loading && tenders?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Filter className="mb-4 h-12 w-12 text-slate-300" />
                  <p className="text-lg font-medium text-slate-600">No LTM tenders found</p>
                  <Button onClick={handleClearFilters} variant="outline" className="mt-4">
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {displayTenders?.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl border p-4 shadow-sm space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-slate-500">Tender Id</span>
                    <span className="font-bold text-lg">{item?.tenderId}</span>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-semibold text-slate-500 text-sm">Description</p>
                    <Link className="text-sm underline" to={`/dashboard/view-tender/${item?._id}`}>
                      {item?.descriptionOfWorks}
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500">Organization</span>
                      <p>{item?.organization || item?.department}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Location</span>
                      <p>{item?.locationDistrict}</p>
                    </div>
                  </div>
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <a
                      href={`https://www.eprocure.gov.bd/resources/common/ViewTender.jsp?id=${item?.tenderId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" /> View on e-GP
                    </a>
                  </Button>
                </div>
              ))}
            </div>

            <Pagination
              data={{
                pageLimit,
                setCurrentPage,
                setPageLimit,
                count: tendersCount,
                currentPage,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LtmTenders;
