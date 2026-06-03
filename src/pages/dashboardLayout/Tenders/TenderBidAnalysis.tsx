// @ts-nocheck
import { useMemo, useState, useEffect } from "react";
import config from "@/lib/config";
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
  MapPin,
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

  // ─── Global Stats (from dedicated /stl/stats endpoint) ──────
  const [districtStats, setDistrictStats] = useState([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [globalKPIs, setGlobalKPIs] = useState({ lowest: 0, avg: 0, highest: 0, avgEstimate: 0, minWinnerPrice: 0, totalCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setDistrictsLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/stl/stats`);
        const result = await response.json();

        if (result?.success) {
          setGlobalKPIs(result.data.kpi);
          setDistrictStats(result.data.districts);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setDistrictsLoading(false);
      }
    };
    fetchStats();
  }, []);

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

      {/* ── KPI Cards (from full dataset) ──────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          icon={<Users className="w-5 h-5" />}
          label="মোট টেন্ডার"
          value={fmt(globalKPIs.totalCount || totalCount)}
          sub={hasActiveFilters ? `ফিল্টার করা ${fmt(totalCount)} টি` : "সকল টেন্ডার"}
          color="blue"
        />
        <KPICard
          icon={<TrendingDown className="w-5 h-5" />}
          label="সর্বনিম্ন দর"
          value={`${globalKPIs.lowest}%`}
          sub="এস্টিমেট থেকে সর্বনিম্ন %"
          color="emerald"
        />
        <KPICard
          icon={<Percent className="w-5 h-5" />}
          label="গড় ছাড় %"
          value={`${globalKPIs.avg}%`}
          sub="এস্টিমেট থেকে গড় %"
          color="amber"
        />
        <KPICard
          icon={<Percent className="w-5 h-5" />}
          label="গড় এস্টিমেট"
          value={fmt(globalKPIs.avgEstimate)}
          sub="টাকা"
          color="amber"
        />
        <KPICard
          icon={<Award className="w-5 h-5" />}
          label="সর্বনিম্ন বিজয়ী দর"
          value={fmt(globalKPIs.minWinnerPrice)}
          sub="টাকা"
          color="blue"
        />
        <KPICard
          icon={<TrendingUp className="w-5 h-5" />}
          label="সর্বোচ্চ দর"
          value={`${globalKPIs.highest}%`}
          sub="এস্টিমেট থেকে সর্বোচ্চ %"
          color="red"
        />
      </div>

      {/* ── District Comparison ───────────────────────────── */}
      {districtStats.length > 0 && (
        <Card className="rounded-2xl border-slate-200/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              জেলা অনুযায়ী দরের তুলনা
              <Badge variant="secondary" className="text-xs font-normal">
                মোট {districtStats.length} টি জেলা
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {districtStats.map((d) => {
                  const isHigh = d.avgPct > 15;
                  const isMed = d.avgPct > 5;
                  const barColor = isHigh
                    ? "bg-emerald-500"
                    : isMed
                    ? "bg-amber-500"
                    : "bg-red-500";
                  const bgClass = isHigh
                    ? "bg-emerald-50/80 border-emerald-200/60"
                    : isMed
                    ? "bg-amber-50/80 border-amber-200/60"
                    : "bg-red-50/80 border-red-200/60";
                  const textClass = isHigh
                    ? "text-emerald-700"
                    : isMed
                    ? "text-amber-700"
                    : "text-red-600";
                  return (
                    <div
                      key={d.district}
                      className={`rounded-xl p-4 border transition-all hover:shadow-md hover:-translate-y-0.5 ${bgClass}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm text-slate-800 truncate">
                          {d.district}
                        </span>
                        <span className={`text-lg font-bold ${textClass}`}>
                          {d.avgPct.toFixed(2)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/60 rounded-full h-1.5 mb-2">
                        <div
                          className={`h-1.5 rounded-full ${barColor} transition-all`}
                          style={{ width: `${Math.min(Math.abs(d.avgPct), 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        এস্টিমেট থেকে গড় ছাড় • {d.count} টি টেন্ডার
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {districtsLoading && (
        <div className="flex items-center justify-center py-6 gap-3">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <p className="text-slate-500 text-sm">জেলার ডাটা লোড হচ্ছে...</p>
        </div>
      )}

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
                      <TableHead className="font-semibold text-slate-600">অর্গানাইজেশন</TableHead>
                      <TableHead className="text-right font-semibold text-slate-600">এস্টিমেটেড কস্ট</TableHead>
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
                          <TableCell className="text-sm text-slate-600 max-w-[200px] truncate" title={record.organization}>
                            {record.organization || "-"}
                          </TableCell>
                          <TableCell className="text-right">{fmt(record.estimateCost || 0)}</TableCell>
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