// @ts-nocheck
import { useMemo } from "react";
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
  Search,
  RotateCcw,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAllStlData from "@/hooks/useAllStlData";

// ─── Types ───────────────────────────────────────────────────
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

// ─── Helpers ─────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString("bn-BD");

// ─── Component ───────────────────────────────────────────────

export default function TenderBidAnalysis() {
  const {
    stlData,
    totalCount,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    districtFilter,
    setDistrictFilter,
    departmentFilter,
    setDepartmentFilter,
    searchQuery,
    setSearchQuery,
    districtOptions,
    orgOptions,
  } = useAllStlData();

  const records: StlRecord[] = stlData;

  // ─── KPI Metrics from current page data ──────────────────
  const winnerPrices = records.map((r) => r.winnerPrice || 0).filter((p) => p > 0);
  const estimateCosts = records.map((r) => r.estimateCost || 0).filter((p) => p > 0);

  const minWinnerPrice = winnerPrices.length ? Math.min(...winnerPrices) : 0;
  const maxWinnerPrice = winnerPrices.length ? Math.max(...winnerPrices) : 0;
  const avgEstimate = estimateCosts.length ? estimateCosts.reduce((a, b) => a + b, 0) / estimateCosts.length : 0;

  const belowEstimateCount = records.filter(
    (r) => r.winnerPrice && r.estimateCost && r.winnerPrice < r.estimateCost
  ).length;
  const belowPct = records.length ? ((belowEstimateCount / records.length) * 100).toFixed(1) : "0";

  const avgDiffPct = records.length
    ? (records.reduce((sum, r) => {
        const diffCost = (r.estimateCost || 0) - (r.winnerPrice || 0);
        const pct = r.estimateCost ? (diffCost / r.estimateCost) * 100 : 0;
        return sum + pct;
      }, 0) / records.length).toFixed(2)
    : "0";
  const highestDiffPct = avgEstimate && maxWinnerPrice
    ? (((maxWinnerPrice - avgEstimate) / avgEstimate) * 100).toFixed(2)
    : "0";

  const resetFilters = () => {
    setDistrictFilter("all");
    setDepartmentFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters = districtFilter !== "all" || departmentFilter !== "all" || searchQuery.trim();

  // Page numbers to show (max 5 centered around current)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

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
                <SelectItem value="all">সব জেলা</SelectItem>
                {districtOptions.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500">অর্গানাইজেশন</label>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[200px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব অর্গানাইজেশন</SelectItem>
                {orgOptions.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
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
          value={fmt(totalCount)}
          sub={hasActiveFilters ? `ফিল্টার করা ${fmt(totalCount)} টি` : "সকল টেন্ডার"}
          color="blue"
        />
        <KPICard
          icon={<TrendingDown className="w-5 h-5" />}
          label="গড় ছাড় %"
          value={`${avgDiffPct}%`}
          sub="এস্টিমেট থেকে গড়"
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
        const dists = [...new Set(records.map((r) => r.locationDistrict).filter(Boolean))];
        const colors = ["emerald", "amber", "blue", "red"];
        return dists.length > 0 ? (
          <Card className="rounded-2xl border-slate-200/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                জেলা অনুযায়ী দরের তুলনা
                <Badge variant="secondary" className="text-xs font-normal">
                  মোট {records.length} টি টেন্ডার
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dists.slice(0, 6).map((dist, i) => {
                  const distRecords = records.filter((r) => r.locationDistrict === dist);
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
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            সকল ঠিকাদারের দর তালিকা
            {!loading && (
              <Badge variant="secondary" className="text-xs font-normal">
                মোট {fmt(totalCount)} টি
              </Badge>
            )}
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="ঠিকাদারের নাম বা টেন্ডার আইডি খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-72 rounded-xl"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-slate-500 text-sm">ডাটা লোড হচ্ছে...</p>
            </div>
          ) : (
            <>
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
                    {records.map((record, index) => {
                      const serialNo = (currentPage - 1) * 20 + index + 1;
                      const diffCost = (record.estimateCost || 0) - (record.winnerPrice || 0);
                      const diffPct = record.estimateCost ? (diffCost / record.estimateCost) * 100 : 0;
                      return (
                        <TableRow key={record._id} className="hover:bg-slate-50/60">
                          <TableCell className="font-medium">{serialNo}</TableCell>
                          <TableCell className="font-medium text-slate-800 max-w-[200px] truncate" title={record.winner}>
                            {record.winner || "-"}
                          </TableCell>
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
                    {records.length === 0 && (
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
                    {(currentPage - 1) * 20 + 1}–{Math.min(currentPage * 20, totalCount)} / {fmt(totalCount)} টি রেকর্ড
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      আগে
                    </Button>
                    {pageNumbers.map((page) => (
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
                    {currentPage < totalPages - 2 && totalPages > 5 && (
                      <span className="text-slate-400 px-1">...</span>
                    )}
                    {totalPages > 5 && !pageNumbers.includes(totalPages) && (
                      <Button
                        variant={totalPages === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-9 h-9 p-0"
                      >
                        {totalPages}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="gap-1"
                    >
                      পরে
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Sub-Components ──────────────────────────────────────────

function KPICard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
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
    <Card className="rounded-2xl border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <CardContent className="p-5 space-y-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg[color]}`}>
          {icon}
        </div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className={`text-2xl font-bold ${textColor[color]}`}>{value}</p>
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
    red: "bg-red-50 border-red-200 text-red-700",
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