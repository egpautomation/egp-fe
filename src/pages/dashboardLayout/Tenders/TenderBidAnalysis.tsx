// @ts-nocheck
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Users,
  Percent,
  Award,
  AlertTriangle,
  Search,
  Filter,
  RotateCcw,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAllStlData from "@/hooks/useAllStlData";

// ─── Types ───────────────────────────────────────────────────
interface ExtractedBid {
  serialNo: string;
  nameOfTenderer: string;
  quotedAmountWithoutDiscount: number;
  discountPercentage: number;
  discountAmount: number;
  quotedAmountWithDiscount: number;
}

interface TenderData {
  tenderId: string;
  estimateCost: number;
  extractedData: ExtractedBid[];
  district: string;
  department: string;
  workType: string;
}

interface StlRecord {
  _id: string;
  tenderId: string;
  estimateCost: number;
  winner: string;
  winnerPrice: number;
  slt: number;
  priceIndex: number;
  locationDistrict: string;
  organization: string;
}

// ─── Demo Data ───────────────────────────────────────────────
const rawTenderData: TenderData = {
  tenderId: "1244920",
  estimateCost: 514619.47,
  district: "ঢাকা",
  department: "পিডব্লিউডি",
  workType: "রাস্তা নির্মাণ",
  extractedData: [
    { serialNo: "1", nameOfTenderer: "M/S Sadia Enterprise", quotedAmountWithoutDiscount: 452832, discountPercentage: 0.001, discountAmount: 4.528, quotedAmountWithDiscount: 452827.472 },
    { serialNo: "2", nameOfTenderer: "M/S. Excellent Builders", quotedAmountWithoutDiscount: 514619.721, discountPercentage: 11.99, discountAmount: 61702.904, quotedAmountWithDiscount: 452916.817 },
    { serialNo: "3", nameOfTenderer: "M/S Farea Nirmata", quotedAmountWithoutDiscount: 514619.471, discountPercentage: 11.7, discountAmount: 60210.478, quotedAmountWithDiscount: 454408.993 },
    { serialNo: "4", nameOfTenderer: "M/S Jubayer Enterprise", quotedAmountWithoutDiscount: 514619.637, discountPercentage: 11.5, discountAmount: 59181.258, quotedAmountWithDiscount: 455438.379 },
    { serialNo: "5", nameOfTenderer: "M/S. JAFNA ENTERPRISE", quotedAmountWithoutDiscount: 514619.638, discountPercentage: 11.5, discountAmount: 59181.258, quotedAmountWithDiscount: 455438.38 },
    { serialNo: "6", nameOfTenderer: "M/S Khaleque Enterprise", quotedAmountWithoutDiscount: 456982.237, discountPercentage: 0, discountAmount: 0, quotedAmountWithDiscount: 456982.237 },
    { serialNo: "7", nameOfTenderer: "MRIDHA TRADERS", quotedAmountWithoutDiscount: 462510.546, discountPercentage: 0, discountAmount: 0, quotedAmountWithDiscount: 462510.546 },
    { serialNo: "8", nameOfTenderer: "M/S. JAFOR & BROTHERS", quotedAmountWithoutDiscount: 514610.8, discountPercentage: 9.9, discountAmount: 50946.469, quotedAmountWithDiscount: 463664.331 },
    { serialNo: "9", nameOfTenderer: "M/S Rahim Traders", quotedAmountWithoutDiscount: 463671.92, discountPercentage: 0, discountAmount: 0, quotedAmountWithDiscount: 463671.92 },
    { serialNo: "10", nameOfTenderer: "E M", quotedAmountWithoutDiscount: 464265.6, discountPercentage: 0, discountAmount: 0, quotedAmountWithDiscount: 464265.6 },
    { serialNo: "11", nameOfTenderer: "A B C ENTERPRISE", quotedAmountWithoutDiscount: 464442.2, discountPercentage: 0, discountAmount: 0, quotedAmountWithDiscount: 464442.2 },
    { serialNo: "12", nameOfTenderer: "Muhammad Enterprise", quotedAmountWithoutDiscount: 514619.636, discountPercentage: 9.7, discountAmount: 49918.104, quotedAmountWithDiscount: 464701.532 },
    { serialNo: "13", nameOfTenderer: "M/s. ABSE International", quotedAmountWithoutDiscount: 514619.639, discountPercentage: 9.4, discountAmount: 48374.246, quotedAmountWithDiscount: 466245.393 },
    { serialNo: "14", nameOfTenderer: "M/S Akanda Construction", quotedAmountWithoutDiscount: 514533.944, discountPercentage: 9.18, discountAmount: 47234.216, quotedAmountWithDiscount: 467299.728 },
    { serialNo: "15", nameOfTenderer: "M/S Rahima Enterprise", quotedAmountWithoutDiscount: 514618.944, discountPercentage: 8.9, discountAmount: 45801.086, quotedAmountWithDiscount: 468817.858 },
    { serialNo: "16", nameOfTenderer: "Arthi Enterprise", quotedAmountWithoutDiscount: 469075.81, discountPercentage: 0, discountAmount: 0, quotedAmountWithDiscount: 469075.81 },
    { serialNo: "17", nameOfTenderer: "M/S. M. S. Enterprise", quotedAmountWithoutDiscount: 514620.971, discountPercentage: 8.52, discountAmount: 43845.706, quotedAmountWithDiscount: 470775.265 },
    { serialNo: "18", nameOfTenderer: "M/S Amir & Brothers", quotedAmountWithoutDiscount: 470990.4, discountPercentage: 0, discountAmount: 0, quotedAmountWithDiscount: 470990.4 },
    { serialNo: "19", nameOfTenderer: "ADIT S LTD", quotedAmountWithoutDiscount: 514619.638, discountPercentage: 7, discountAmount: 36023.374, quotedAmountWithDiscount: 478596.264 },
    { serialNo: "20", nameOfTenderer: "AZ Engineering", quotedAmountWithoutDiscount: 478995.7, discountPercentage: 0, discountAmount: 0, quotedAmountWithDiscount: 478995.7 },
    { serialNo: "21", nameOfTenderer: "M R TRADERS", quotedAmountWithoutDiscount: 540706.933, discountPercentage: 0, discountAmount: 0, quotedAmountWithDiscount: 540706.933 },
  ],
};

