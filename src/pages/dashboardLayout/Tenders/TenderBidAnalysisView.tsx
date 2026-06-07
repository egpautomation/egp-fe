// @ts-nocheck
import { useParams, useNavigate } from "react-router-dom";
import config from "@/lib/config";
import useSingleData from "@/hooks/useSingleData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Users,
  Percent,
  Award,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Loader2,
  MapPin,
  ArrowLeft,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";

// ─── Types ───────────────────────────────────────────────────
interface BidderDetail {
  name: string;
  price: number;
  finalPrice?: number;
  quotedAmount?: number;
  qualified: boolean;
  isResponsive?: boolean;
  rank?: number | "-";
}

interface StlRecord {
  _id: string;
  tenderId: string;
  estimateCost: number;
  xoce?: number;
  winner: string;
  winnerPrice: number;
  slt: number;
  priceIndex: number;
  locationDistrict?: string;
  organization?: string;
  organizationName?: string;
  xi?: number;
  wa?: number;
  sd?: number;
  bidders?: BidderDetail[];
  extractedData?: any[];
}

// ─── Helpers ─────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString("bn-BD");

// Dynamic calculation fallback helper for complete data assurance
const getCalculatedRecord = (record: StlRecord): StlRecord => {
  if (!record) return record;

  const biddersList =
    record.bidders && record.bidders.length > 0
      ? record.bidders.map((b) => ({
          name: b.name,
          price: Number(b.price || b.finalPrice || b.quotedAmount || 0),
          qualified: b.qualified !== false,
          isResponsive: b.isResponsive,
          rank: b.rank,
        }))
      : (record.extractedData || []).map((item: any) => ({
          name: item.nameOfTenderer || item.name || "",
          price: Number(
            item.quotedAmountWithDiscount ||
              item.quotedAmountWithoutDiscount ||
              item.price ||
              0
          ),
          qualified: true,
          isResponsive: true,
          rank: "-",
        }));

  const xoceValue = Number(record.xoce || record.estimateCost || 0);
  const priceIndexValue = Number(record.priceIndex != null ? record.priceIndex : 0.9168);
  const x_nppi = xoceValue * priceIndexValue;

  const validPrices = biddersList
    .filter((b) => b.qualified)
    .map((b) => b.price)
    .filter((p) => !isNaN(p) && p > 0);

  let computedXi = record.xi || 0;
  let computedWa = record.wa || 0;
  let computedSd = record.sd || 0;
  let computedSlt = record.slt || 0;
  let computedWinner = record.winner;
  let computedWinnerPrice = record.winnerPrice;

  // Run dynamic calculation if SLT metric is missing
  if (!computedSlt && validPrices.length > 0) {
    const n = validPrices.length;
    const total = validPrices.reduce((sum, p) => sum + p, 0);
    computedXi = total / n;
    computedWa = xoceValue * 0.2 + computedXi * 0.5 + x_nppi * 0.3;
    const variance = validPrices.reduce((sum, p) => sum + Math.pow(p - computedWa, 2), 0) / n;
    computedSd = Math.sqrt(variance);
    computedSlt = computedWa - computedSd;

    const evaluatedBidders = biddersList.map((b) => {
      const isAbove110 = b.price > xoceValue * 1.1;
      const isResponsive = b.qualified && b.price >= computedSlt && !isAbove110;
      return {
        ...b,
        isAbove110,
        isResponsive,
      };
    });

    const responsiveBidders = evaluatedBidders
      .map((b, i) => ({ b, i }))
      .filter((item) => item.b.isResponsive)
      .sort((a, b) => a.b.price - b.b.price);

    responsiveBidders.forEach((item, i) => {
      evaluatedBidders[item.i].rank = i + 1;
    });

    if (responsiveBidders.length > 0) {
      computedWinner = responsiveBidders[0].b.name;
      computedWinnerPrice = responsiveBidders[0].b.price;
    } else {
      computedWinner = "None";
      computedWinnerPrice = 0;
    }

    return {
      ...record,
      estimateCost: xoceValue,
      priceIndex: priceIndexValue,
      xi: Number(computedXi.toFixed(4)),
      wa: Number(computedWa.toFixed(4)),
      sd: Number(computedSd.toFixed(4)),
      slt: Number(computedSlt.toFixed(4)),
      winner: computedWinner,
      winnerPrice: computedWinnerPrice === "None" ? 0 : Number(computedWinnerPrice),
      bidders: evaluatedBidders,
    };
  }

  // Ensure responsiveness and rankings are populated
  const evaluatedBidders = biddersList.map((b) => {
    const isAbove110 = b.price > xoceValue * 1.1;
    const sltVal = computedSlt || 0;
    const isResponsive = b.qualified && b.price >= sltVal && !isAbove110;
    return {
      ...b,
      isAbove110,
      isResponsive,
    };
  });

  const responsiveBidders = evaluatedBidders
    .map((b, i) => ({ b, i }))
    .filter((item) => item.b.isResponsive)
    .sort((a, b) => a.b.price - b.b.price);

  responsiveBidders.forEach((item, i) => {
    evaluatedBidders[item.i].rank = i + 1;
  });

  return {
    ...record,
    estimateCost: xoceValue,
    priceIndex: priceIndexValue,
    xi: computedXi || (validPrices.length > 0 ? validPrices.reduce((a, b) => a + b, 0) / validPrices.length : 0),
    wa: computedWa,
    sd: computedSd,
    slt: computedSlt,
    winner: record.winner || (responsiveBidders.length > 0 ? responsiveBidders[0].b.name : "None"),
    winnerPrice: record.winnerPrice || (responsiveBidders.length > 0 ? responsiveBidders[0].b.price : 0),
    bidders: evaluatedBidders,
  };
};

