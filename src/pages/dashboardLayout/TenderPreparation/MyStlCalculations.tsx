// @ts-nocheck
import { useState, useEffect, useContext } from "react";
import { format } from "date-fns";
import { AuthContext } from "@/provider/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { 
  Briefcase, 
  Calendar, 
  Search, 
  Eye, 
  Download, 
  Loader2, 
  RefreshCw, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Calculator, 
  Award 
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 10;

export default function MyStlCalculations() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [calculations, setCalculations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchCalculations = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setLoading(true);

    try {
      const response = await axiosInstance.get(
        `/stl/my-calculations?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${debouncedSearch}`
      );
      if (response.data?.success) {
        setCalculations(response.data.data || []);
        setTotalCount(response.data.totalCount || 0);
      } else {
        toast.error("Failed to load calculations");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to fetch calculations";
      console.error("[MyStlCalculations] fetch error:", err.response?.status, errMsg, err.response?.data);
      toast.error(errMsg);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, [currentPage, debouncedSearch]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const calculateDifference = (price: number, xoce: number) => {
    if (!price || !xoce) return "-";
    const diff = ((price - xoce) / xoce) * 100;
    return `${diff > 0 ? "+" : ""}${diff.toFixed(2)}%`;
  };

  const handleDownloadPdf = (calc: any) => {
    if (!calc) return;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // === BRANDING HEADER ===
      doc.setFillColor(30, 87, 179);
      doc.rect(0, 0, pageWidth, 25, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("eTenderBD", 14, 16);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("www.etenderbd.com", pageWidth - 14, 16, { align: "right" });

      // === REPORT TITLE ===
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("STL Calculation Report", pageWidth / 2, 38, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date(calc.uploadedAt).toLocaleString()}`, pageWidth / 2, 44, { align: "center" });

      doc.setLineWidth(0.5);
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 48, pageWidth - 14, 48);

      // === REPORT DATA ===
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Input Parameters", 14, 58);

      autoTable(doc, {
        startY: 62,
        head: [["Parameter", "Value", "Description"]],
        body: [
          ["Tender ID", calc.tenderId || "N/A", "Unique e-GP Tender Identification"],
          ["Organization", calc.organizationName || "N/A", "Procuring Entity / Department"],
          ["XOCE (Cost Estimate)", calc.xoce || calc.estimateCost || "N/A", "Official Approved Cost Estimate"],
          ["Price Index (NPPI)", calc.priceIndex != null ? calc.priceIndex : "N/A", "Market Price Adjustment Factor"],
        ],
        theme: "grid",
        headStyles: { fillColor: [30, 87, 179], fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 14, right: 14, bottom: 25 },
      });

      const resultsY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Calculation Results", 14, resultsY);

      autoTable(doc, {
        startY: resultsY + 4,
        head: [["Metric", "Value"]],
        body: [
          ["Weighted Average (WA)", calc.wa != null ? calc.wa.toFixed(4) : "N/A"],
          ["Standard Deviation (SD)", calc.sd != null ? calc.sd.toFixed(4) : "N/A"],
          ["Significantly Low Price (SLT)", calc.slt != null ? calc.slt.toFixed(4) : "N/A"],
          ["Average of Qualified Prices (Xi)", calc.xi != null ? calc.xi.toFixed(4) : "N/A"],
        ],
        theme: "grid",
        headStyles: { fillColor: [30, 87, 179], fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 14, right: 14, bottom: 25 },
      });

      let biddersY = (doc as any).lastAutoTable.finalY + 10;
      if (biddersY > pageHeight - 40) {
        doc.addPage();
        biddersY = 20;
      }

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Bidders & Evaluation", 14, biddersY);

      // Format bidder rows
      const bidderRows = (calc.bidders || []).map((bidder: any) => {
        const isAbove110 = bidder.price > (calc.xoce || calc.estimateCost) * 1.1;
        const isResponsive = bidder.qualified && bidder.price >= calc.slt && !isAbove110;
        
        return [
          bidder.name,
          parseFloat(bidder.price || bidder.finalPrice || bidder.quotedAmount || 0).toFixed(2),
          calculateDifference(bidder.price || bidder.finalPrice || bidder.quotedAmount || 0, calc.xoce || calc.estimateCost),
          bidder.qualified ? "Yes" : "No",
          isResponsive ? "Responsive" : "Non-Responsive",
          bidder.rank != null ? bidder.rank.toString() : "-",
        ];
      });

      autoTable(doc, {
        startY: biddersY + 4,
        head: [["Bidder Name", "Price", "Delta %", "Technical", "Financial Resp.", "Rank"]],
        body: bidderRows,
        theme: "grid",
        headStyles: { fillColor: [30, 87, 179], fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 14, right: 14, bottom: 25 },
        columnStyles: { 0: { cellWidth: 50 } },
      });

      let winnerY = (doc as any).lastAutoTable.finalY + 10;
      if (winnerY > pageHeight - 50) {
        doc.addPage();
        winnerY = 20;
      }

      doc.setFillColor(240, 249, 235);
      doc.roundedRect(14, winnerY, pageWidth - 28, 28, 3, 3, "F");
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(22, 101, 52);
      doc.text("Winning Bidder", pageWidth / 2, winnerY + 10, { align: "center" });
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(
        calc.winner && calc.winner !== "None"
          ? `${calc.winner} - Price: ${calc.winnerPrice}`
          : "No responsive bidder found",
        pageWidth / 2,
        winnerY + 20,
        { align: "center" }
      );
      
      // === BRANDING FOOTER ===
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);

        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        
        const footerText1 = "Email: support@etenderbd.com  |  Phone: 01926-959331  |  Dhaka, Bangladesh";
        const footerText2 = "Facebook: facebook.com/etenderinfo  |  Web: www.etenderbd.com";
        
        doc.text(footerText1, pageWidth / 2, pageHeight - 13, { align: "center" });
        doc.text(footerText2, pageWidth / 2, pageHeight - 8, { align: "center" });
        
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 13, { align: "right" });
      }

      doc.save(`STL_Report_${calc.tenderId || "Calc"}.pdf`);
      toast.success("PDF report downloaded successfully");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Could not generate PDF report");
    }
  };


  // KPI Calculations (based on calculations data list)
  const totalCalcsCount = totalCount;
  const latestCalcDate = calculations[0] ? format(new Date(calculations[0].uploadedAt), "MMM dd, yyyy") : "—";
  const uniqueTendersCount = calculations.filter((v, i, a) => a.findIndex(t => t.tenderId === v.tenderId) === i).length;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-slate-50/50 min-h-screen space-y-6">
      {/* Upper header segment */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            My STL Calculations
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Browse and download reports for your past PPR 2025 STL calculations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => fetchCalculations(true)}
            variant="outline"
            disabled={isRefreshing}
            className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm rounded-xl gap-2 h-10 px-4"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Link to="/dashboard/stl-calculation">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-100 hover:shadow-lg transition-all h-10 px-5 gap-2">
              <Calculator className="h-4 w-4" />
              New Calculation
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <Card className="rounded-2xl border-slate-200/60 shadow-sm border-t-4 border-t-blue-500 bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Calculations
              </span>
              <span className="text-3xl font-bold text-slate-800 block">
                {totalCalcsCount}
              </span>
            </div>
            <div className="bg-blue-50 text-blue-600 rounded-2xl p-3">
              <Briefcase className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="rounded-2xl border-slate-200/60 shadow-sm border-t-4 border-t-emerald-500 bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Latest Calculation
              </span>
              <span className="text-lg font-bold text-slate-700 block truncate">
                {latestCalcDate}
              </span>
            </div>
            <div className="bg-emerald-50 text-emerald-600 rounded-2xl p-3">
              <Calendar className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="rounded-2xl border-slate-200/60 shadow-sm border-t-4 border-t-indigo-500 bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Unique Tenders
              </span>
              <span className="text-3xl font-bold text-slate-800 block">
                {uniqueTendersCount}
              </span>
            </div>
            <div className="bg-indigo-50 text-indigo-600 rounded-2xl p-3">
              <Award className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main calculation sheet block */}
      <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Calculation History
          </CardTitle>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by Tender ID or Winner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-slate-50/50 w-full"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="text-sm text-slate-400 font-medium">Fetching calculation history...</p>
            </div>
          ) : calculations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-slate-50 rounded-full p-4 mb-4">
                <AlertCircle className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">No calculations found</h3>
              <p className="text-sm text-slate-400 max-w-sm mt-1">
                {debouncedSearch ? "Try refining your search query." : "You have not performed any calculations yet."}
              </p>
              {!debouncedSearch && (
                <Link to="/dashboard/stl-calculation" className="mt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2">
                    <Calculator className="h-4 w-4" />
                    Calculate Now
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/70">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700">Date</TableHead>
                    <TableHead className="font-semibold text-slate-700">Tender ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">Organization</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">XOCE (Est. Cost)</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Price Index</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">SLT Price</TableHead>
                    <TableHead className="font-semibold text-slate-700">Winner</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calculations.map((calc: any) => (
                    <TableRow key={calc._id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                      <TableCell className="text-slate-600 font-medium whitespace-nowrap">
                        {format(new Date(calc.uploadedAt), "MMM dd, yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-slate-800 font-bold">
                        {calc.tenderId || "—"}
                      </TableCell>
                      <TableCell className="text-slate-600 max-w-[200px] truncate">
                        {calc.organizationName || "—"}
                      </TableCell>
                      <TableCell className="text-slate-800 font-medium text-right whitespace-nowrap">
                        {calc.xoce || calc.estimateCost || "—"}
                      </TableCell>
                      <TableCell className="text-slate-800 font-medium text-right">
                        {calc.priceIndex || "—"}
                      </TableCell>
                      <TableCell className="text-slate-800 font-bold text-right text-blue-600">
                        {calc.slt != null ? calc.slt.toFixed(3) : "—"}
                      </TableCell>
                      <TableCell className="text-slate-800 font-medium max-w-[150px] truncate">
                        {calc.winner && calc.winner !== "None" ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">{calc.winner}</span>
                            <span className="text-xs text-slate-400">Rate: {calc.winnerPrice}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">No responsive bid</span>
                        )}
                      </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/dashboard/my-stl-calculations/${calc._id}`}
                              title="View & Edit Details"
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadPdf(calc)}
                              className="h-9 w-9 p-0 hover:bg-slate-100 rounded-full"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4 text-blue-600" />
                            </Button>
                          </div>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-white">
              <span className="text-xs sm:text-sm text-slate-400 font-medium">
                Page {currentPage} of {totalPages} ({totalCount} items)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="rounded-xl h-9 px-3 gap-1 border-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="rounded-xl h-9 px-3 gap-1 border-slate-200"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