const allTenders: TenderData[] = [
  rawTenderData,
  {
    ...rawTenderData,
    tenderId: "1244921",
    district: "চট্টগ্রাম",
    department: "এলজিইডি",
    workType: "ভবন নির্মাণ",
    estimateCost: 620000,
    extractedData: rawTenderData.extractedData.map((item, i) => ({
      ...item,
      quotedAmountWithDiscount: item.quotedAmountWithDiscount * 1.05 + i * 1000,
    })),
  },
  {
    ...rawTenderData,
    tenderId: "1244922",
    district: "রাজশাহী",
    department: "সড়ক ও জনপথ",
    workType: "সেতু নির্মাণ",
    estimateCost: 480000,
    extractedData: rawTenderData.extractedData.map((item) => ({
      ...item,
      quotedAmountWithDiscount: item.quotedAmountWithDiscount * 0.92,
    })),
  },
];

// ─── Helpers ─────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString("bn-BD");
const pct = (n: number) => n.toFixed(2);

// ─── Component ───────────────────────────────────────────────
const ITEMS_PER_PAGE = 10;

export default function TenderBidAnalysis() {
  const { stlData, loading, setReload } = useAllStlData();
  const [districtFilter, setDistrictFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const allRecords: StlRecord[] = stlData;

  // ─── Dynamic filter options from API data ─────────────────
  const districtOptions = useMemo(() => {
    const set = new Set(allRecords.map((r) => r.locationDistrict).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [allRecords]);

  const orgOptions = useMemo(() => {
    const set = new Set(allRecords.map((r) => r.organization).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [allRecords]);

  // ─── Table search, filter & pagination ─────────────────────
  const filteredRecords = useMemo(() => {
    let result = allRecords;
    if (districtFilter !== "all") {
      result = result.filter((r) => r.locationDistrict === districtFilter);
    }
    if (departmentFilter !== "all") {
      result = result.filter((r) => r.organization === departmentFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.winner?.toLowerCase().includes(q) ||
          r.tenderId?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, allRecords, districtFilter, departmentFilter]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredRecords]);

  // ─── First record for KPI / charts (keep existing UI) ────
  const firstRecord = allRecords.length > 0 ? allRecords[0] : null;
  const data: TenderData = firstRecord
    ? {
        tenderId: firstRecord.tenderId || "0",
        estimateCost: firstRecord.estimateCost || 0,
        district: "ঢাকা",
        department: "পিডব্লিউডি",
        workType: "রাস্তা নির্মাণ",
        extractedData: firstRecord.extractedData || rawTenderData.extractedData,
      }
    : rawTenderData;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 -m-5 p-5 md:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 text-sm">ডাটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const bidders = data.extractedData;
  const estimate = data.estimateCost;

  // ─── KPI Metrics from real filteredRecords ──────────────────
  const totalRecords = filteredRecords.length;
  const winnerPrices = filteredRecords.map((r) => r.winnerPrice || 0).filter((p) => p > 0);
  const estimateCosts = filteredRecords.map((r) => r.estimateCost || 0).filter((p) => p > 0);

  const minWinnerPrice = winnerPrices.length ? Math.min(...winnerPrices) : 0;
  const maxWinnerPrice = winnerPrices.length ? Math.max(...winnerPrices) : 0;
  const avgEstimate = estimateCosts.length ? estimateCosts.reduce((a, b) => a + b, 0) / estimateCosts.length : 0;

  const belowEstimateCount = filteredRecords.filter(
    (r) => r.winnerPrice && r.estimateCost && r.winnerPrice < r.estimateCost
  ).length;
  const belowPct = totalRecords ? ((belowEstimateCount / totalRecords) * 100).toFixed(1) : "0";

  const lowestDiffPct = avgEstimate && minWinnerPrice
    ? (((avgEstimate - minWinnerPrice) / avgEstimate) * 100).toFixed(2)
    : "0";
  const highestDiffPct = avgEstimate && maxWinnerPrice
    ? (((maxWinnerPrice - avgEstimate) / avgEstimate) * 100).toFixed(2)
    : "0";

  const resetFilters = () => {
    setDistrictFilter("all");
    setDepartmentFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 -m-5 p-5 md:p-8 space-y-8">
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">টেন্ডার দর বিশ্লেষণ</h1>
            <p className="text-sm text-slate-500">ঠিকাদারের দর, ছাড় ও পারফরম্যান্স সামারি</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3 bg-white/80 backdrop-blur px-5 py-4 rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500">জেলা</label>
            <Select value={districtFilter} onValueChange={(v) => { setDistrictFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[150px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {districtOptions.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === "all" ? "সব জেলা" : d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500">অর্গানাইজেশন</label>
            <Select value={departmentFilter} onValueChange={(v) => { setDepartmentFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[200px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {orgOptions.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === "all" ? "সব অর্গানাইজেশন" : d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-slate-500 hover:text-slate-700 gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            রিসেট
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          icon={<Users className="w-5 h-5" />}
          label="মোট টেন্ডার"
          value={fmt(totalRecords)}
          sub="ফিল্টার করা"
          color="blue"
        />
        <KPICard
          icon={<TrendingDown className="w-5 h-5" />}
          label="সর্বনিম্ন দর"
          value={`${lowestDiffPct}% কম`}
          sub={fmt(minWinnerPrice) + " টাকা"}
          color="emerald"
        />
        <KPICard
          icon={<Percent className="w-5 h-5" />}
          label="গড় এস্টিমেট"
          value={fmt(Math.round(avgEstimate))}
          sub="টাকা"
          color="amber"
        />
        <KPICard
          icon={<ArrowDown className="w-5 h-5" />}
          label="কম দর দিয়েছে"
          value={`${belowPct}%`}
          sub={`${belowEstimateCount} টি টেন্ডার`}
          color="emerald"
        />
        <KPICard
          icon={<Award className="w-5 h-5" />}
          label="সর্বনিম্ন বিজয়ী দর"
          value={fmt(minWinnerPrice)}
          sub="টাকা"
          color="blue"
        />
        <KPICard
          icon={<TrendingUp className="w-5 h-5" />}
          label="সর্বোচ্চ বেশি দর"
          value={`${highestDiffPct}% বেশি`}
          sub={fmt(maxWinnerPrice) + " টাকা"}
          color="red"
        />
      </div>

      {/* Comparison Cards */}
      {(() => {
        const dists = [...new Set(allRecords.map((r) => r.locationDistrict).filter(Boolean))];
        const colors = ["emerald", "amber", "blue", "red"];
        return dists.length > 0 ? (
          <Card className="rounded-2xl border-slate-200/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                জেলা অনুযায়ী দরের তুলনা
                <Badge variant="secondary" className="text-xs font-normal">
                  মোট {allRecords.length} টি টেন্ডার
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dists.slice(0, 6).map((dist, i) => {
                  const distRecords = allRecords.filter((r) => r.locationDistrict === dist);
                  const avgPct = distRecords.reduce((sum, r) => {
                    const p = r.estimateCost ? ((r.estimateCost - (r.winnerPrice || 0)) / r.estimateCost) * 100 : 0;
                    return sum + p;
                  }, 0) / distRecords.length;
                  return (
                    <ComparisonCard
                      key={dist}
                      district={dist}
                      pct={avgPct.toFixed(2) + "%"}
                      sub={"এস্টিমেট থেকে গড় কম দর (" + distRecords.length + " টি)"}
                      color={colors[i % colors.length]}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : null;
      })()}

      {/* ── Data Table ──────────────────────────────── */}
      <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-lg font-semibold text-slate-800">
            সকল ঠিকাদারের দর তালিকা
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="ঠিকাদারের নাম বা টেন্ডার আইডি খুঁজুন..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 w-72 rounded-xl"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                  <TableHead className="font-semibold text-slate-600">সিরিয়াল</TableHead>
                  <TableHead className="font-semibold text-slate-600">ঠিকাদারের নাম</TableHead>
                  <TableHead className="font-semibold text-slate-600">টেন্ডার আইডি</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">এস্টিমেটেড কস্ট</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">দর (ছাড় ছাড়া)</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">এস্টিমেট থেকে %</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">বিজয়ী দর</TableHead>
                  <TableHead className="text-center font-semibold text-slate-600">যোগ্যতা</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">NPPI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((record, index) => {
                  const serialNo = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                  const diffCost = (record.estimateCost || 0) - (record.winnerPrice || 0);
                  const diffPct = record.estimateCost ? (diffCost / record.estimateCost) * 100 : 0;
                  return (
                    <TableRow key={record._id} className="hover:bg-slate-50/60">
                      <TableCell className="font-medium">{serialNo}</TableCell>
                      <TableCell className="font-medium text-slate-800">{record.winner || "-"}</TableCell>
                      <TableCell>
                        {record.tenderId ? (
                          <Badge variant="outline" className="text-xs">#{record.tenderId}</Badge>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-right">{fmt(record.estimateCost || 0)}</TableCell>
                      <TableCell className="text-right">{fmt(diffCost)}</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center gap-1 font-semibold ${diffPct >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {diffPct >= 0 ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                          {Math.abs(diffPct).toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{fmt(record.winnerPrice || 0)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border border-emerald-200 gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          যোগ্য
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{record.priceIndex != null ? record.priceIndex : "-"}</TableCell>
                    </TableRow>
                  );
                })}
                {paginatedRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-slate-400">
                      কোনো ডাটা পাওয়া যায়নি
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* ── Pagination ────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/60">
              <p className="text-sm text-slate-500">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredRecords.length)} / {filteredRecords.length} টি রেকর্ড
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  আগে
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-9 h-9 p-0"
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="gap-1"
                >
                  পরে
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Sub-Components ──────────────────────────────────────────

function KPICard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "from-blue-500 to-blue-600 shadow-blue-200 text-blue-600",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-200 text-emerald-600",
    amber: "from-amber-500 to-amber-600 shadow-amber-200 text-amber-600",
    red: "from-red-500 to-red-600 shadow-red-200 text-red-500",
  };
  const iconBg: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-500",
  };
  return (
    <Card className="rounded-2xl border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <CardContent className="p-5 space-y-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg[color]}`}>
          {icon}
        </div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className={`text-2xl font-bold ${colorMap[color]?.split(" ").pop()}`}>{value}</p>
        <p className="text-xs text-slate-400">{sub}</p>
      </CardContent>
    </Card>
  );
}


function ComparisonCard({ district, pct, sub, color }: { district: string; pct: string; sub: string; color: string }) {
  const styles: Record<string, string> = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  };
  return (
    <div className={`rounded-2xl p-6 border ${styles[color]}`}>
      <div className="flex justify-between items-center">
        <span className="font-medium">{district} জেলা</span>
        <span className="text-2xl font-bold">{pct}</span>
      </div>
      <p className="text-xs mt-4 opacity-70">{sub} (এই অধিদপ্তরে)</p>
    </div>
  );
}

// ─── District Bar Chart ────────────────────────────────────
function DistrictBarChart({ records }: { records: StlRecord[] }) {
  const districts = [...new Set(records.map((r) => r.locationDistrict).filter(Boolean))];
  const distData = districts.map((d) => {
    const recs = records.filter((r) => r.locationDistrict === d);
    const avgEstimate = recs.reduce((s, r) => s + (r.estimateCost || 0), 0) / recs.length;
    const avgWinner = recs.reduce((s, r) => s + (r.winnerPrice || 0), 0) / recs.length;
    return { district: d, count: recs.length, avgEstimate, avgWinner };
  });
  const maxVal = Math.max(...distData.map((d) => d.avgEstimate), ...distData.map((d) => d.avgWinner), 1);

  return (
    <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2">
      {distData.map((d, i) => {
        const estPct = (d.avgEstimate / maxVal) * 100;
        const winPct = (d.avgWinner / maxVal) * 100;
        return (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 truncate max-w-[60%]" title={d.district}>{d.district} ({d.count} টি)</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-blue-500 w-12 shrink-0">এস্টিমেট</span>
                <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-blue-400 rounded" style={{ width: estPct + "%" }} />
                </div>
                <span className="text-[10px] text-slate-600 w-20 text-right">{fmt(Math.round(d.avgEstimate))}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-600 w-12 shrink-0">বিজয়ী</span>
                <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded" style={{ width: winPct + "%" }} />
                </div>
                <span className="text-[10px] text-slate-600 w-20 text-right">{fmt(Math.round(d.avgWinner))}</span>
              </div>
            </div>
          </div>
        );
      })}
      {distData.length === 0 && <p className="text-center text-slate-400 py-8">কোনো জেলার ডাটা নেই</p>}
    </div>
  );
}

// ─── Record Bar Chart ──────────────────────────────────────
function RecordBarChart({ records }: { records: StlRecord[] }) {
  const maxVal = Math.max(...records.map((r) => r.estimateCost || 0), ...records.map((r) => r.winnerPrice || 0), 1);

  return (
    <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-2">
      {records.map((r, i) => {
        const estPct = ((r.estimateCost || 0) / maxVal) * 100;
        const winPct = ((r.winnerPrice || 0) / maxVal) * 100;
        const isBelow = (r.winnerPrice || 0) < (r.estimateCost || 0);
        return (
          <div key={i} className="flex items-center gap-3 group">
            <div className="w-16 text-xs text-slate-500 truncate shrink-0 text-right" title={r.winner}>
              #{r.tenderId || i + 1}
            </div>
            <div className="flex-1 relative h-6 bg-slate-100 rounded-lg overflow-hidden">
              <div
                className="absolute top-0 h-full w-0.5 bg-blue-500 z-10"
                style={{ left: estPct + "%" }}
              />
              <div
                className={"h-full rounded-lg transition-all duration-500 " + (isBelow ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-amber-400 to-amber-500")}
                style={{ width: winPct + "%" }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-600">
                {fmt(Math.round(r.winnerPrice || 0))}
              </span>
            </div>
          </div>
        );
      })}
      {records.length > 0 && (
        <div className="flex items-center gap-3 pt-1">
          <div className="w-16 shrink-0" />
          <div className="flex-1 flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500" /> এস্টিমেট</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-400" /> কম দর</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-400" /> বেশি দর</span>
          </div>
        </div>
      )}
      {records.length === 0 && <p className="text-center text-slate-400 py-8">কোনো ডাটা নেই</p>}
    </div>
  );
}