export default function TenderBidAnalysisView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: rawRecord, loading } = useSingleData(`${config.apiBaseUrl}/stl/${id}`);

  // Recalculate on top of fetched record to ensure full integrity
  const record = rawRecord && Object.keys(rawRecord).length > 0 ? getCalculatedRecord(rawRecord as StlRecord) : null;

  const handleDownloadPdf = () => {
    if (!record) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Tender STL Calculation Report", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Tender ID: #${record.tenderId} | Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(14, 32, pageWidth - 14, 32);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Input Parameters", 14, 40);

    // Format money in English for the PDF report to bypass unicode rendering bugs in standard helvetica fonts
    autoTable(doc, {
      startY: 44,
      head: [["Parameter", "Value", "Description"]],
      body: [
        ["Official Approved Cost (XOCE)", record.estimateCost ? record.estimateCost.toLocaleString("en-US") + " TK" : "-", "Official Cost Estimate of the Tender"],
        ["Price Index (NPPI)", record.priceIndex != null ? record.priceIndex.toString() : "-", "Market Price Index Factor"],
      ],
      theme: "grid",
      headStyles: { fillColor: [30, 87, 179], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    });

    const resultsY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Calculation Results", 14, resultsY);

    const xNppiVal = record.estimateCost && record.priceIndex ? (record.estimateCost * record.priceIndex).toFixed(4) : "-";

    autoTable(doc, {
      startY: resultsY + 4,
      head: [["Metric", "Value"]],
      body: [
        ["Weighted Average (WA)", record.wa != null ? record.wa.toString() : "-"],
        ["Standard Deviation (SD)", record.sd != null ? record.sd.toString() : "-"],
        ["Significantly Low Price (SLT)", record.slt != null ? record.slt.toString() : "-"],
        ["Average of Qualified Prices (Xi)", record.xi != null ? record.xi.toString() : "-"],
        ["X_NPPI (XOCE x NPPI)", xNppiVal],
      ],
      theme: "grid",
      headStyles: { fillColor: [30, 87, 179], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    });

    let biddersY = (doc as any).lastAutoTable.finalY + 10;
    if (biddersY > 240) {
      doc.addPage();
      biddersY = 20;
    }

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Bidders & Evaluation", 14, biddersY);

    const bidderRows = (record.bidders || []).map((bidder, index) => {
      const diffCost = (record.estimateCost || 0) - (bidder.price || 0);
      const diffPct = record.estimateCost ? ((diffCost / record.estimateCost) * 100) : 0;
      const diffSign = diffPct >= 0 ? "-" : "+";
      const diffStr = record.estimateCost ? `${diffSign}${Math.abs(diffPct).toFixed(2)}%` : "-";

      return [
        (index + 1).toString(),
        bidder.name || "-",
        bidder.price ? bidder.price.toLocaleString("en-US") + " TK" : "-",
        diffStr,
        bidder.qualified ? "Yes" : "No",
        bidder.isResponsive ? "Responsive" : "Non-Responsive",
        bidder.rank?.toString() || "-",
      ];
    });

    autoTable(doc, {
      startY: biddersY + 4,
      head: [["SL", "Bidder Name", "Quoted Price", "Delta %", "Technical", "Financial Resp.", "Rank"]],
      body: bidderRows,
      theme: "grid",
      headStyles: { fillColor: [30, 87, 179], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
      columnStyles: { 1: { cellWidth: 50 } },
    });

    let winnerY = (doc as any).lastAutoTable.finalY + 10;
    if (winnerY > 260) {
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
      record.winner && record.winner !== "None"
        ? `${record.winner} - Price: ${record.winnerPrice ? record.winnerPrice.toLocaleString("en-US") + " TK" : "-"}`
        : "No responsive bidder found",
      pageWidth / 2,
      winnerY + 20,
      { align: "center" }
    );
    doc.setTextColor(0, 0, 0);

    doc.save(`Tender_${record.tenderId}_STL_Report.pdf`);
    toast.success("PDF report downloaded successfully!");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">টেন্ডার বিবরণী লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-red-500 font-semibold text-lg">টেন্ডার বিবরণী পাওয়া যায়নি</p>
        <Button onClick={() => navigate("/dashboard/nppi-calculation")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          তালিকায় ফিরে যান
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 -m-5 p-5 md:p-8 space-y-8">
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard/nppi-calculation")}
            className="w-10 h-10 rounded-xl hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              টেন্ডার দর বিশ্লেষণ বিস্তারিত
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              টেন্ডার আইডি: <span className="font-semibold text-slate-700">#{record.tenderId}</span> | অর্গানাইজেশন: <span className="font-semibold text-slate-700">{record.organization || record.organizationName || "-"}</span>
              {record.locationDistrict && (
                <>
                  {" "}
                  | জেলা: <span className="font-semibold text-slate-700">{record.locationDistrict}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <Button
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 font-semibold transition-all shadow-md self-start lg:self-center"
        >
          <Download className="w-4 h-4" />
          PDF ডাউনলোড
        </Button>
      </div>

      {/* ── Summary KPIs ─────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          icon={<Users className="w-5 h-5" />}
          label="এস্টিমেটেড কস্ট (XOCE)"
          value={`${fmt(record.estimateCost || 0)} টাকা`}
          color="blue"
        />
        <KPICard
          icon={<Percent className="w-5 h-5" />}
          label="প্রাইস ইনডেক্স (NPPI)"
          value={record.priceIndex != null ? record.priceIndex.toString() : "-"}
          color="amber"
        />
        <KPICard
          icon={<TrendingDown className="w-5 h-5" />}
          label="Weighted Average (WA)"
          value={record.wa != null ? record.wa.toString() : "-"}
          color="blue"
        />
        <KPICard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Significantly Low Price (SLT)"
          value={record.slt != null ? record.slt.toString() : "-"}
          color="emerald"
        />
      </div>

      {/* ── Detailed Metrics ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/80 border-b pb-4">
            <CardTitle className="text-base font-bold text-slate-800">
              গণনার অন্যান্য মানসমূহ (Metrics)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 gap-y-3.5 text-sm">
              <span className="text-slate-500 font-medium">Average of Qualified (Xi):</span>
              <span className="font-semibold text-slate-800 text-right">
                {record.xi != null ? record.xi : "-"}
              </span>
              <span className="text-slate-500 font-medium">Standard Deviation (SD):</span>
              <span className="font-semibold text-slate-800 text-right">
                {record.sd != null ? record.sd : "-"}
              </span>
              <span className="text-slate-500 font-medium">X_NPPI (XOCE × NPPI):</span>
              <span className="font-semibold text-slate-800 text-right">
                {record.estimateCost && record.priceIndex
                  ? fmt(record.estimateCost * record.priceIndex) + " টাকা"
                  : "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Winner Details */}
        <Card className="rounded-2xl border-emerald-200 bg-emerald-50/30 shadow-sm overflow-hidden flex flex-col justify-between">
          <CardHeader className="bg-emerald-50/70 border-b pb-4">
            <CardTitle className="text-base font-bold text-emerald-800 flex items-center gap-1.5">
              <Award className="w-5 h-5" />
              সর্বনিম্ন ও বিজয়ী দরদাতা (Winning Bidder)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
            <div>
              <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">বিজয়ী ঠিকাদারের নাম</p>
              <p className="text-lg font-extrabold text-slate-800 mt-1">{record.winner || "None"}</p>
            </div>
            <div className="flex justify-between items-baseline border-t border-emerald-200/60 pt-3.5">
              <span className="text-sm text-emerald-700 font-bold">বিজয়ী দর:</span>
              <span className="text-2xl font-black text-emerald-800">
                {fmt(record.winnerPrice || 0)} টাকা
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Bidder List ────────────────────────────── */}
      <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden">
        <CardHeader className="border-b pb-4 bg-slate-50/80">
          <CardTitle className="text-base font-bold text-slate-800">
            অংশগ্রহণকারী দরদাতাদের তালিকা (Bidders & Evaluation)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-[80px] font-semibold text-slate-600">সিরিয়াল</TableHead>
                  <TableHead className="font-semibold text-slate-600">দরদাতার নাম</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">দাখিলকৃত দর (Price)</TableHead>
                  <TableHead className="text-center font-semibold text-slate-600">এস্টিমেট থেকে %</TableHead>
                  <TableHead className="text-center font-semibold text-slate-600">কারিগরি যোগ্যতা</TableHead>
                  <TableHead className="text-center font-semibold text-slate-600">আর্থিক যোগ্যতা</TableHead>
                  <TableHead className="text-center font-semibold text-slate-600">র‍্যাংক</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {record.bidders && record.bidders.length > 0 ? (
                  record.bidders.map((bidder, idx) => {
                    const diffCost = (record.estimateCost || 0) - (bidder.price || 0);
                    const diffPct = record.estimateCost ? (diffCost / record.estimateCost) * 100 : 0;
                    return (
                      <TableRow key={idx} className="hover:bg-slate-50/40">
                        <TableCell className="font-medium text-slate-600">{idx + 1}</TableCell>
                        <TableCell className="font-bold text-slate-800">{bidder.name || "-"}</TableCell>
                        <TableCell className="text-right font-extrabold text-slate-700">{fmt(bidder.price || 0)} টাকা</TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center gap-1 font-bold text-sm ${diffPct >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {diffPct >= 0 ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                            {Math.abs(diffPct).toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${bidder.qualified ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                            {bidder.qualified ? "যোগ্য" : "অযোগ্য"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${bidder.isResponsive ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                            {bidder.isResponsive ? "Responsive" : "Non-Responsive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-extrabold text-blue-600">{bidder.rank || "-"}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                      কোনো দরদাতার তথ্য পাওয়া যায়নি
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Local Components ───────────────────────────────────────
function KPICard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  const iconBg: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-500",
  };
  const textColor: Record<string, string> = {
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    red: "text-red-500",
  };
  return (
    <Card className="rounded-2xl border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white">
      <CardContent className="p-5 space-y-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg[color]}`}>
          {icon}
        </div>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className={`text-xl font-bold ${textColor[color]}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
