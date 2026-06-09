// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  Users,
  Percent,
  Award,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Download,
  Save,
  Edit3,
  Search,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import axiosInstance from "@/lib/axiosInstance";
import config from "@/lib/config";
import { motion } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Bidder {
  name: string;
  price: number;
  finalPrice?: number;
  quotedAmount?: number;
  qualified: boolean;
  isResponsive?: boolean;
  rank?: number | string;
}

interface StlRecord {
  _id: string;
  pdfFilename?: string;
  tenderId?: string;
  organizationName?: string;
  estimateCost?: number;
  xoce?: number;
  priceIndex?: number;
  xi?: number;
  wa?: number;
  sd?: number;
  slt?: number;
  winner?: string;
  winnerPrice?: number;
  bidders?: Bidder[];
  extractedData?: any[];
  uploadedAt?: string;
  uploadedBy?: number;
}

interface EditState {
  estimateCost: string;
  priceIndex: string;
  organizationName: string;
  bidders: Bidder[];
}

// ─── STL Recalculation Logic ─────────────────────────────────────────────────
function recalculate(xoce: number, priceIndex: number, bidders: Bidder[]) {
  const xNppi = xoce * priceIndex;

  const qualifiedPrices = bidders
    .filter((b) => b.qualified)
    .map((b) => Number(b.price))
    .filter((p) => !isNaN(p) && p > 0);

  if (qualifiedPrices.length === 0) {
    return { xi: 0, wa: 0, sd: 0, slt: 0, winner: "None", winnerPrice: 0, evaluatedBidders: bidders.map(b => ({ ...b, isResponsive: false, rank: "-" })) };
  }

  const n = qualifiedPrices.length;
  const xi = qualifiedPrices.reduce((s, p) => s + p, 0) / n;
  const wa = xoce * 0.2 + xi * 0.5 + xNppi * 0.3;
  const variance = qualifiedPrices.reduce((s, p) => s + Math.pow(p - wa, 2), 0) / n;
  const sd = Math.sqrt(variance);
  const slt = wa - sd;

  // Evaluate each bidder
  const evaluated = bidders.map((b) => {
    const price = Number(b.price);
    const isAbove110 = price > xoce * 1.1;
    const isResponsive = b.qualified && price >= slt && !isAbove110;
    return { ...b, isAbove110, isResponsive, rank: "-" };
  });

  // Assign ranks to responsive bidders sorted by price ASC
  const responsiveIdxs = evaluated
    .map((b, i) => ({ b, i }))
    .filter((x) => x.b.isResponsive)
    .sort((a, b) => Number(a.b.price) - Number(b.b.price));

  responsiveIdxs.forEach((x, rankIdx) => {
    evaluated[x.i].rank = rankIdx + 1;
  });

  const winner = responsiveIdxs.length > 0 ? responsiveIdxs[0].b.name : "None";
  const winnerPrice = responsiveIdxs.length > 0 ? responsiveIdxs[0].b.price : 0;

  return {
    xi: parseFloat(xi.toFixed(4)),
    wa: parseFloat(wa.toFixed(4)),
    sd: parseFloat(sd.toFixed(4)),
    slt: parseFloat(slt.toFixed(4)),
    winner,
    winnerPrice: parseFloat(String(winnerPrice)),
    evaluatedBidders: evaluated,
  };
}

const fmt = (n: number) =>
  typeof n === "number" ? n.toLocaleString("en-US") : "-";

