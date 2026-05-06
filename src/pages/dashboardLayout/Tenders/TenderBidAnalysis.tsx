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

const districts = ["all", "ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "সিলেট"];
const departments = ["all", "পিডব্লিউডি", "এলজিইডি", "বিআরটিএ", "সড়ক ও জনপথ"];
const workTypes = ["all", "রাস্তা নির্মাণ", "বিদ্যুৎ সরবরাহ", "ভবন নির্মাণ", "সেতু নির্মাণ", "পানি সরবরাহ"];

// ─── Helpers ─────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString("bn-BD");
const pct = (n: number) => n.toFixed(2);

// ─── Component ───────────────────────────────────────────────
const ITEMS_PER_PAGE = 10;

export default function TenderBidAnalysis() {
  const { stlData, loading, setReload } = useAllStlData();
  const [districtFilter, setDistrictFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [workTypeFilter, setWorkTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const allRecords: StlRecord[] = stlData;

  // ─── Table search & pagination ────────────────────────────
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return allRecords;
    const q = searchQuery.toLowerCase();
    return allRecords.filter(
      (r) =>
        r.winner?.toLowerCase().includes(q) ||
        r.tenderId?.toLowerCase().includes(q)
    );
  }, [searchQuery, allRecords]);

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

  // ─── Metrics ─────────────────────────────────────────────
  const finalPrices = bidders.map((b) => b.quotedAmountWithDiscount);
  const discountPercents = bidders.map((b) => b.discountPercentage);
  const minBid = Math.min(...finalPrices);
  const maxBid = Math.max(...finalPrices);
  const avgDiscount = discountPercents.reduce((a, b) => a + b, 0) / discountPercents.length;
  const belowEstimate = finalPrices.filter((q) => q < estimate).length;
  const lowestPct = ((estimate - minBid) / estimate) * 100;
  const highestPct = ((maxBid - estimate) / estimate) * 100;

  // Discount breakdown
  const zeroDiscount = bidders.filter((b) => b.discountPercentage === 0).length;
  const mediumDiscount = bidders.filter((b) => b.discountPercentage > 0 && b.discountPercentage <= 10).length;
  const highDiscount = bidders.filter((b) => b.discountPercentage > 10).length;

  const resetFilters = () => {
    setDistrictFilter("all");
    setDepartmentFilter("all");
    setWorkTypeFilter("all");
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
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="w-[150px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === "all" ? "সব জেলা" : d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500">অধিদপ্তর</label>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[150px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === "all" ? "সব অধিদপ্তর" : d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500">কাজের ধরন</label>
            <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
              <SelectTrigger className="w-[150px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workTypes.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w === "all" ? "সব ধরন" : w}
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
          label="মোট ঠিকাদার"
          value={fmt(bidders.length)}
          sub="এই টেন্ডারে"
          color="blue"
        />
        <KPICard
          icon={<TrendingDown className="w-5 h-5" />}
          label="সর্বনিম্ন দর"
          value={`${pct(lowestPct)}% কম`}
          sub={fmt(minBid) + " টাকা"}
          color="emerald"
        />
        <KPICard
          icon={<Percent className="w-5 h-5" />}
          label="গড় ছাড় %"
          value={`${pct(avgDiscount)}%`}
          sub="সর্বোচ্চ ছাড়"
          color="amber"
        />
        <KPICard
          icon={<ArrowDown className="w-5 h-5" />}
          label="কম দর দিয়েছে"
          value={`${((belowEstimate / bidders.length) * 100).toFixed(1)}%`}
          sub="ঠিকাদার"
          color="emerald"
        />
        <KPICard
          icon={<Award className="w-5 h-5" />}
          label="সর্বনিম্ন দরের শতাংশ"
          value={`${((finalPrices.filter((q) => q <= minBid * 1.01).length / bidders.length) * 100).toFixed(1)}%`}
          sub="ঠিকাদার কম দর দিয়েছে"
          color="blue"
        />
        <KPICard
          icon={<TrendingUp className="w-5 h-5" />}
          label="সর্বোচ্চ বেশি দর"
          value={`${pct(highestPct)}% বেশি`}
          sub="সর্বোচ্চ দর"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Discount Doughnut (CSS) ──────────────── */}
        <Card className="lg:col-span-5 rounded-2xl border-slate-200/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800">
              ডিসকাউন্ট শতাংশ ব্রেকডাউন
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 pt-0">
            <DonutChart zero={zeroDiscount} medium={mediumDiscount} high={highDiscount} total={bidders.length} />
            <div className="grid grid-cols-3 gap-4 w-full text-center">
              <StatBlock value={`${((zeroDiscount / bidders.length) * 100).toFixed(0)}%`} label="০% ছাড়" color="slate" />
              <StatBlock value={`${((mediumDiscount / bidders.length) * 100).toFixed(0)}%`} label="১-১০% ছাড়" color="amber" />
              <StatBlock value={`${((highDiscount / bidders.length) * 100).toFixed(0)}%`} label="১০%+ ছাড়" color="emerald" />
            </div>
          </CardContent>
        </Card>

        {/* ── Bid Distribution Bar (CSS) ───────────── */}
        <Card className="lg:col-span-7 rounded-2xl border-slate-200/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              দরের বিতরণ
              <Badge variant="secondary" className="text-xs font-normal">
                টেন্ডার #{data.tenderId}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <BidBarChart bidders={bidders} estimate={estimate} />
          </CardContent>
        </Card>
      </div>

      {/* ── Comparison Cards ───────────────────────────── */}
      <Card className="rounded-2xl border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            জেলা ও অধিদপ্তর অনুযায়ী দরের তুলনা
            <Badge variant="secondary" className="text-xs font-normal">
              টেন্ডার #{data.tenderId}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ComparisonCard district="ঢাকা" pct="১২.০২%" sub="এস্টিমেট থেকে গড় কম দর" color="emerald" />
            <ComparisonCard district="চট্টগ্রাম" pct="৮.৭৫%" sub="এস্টিমেট থেকে গড় কম দর" color="amber" />
            <ComparisonCard district="রাজশাহী" pct="১৫.৩০%" sub="এস্টিমেট থেকে গড় কম দর" color="blue" />
          </div>
        </CardContent>
      </Card>

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

function StatBlock({ value, label, color }: { value: string; label: string; color: string }) {
  const colors: Record<string, string> = {
    slate: "text-slate-700",
    amber: "text-amber-600",
    emerald: "text-emerald-600",
  };
  return (
    <div>
      <div className={`text-3xl font-bold ${colors[color]}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
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

// ─── CSS-only Donut Chart ────────────────────────────────────
function DonutChart({ zero, medium, high, total }: { zero: number; medium: number; high: number; total: number }) {
  const zeroPct = (zero / total) * 100;
  const mediumPct = (medium / total) * 100;
  const highPct = (high / total) * 100;

  return (
    <div className="relative w-56 h-56">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="18" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke="#64748b" strokeWidth="18"
          strokeDasharray={`${zeroPct * 2.513} ${251.3 - zeroPct * 2.513}`}
          strokeDashoffset="0"
          className="transition-all duration-700"
        />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke="#f59e0b" strokeWidth="18"
          strokeDasharray={`${mediumPct * 2.513} ${251.3 - mediumPct * 2.513}`}
          strokeDashoffset={`${-zeroPct * 2.513}`}
          className="transition-all duration-700"
        />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke="#10b981" strokeWidth="18"
          strokeDasharray={`${highPct * 2.513} ${251.3 - highPct * 2.513}`}
          strokeDashoffset={`${-(zeroPct + mediumPct) * 2.513}`}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-800">{total}</span>
        <span className="text-xs text-slate-500">ঠিকাদার</span>
      </div>
    </div>
  );
}

// ─── CSS-only Bar Chart ──────────────────────────────────────
function BidBarChart({ bidders, estimate }: { bidders: ExtractedBid[]; estimate: number }) {
  const prices = bidders.map((b) => b.quotedAmountWithDiscount);
  const maxPrice = Math.max(...prices, estimate);
  const barMax = maxPrice * 1.08;

  return (
    <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-2">
      {bidders.map((b, i) => {
        const widthPct = (b.quotedAmountWithDiscount / barMax) * 100;
        const estimatePct = (estimate / barMax) * 100;
        const isBelow = b.quotedAmountWithDiscount < estimate;
        return (
          <div key={i} className="flex items-center gap-3 group">
            <div className="w-20 text-xs text-slate-500 truncate shrink-0 text-right" title={b.nameOfTenderer}>
              দর {i + 1}
            </div>
            <div className="flex-1 relative h-6 bg-slate-100 rounded-lg overflow-hidden">
              <div
                className={`h-full rounded-lg transition-all duration-500 ${isBelow ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-amber-400 to-amber-500"}`}
                style={{ width: `${widthPct}%` }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-blue-500 z-10"
                style={{ left: `${estimatePct}%` }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-600">
                {fmt(Math.round(b.quotedAmountWithDiscount))}
              </span>
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-3 pt-1">
        <div className="w-20 shrink-0" />
        <div className="flex-1 relative h-4">
          <div
            className="absolute top-0 h-3 w-0.5 bg-blue-500"
            style={{ left: `${(estimate / barMax) * 100}%` }}
          />
          <span className="text-[10px] text-blue-600 font-medium" style={{ paddingLeft: `${Math.max(0, (estimate / barMax) * 100 - 10)}%` }}>
            এস্টিমেট: {fmt(Math.round(estimate))}
          </span>
        </div>
      </div>
    </div>
  );
}