// ─── Main Component ──────────────────────────────────────────────────────────
export default function MyStlCalculationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [record, setRecord] = useState<StlRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Edit state — controls all editable fields
  const [editState, setEditState] = useState<EditState>({
    estimateCost: "",
    priceIndex: "",
    organizationName: "",
    bidders: [],
  });

  // Live-calculated metrics derived from editState
  const [calc, setCalc] = useState({
    xi: 0, wa: 0, sd: 0, slt: 0,
    winner: "None", winnerPrice: 0,
    evaluatedBidders: [] as Bidder[],
  });

  // ── Fetch record on mount ────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const fetchRecord = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/stl/${id}`);
        if (res.data?.success && res.data?.data) {
          const data: StlRecord = res.data.data;
          setRecord(data);

          // Normalise bidder list: prefer bidders[], else extractedData[]
          const normalisedBidders: Bidder[] =
            data.bidders && data.bidders.length > 0
              ? data.bidders.map((b) => ({
                  name: b.name || "",
                  price: Number(b.price ?? b.finalPrice ?? b.quotedAmount ?? 0),
                  qualified: b.qualified !== false,
                  isResponsive: b.isResponsive,
                  rank: b.rank,
                }))
              : (data.extractedData || []).map((item) => ({
                  name: item.nameOfTenderer || item.name || "",
                  price: Number(
                    item.quotedAmountWithDiscount ??
                      item.quotedAmountWithoutDiscount ??
                      item.price ??
                      0
                  ),
                  qualified: true,
                  isResponsive: true,
                  rank: "-",
                }));

          setEditState({
            estimateCost: String(data.xoce ?? data.estimateCost ?? ""),
            priceIndex: String(data.priceIndex ?? ""),
            organizationName: data.organizationName ?? "",
            bidders: normalisedBidders,
          });
        } else {
          toast.error("Failed to load calculation details.");
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load calculation.");
        console.error("[MyStlCalculationDetail] fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  // ── Live recalculate whenever editState changes ──────────
  useEffect(() => {
    const xoce = parseFloat(editState.estimateCost) || 0;
    const pi = parseFloat(editState.priceIndex) || 0;
    if (xoce > 0 && pi > 0 && editState.bidders.length > 0) {
      const result = recalculate(xoce, pi, editState.bidders);
      setCalc(result);
    }
  }, [editState]);

  // ── Field change helpers ─────────────────────────────────
  const handleFieldChange = (field: keyof Omit<EditState, "bidders">, value: string) => {
    setEditState((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleBidderPriceChange = (idx: number, value: string) => {
    setEditState((prev) => {
      const bidders = [...prev.bidders];
      bidders[idx] = { ...bidders[idx], price: parseFloat(value) || 0 };
      return { ...prev, bidders };
    });
    setIsDirty(true);
  };

  const handleBidderQualifiedToggle = (idx: number, checked: boolean) => {
    setEditState((prev) => {
      const bidders = [...prev.bidders];
      bidders[idx] = { ...bidders[idx], qualified: checked };
      return { ...prev, bidders };
    });
    setIsDirty(true);
  };

  const handleBidderNameChange = (idx: number, value: string) => {
    setEditState((prev) => {
      const bidders = [...prev.bidders];
      bidders[idx] = { ...bidders[idx], name: value };
      return { ...prev, bidders };
    });
    setIsDirty(true);
  };

  // ── Save to backend ──────────────────────────────────────
  const handleSave = async () => {
    if (!id || !isDirty) return;
    setSaving(true);
    try {
      const xoce = parseFloat(editState.estimateCost) || 0;
      const pi = parseFloat(editState.priceIndex) || 0;

      const payload = {
        estimateCost: xoce,
        xoce,
        priceIndex: pi,
        organizationName: editState.organizationName,
        bidders: calc.evaluatedBidders.map((b) => ({
          name: b.name,
          price: Number(b.price),
          qualified: b.qualified,
          isResponsive: b.isResponsive,
          rank: b.rank,
        })),
        xi: calc.xi,
        wa: calc.wa,
        sd: calc.sd,
        slt: calc.slt,
        winner: calc.winner,
        winnerPrice: calc.winnerPrice,
      };

      const res = await axiosInstance.patch(`/stl/${id}`, payload);
      if (res.data?.success) {
        toast.success("Calculation updated successfully!");
        setIsDirty(false);
        // Refresh record state
        setRecord((prev) => prev ? { ...prev, ...payload } : prev);
      } else {
        toast.error(res.data?.message || "Failed to save changes.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to save changes.";
      toast.error(msg);
      console.error("[MyStlCalculationDetail] save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // ── PDF Export ───────────────────────────────────────────
  const handleDownloadPdf = () => {
    if (!record) return;
    try {
      const doc = new jsPDF();
      const pw = doc.internal.pageSize.getWidth();
      const ph = doc.internal.pageSize.getHeight();

      // Header bar
      doc.setFillColor(30, 87, 179);
      doc.rect(0, 0, pw, 22, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("eTenderBD - STL Calculation Report", pw / 2, 14, { align: "center" });

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Tender ID: ${record.tenderId || "N/A"} | Generated: ${new Date().toLocaleString()}`,
        pw / 2, 30, { align: "center" }
      );
      doc.setLineWidth(0.4);
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 34, pw - 14, 34);

      // Input Parameters
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Input Parameters", 14, 42);
      autoTable(doc, {
        startY: 46,
        head: [["Parameter", "Value"]],
        body: [
          ["Tender ID", record.tenderId || "N/A"],
          ["Organization", editState.organizationName || "N/A"],
          ["XOCE (Estimate Cost)", `${fmt(parseFloat(editState.estimateCost))} TK`],
          ["Price Index (NPPI)", editState.priceIndex || "N/A"],
        ],
        theme: "grid",
        headStyles: { fillColor: [30, 87, 179], fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 14, right: 14, bottom: 20 },
      });

      // Calculation Results
      const resY = (doc as any).lastAutoTable.finalY + 8;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Calculation Results", 14, resY);
      autoTable(doc, {
        startY: resY + 4,
        head: [["Metric", "Value"]],
        body: [
          ["Average of Qualified (Xi)", String(calc.xi)],
          ["Weighted Average (WA)", String(calc.wa)],
          ["Standard Deviation (SD)", String(calc.sd)],
          ["Significantly Low Price (SLT)", String(calc.slt)],
          ["X_NPPI", String(parseFloat(editState.estimateCost) * parseFloat(editState.priceIndex) || 0)],
        ],
        theme: "grid",
        headStyles: { fillColor: [30, 87, 179], fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 14, right: 14, bottom: 20 },
      });

      // Bidders
      let bY = (doc as any).lastAutoTable.finalY + 8;
      if (bY > ph - 60) { doc.addPage(); bY = 20; }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Bidders & Evaluation", 14, bY);

      const xoce = parseFloat(editState.estimateCost) || 0;
      const bidderRows = calc.evaluatedBidders.map((b, i) => {
        const diff = xoce > 0 ? (((xoce - Number(b.price)) / xoce) * 100).toFixed(2) : "-";
        return [
          String(i + 1),
          b.name || "-",
          `${fmt(Number(b.price))} TK`,
          `${Number(diff) >= 0 ? "-" : "+"}${Math.abs(Number(diff))}%`,
          b.qualified ? "Qualified" : "Unqualified",
          b.isResponsive ? "Responsive" : "Non-Responsive",
          b.rank?.toString() || "-",
        ];
      });

      autoTable(doc, {
        startY: bY + 4,
        head: [["SL", "Bidder Name", "Price", "Delta %", "Technical", "Financial", "Rank"]],
        body: bidderRows,
        theme: "grid",
        headStyles: { fillColor: [30, 87, 179], fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 14, right: 14, bottom: 20 },
        columnStyles: { 1: { cellWidth: 48 } },
      });

      // Winner box
      let wY = (doc as any).lastAutoTable.finalY + 8;
      if (wY > ph - 45) { doc.addPage(); wY = 20; }
      doc.setFillColor(240, 249, 235);
      doc.roundedRect(14, wY, pw - 28, 24, 3, 3, "F");
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(22, 101, 52);
      doc.text("Winning Bidder:", pw / 2, wY + 9, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        calc.winner && calc.winner !== "None"
          ? `${calc.winner}  —  Price: ${fmt(calc.winnerPrice)} TK`
          : "No responsive bidder found",
        pw / 2, wY + 18, { align: "center" }
      );
      doc.setTextColor(0, 0, 0);

      // Footer on all pages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(14, ph - 16, pw - 14, ph - 16);
        doc.setFontSize(7.5);
        doc.setTextColor(140, 140, 140);
        doc.text("eTenderBD.com | support@etenderbd.com | 01926-959331", pw / 2, ph - 10, { align: "center" });
        doc.text(`Page ${i} of ${pageCount}`, pw - 14, ph - 10, { align: "right" });
      }

      doc.save(`STL_Report_${record.tenderId || id}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("Could not generate PDF.");
    }
  };

  // ── Loading / Error States ───────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading calculation details...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-red-500 font-semibold text-lg">Calculation not found</p>
        <Button onClick={() => navigate("/dashboard/my-stl-calculations")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to My Calculations
        </Button>
      </div>
    );
  }

  const xoce = parseFloat(editState.estimateCost) || 0;
  const pi = parseFloat(editState.priceIndex) || 0;
  const xNppi = xoce * pi;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 -m-5 p-5 md:p-8 space-y-6">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard/my-stl-calculations")}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 border-slate-200 shadow-sm flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              STL Calculation Detail
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {record.tenderId && (
                <>Tender ID: <span className="font-semibold text-slate-700">#{record.tenderId}</span>{" "}</>
              )}
              {editState.organizationName && (
                <>| Org: <span className="font-semibold text-slate-700">{editState.organizationName}</span>{" "}</>
              )}
              {record.uploadedAt && (
                <>| Uploaded: <span className="font-semibold text-slate-700">{format(new Date(record.uploadedAt), "MMM dd, yyyy HH:mm")}</span></>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {isDirty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Unsaved changes
            </motion.div>
          )}
          <Button
            variant="outline"
            onClick={handleDownloadPdf}
            className="gap-2 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard icon={<Users className="w-5 h-5" />} label="XOCE (Estimate Cost)" value={`${fmt(xoce)} TK`} color="blue" />
        <KPICard icon={<Percent className="w-5 h-5" />} label="Price Index (NPPI)" value={pi > 0 ? String(pi) : "—"} color="amber" />
        <KPICard icon={<TrendingDown className="w-5 h-5" />} label="SLT (Sig. Low Price)" value={calc.slt > 0 ? String(calc.slt) : "—"} color="emerald" />
        <KPICard icon={<Award className="w-5 h-5" />} label="Winner" value={calc.winner !== "None" && calc.winner ? calc.winner.split(" ").slice(0, 2).join(" ") + "..." : "No Winner"} color={calc.winner && calc.winner !== "None" ? "emerald" : "red"} />
      </div>

      {/* ── Edit: Input Parameters + Calculation Results ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Input Parameters — Editable */}
        <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/80 border-b py-4 px-5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-blue-500" />
              Input Parameters
              <span className="text-xs font-normal text-slate-400 ml-1">(editable)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tender ID</Label>
                <Input
                  value={record.tenderId || ""}
                  readOnly
                  className="rounded-xl border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Organization</Label>
                <Input
                  value={editState.organizationName}
                  onChange={(e) => handleFieldChange("organizationName", e.target.value)}
                  placeholder="Organization name"
                  className="rounded-xl border-slate-200 focus:border-blue-400 focus:ring-blue-400 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">XOCE / Estimate Cost (TK)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editState.estimateCost}
                  onChange={(e) => handleFieldChange("estimateCost", e.target.value)}
                  placeholder="e.g. 19999999.50"
                  className="rounded-xl border-slate-200 focus:border-blue-400 focus:ring-blue-400 text-sm font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price Index (NPPI)</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={editState.priceIndex}
                  onChange={(e) => handleFieldChange("priceIndex", e.target.value)}
                  placeholder="e.g. 0.9168"
                  className="rounded-xl border-slate-200 focus:border-blue-400 focus:ring-blue-400 text-sm font-medium"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calculation Results — Live */}
        <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/80 border-b py-4 px-5">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Calculation Results
              <span className="text-xs font-normal text-slate-400 ml-1">(live)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              {[
                { label: "Average of Qualified (Xi)", value: calc.xi },
                { label: "Weighted Average (WA)", value: calc.wa },
                { label: "Standard Deviation (SD)", value: calc.sd },
                { label: "X_NPPI (XOCE × NPPI)", value: parseFloat(xNppi.toFixed(4)) },
                { label: "Significantly Low Price (SLT)", value: calc.slt, highlight: true },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="contents">
                  <span className="text-slate-500 font-medium self-center">{label}:</span>
                  <span className={`font-bold text-right self-center ${highlight ? "text-blue-600 text-base" : "text-slate-800"}`}>
                    {value > 0 ? value : "—"}
                  </span>
                </div>
              ))}
            </div>

            {/* Winner Banner */}
            <div className={`mt-5 p-4 rounded-xl border ${calc.winner && calc.winner !== "None" ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${calc.winner && calc.winner !== "None" ? "text-emerald-600" : "text-slate-400"}`}>
                Winning Bidder
              </p>
              <p className="font-extrabold text-slate-800 text-sm leading-snug">
                {calc.winner && calc.winner !== "None" ? calc.winner : "No responsive bidder"}
              </p>
              {calc.winner && calc.winner !== "None" && (
                <p className="text-emerald-700 font-bold text-base mt-1">
                  {fmt(calc.winnerPrice)} TK
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Bidders Table — Editable ─────────────────────────────── */}
      <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden">
        <CardHeader className="border-b py-4 px-5 bg-slate-50/80">
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            Bidders & Evaluation
            <span className="text-xs font-normal text-slate-400 ml-1">— toggle qualified / edit price to recalculate live</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead className="font-semibold text-slate-600 w-10">SL</TableHead>
                  <TableHead className="font-semibold text-slate-600 min-w-[200px]">Bidder Name</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-right min-w-[160px]">Quoted Price (TK)</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-center w-28">Delta vs XOCE</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-center w-28">Technical</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-center w-36">Financial Resp.</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-center w-16">Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calc.evaluatedBidders.length > 0 ? (
                  calc.evaluatedBidders.map((bidder, idx) => {
                    const price = Number(bidder.price);
                    const diffPct = xoce > 0 ? ((xoce - price) / xoce) * 100 : 0;
                    const isWinner = bidder.rank === 1;

                    return (
                      <TableRow
                        key={idx}
                        className={`border-b border-slate-100 transition-colors ${isWinner ? "bg-emerald-50/40" : "hover:bg-slate-50/60"}`}
                      >
                        <TableCell className="text-slate-500 font-medium text-center">{idx + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              value={bidder.name}
                              onChange={(e) => handleBidderNameChange(idx, e.target.value)}
                              className="h-8 rounded-lg border-slate-200 focus:border-blue-400 text-sm font-medium text-slate-800 min-w-[150px]"
                            />
                            {isWinner && (
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs px-2 py-0.5 font-bold whitespace-nowrap">
                                🏆 Winner
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={editState.bidders[idx]?.price ?? price}
                            onChange={(e) => handleBidderPriceChange(idx, e.target.value)}
                            className="h-8 rounded-lg border-slate-200 focus:border-blue-400 text-sm font-bold text-slate-800 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center gap-1 font-bold text-sm ${diffPct >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {diffPct >= 0 ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                            {Math.abs(diffPct).toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Checkbox
                              checked={editState.bidders[idx]?.qualified ?? bidder.qualified}
                              onCheckedChange={(checked) => handleBidderQualifiedToggle(idx, !!checked)}
                              className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 w-5 h-5"
                            />
                            <span className={`text-xs font-semibold ${(editState.bidders[idx]?.qualified ?? bidder.qualified) ? "text-emerald-600" : "text-red-500"}`}>
                              {(editState.bidders[idx]?.qualified ?? bidder.qualified) ? "Qualified" : "Unqualified"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              !bidder.qualified
                                ? "bg-slate-100 text-slate-500 border-slate-200"
                                : (bidder as any).isAbove110
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : bidder.isResponsive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-red-50 text-red-600 border-red-200"
                            }
                          >
                            {!bidder.qualified
                              ? "Non-Responsive"
                              : (bidder as any).isAbove110
                              ? "> 110% XOCE"
                              : bidder.isResponsive
                              ? "Responsive"
                              : "Low Price"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-extrabold text-blue-600 text-base">
                          {bidder.isResponsive && bidder.rank != null ? bidder.rank : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                      No bidder data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Bottom Save Bar (sticky UX) ──────────────────────────── */}
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-slate-200 shadow-xl rounded-2xl px-5 py-3"
        >
          <span className="text-sm text-slate-600 font-medium">You have unsaved changes</span>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 px-4 shadow-md shadow-blue-100"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Now"}
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// ─── KPI Card Component ──────────────────────────────────────────────────────
function KPICard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "emerald" | "amber" | "red";
}) {
  const styles = {
    blue: { icon: "bg-blue-50 text-blue-600", value: "text-blue-700", border: "border-t-blue-500" },
    emerald: { icon: "bg-emerald-50 text-emerald-600", value: "text-emerald-700", border: "border-t-emerald-500" },
    amber: { icon: "bg-amber-50 text-amber-600", value: "text-amber-700", border: "border-t-amber-500" },
    red: { icon: "bg-red-50 text-red-500", value: "text-red-500", border: "border-t-red-400" },
  };
  const s = styles[color];
  return (
    <Card className={`rounded-2xl border-slate-200/60 shadow-sm border-t-4 ${s.border} bg-white hover:shadow-md transition-shadow`}>
      <CardContent className="p-5 flex items-center justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
          <p className={`text-base font-extrabold truncate ${s.value}`}>{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
