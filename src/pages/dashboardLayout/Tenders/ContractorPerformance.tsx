// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import config from "@/lib/config";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Search,
  Eye,
  Loader2,
  Users,
  Percent,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { toast } from "react-hot-toast";

// ─── Helpers ─────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString("bn-BD");

export default function ContractorPerformance() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryName = searchParams.get("name") || "";

  const [contractorName, setContractorName] = useState(queryName);
  const [perfData, setPerfData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (queryName.trim()) {
      setContractorName(queryName);
      fetchPerformance(queryName);
    } else {
      setPerfData(null);
      setHasSearched(false);
    }
  }, [queryName]);

  const fetchPerformance = async (name: string) => {
    setLoading(true);
    setPerfData(null);
    setHasSearched(true);
    try {
      const response = await axiosInstance.get(
        `${config.apiBaseUrl}/stl/contractor-performance?contractorName=${encodeURIComponent(name)}`
      );
      if (response.data?.success) {
        setPerfData(response.data.data);
      } else {
        toast.error(response.data?.message || "ডাটা লোড করতে ব্যর্থ হয়েছে");
      }
    } catch (error) {
      console.error("Error fetching contractor performance:", error);
      toast.error("পারফরম্যান্স ডাটা লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractorName.trim()) {
      toast.error("অনুগ্রহ করে ঠিকাদারের নাম লিখুন");
      return;
    }
    setSearchParams({ name: contractorName.trim() });
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
            <h1 className="text-2xl font-bold text-slate-800">ঠিকাদার পারফরম্যান্স বিশ্লেষণ</h1>
            <p className="text-sm text-slate-500 mt-1">
              ডাটাবেসে থাকা সকল টেন্ডার ওপেনিং রিপোর্ট থেকে ঠিকাদারের পূর্ববর্তী দর এবং জয়ের পরিসংখ্যান
            </p>
          </div>
        </div>
      </div>

      {/* ── Search Form ────────────────────────────────── */}
      <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-6">
          <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="ঠিকাদারের নাম লিখুন (উদাঃ M/S Ocean Enterprise)"
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
                className="pl-10 h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Search className="absolute left-3.5 top-3.5 text-slate-400 w-5 h-5" />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 font-semibold flex items-center gap-2 shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              অনুসন্ধান করুন
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Main Content Area ────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">তথ্য অনুসন্ধান করা হচ্ছে...</p>
        </div>
      ) : perfData ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Searching Info */}
          <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2.5 rounded-xl border border-blue-100 font-medium text-sm">
            <Search className="w-4 h-4" />
            Searching: <span className="font-bold">"{queryName}"</span> | Found {perfData.kpis?.totalBids || 0} records
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard
              icon={<Users className="w-5 h-5" />}
              label="Average Less"
              value={`${perfData.kpis?.avgLess}%`}
              subtext="Across all filtered bids"
              color="blue"
            />
            <KPICard
              icon={<TrendingDown className="w-5 h-5" />}
              label="Avg Responsive Less"
              value={`${perfData.kpis?.avgResponsiveLess}%`}
              subtext="Acceptable bids only"
              color="emerald"
            />
            <KPICard
              icon={<CheckCircle2 className="w-5 h-5" />}
              label="Avg Winning Less"
              value={`${perfData.kpis?.avgWinningLess}%`}
              subtext="When recommended as winner"
              color="amber"
            />
          </div>

          {/* Contractor summary table */}
          <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4 bg-white">
              <CardTitle className="text-base font-bold text-slate-800">
                ঠিকাদার সামারি (নামের বানানগত বিভিন্নতা)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                      <TableHead className="font-semibold text-slate-600">ঠিকাদারের নাম</TableHead>
                      <TableHead className="text-right font-semibold text-slate-600">গড় ছাড় (%)</TableHead>
                      <TableHead className="text-right font-semibold text-slate-600">গড় রেসপন্সিভ (%)</TableHead>
                      <TableHead className="text-right font-semibold text-slate-600">গড় উইনিং (%)</TableHead>
                      <TableHead className="text-center font-semibold text-slate-600">অংশগ্রহণ</TableHead>
                      <TableHead className="text-center font-semibold text-slate-600">রেসপন্সিভ (গ্রহণযোগ্য)</TableHead>
                      <TableHead className="text-center font-semibold text-slate-600">জয়</TableHead>
                      <TableHead className="text-center font-semibold text-slate-600">OCE-এর উপরে</TableHead>
                      <TableHead className="text-right font-semibold text-slate-600">উইন রেট</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {perfData.summary?.map((row: any, i: number) => (
                      <TableRow key={i} className="hover:bg-slate-50/40">
                        <TableCell className="font-bold text-slate-800 bg-amber-50/20">{row.contractorName}</TableCell>
                        <TableCell className="text-right font-semibold text-emerald-600">{row.avgLess}%</TableCell>
                        <TableCell className="text-right font-semibold text-emerald-600">{row.avgResponsive}%</TableCell>
                        <TableCell className="text-right font-semibold text-amber-600">{row.avgWinning}%</TableCell>
                        <TableCell className="text-center font-bold text-slate-800">{row.participations}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span>{row.responsiveCount}</span>
                            <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold">{row.responsivePercent}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span>{row.wins}</span>
                            <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-semibold">{row.winPercent}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span>{row.aboveOce}</span>
                            <span className="text-[11px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded font-semibold">{row.aboveOcePercent}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-black text-slate-800">{row.winRate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Individual bids list table */}
          <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4 bg-white">
              <CardTitle className="text-base font-bold text-slate-800">
                টেন্ডার অংশগ্রহণের ইতিহাস (Tender Participations History)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                      <TableHead className="font-semibold text-slate-600">ঠিকাদারের নাম</TableHead>
                      <TableHead className="font-semibold text-slate-600">টেন্ডার আইডি</TableHead>
                      <TableHead className="font-semibold text-slate-600">অর্গানাইজেশন</TableHead>
                      <TableHead className="text-right font-semibold text-slate-600">দাখিলকৃত দর</TableHead>
                      <TableHead className="text-right font-semibold text-slate-600">OCE</TableHead>
                      <TableHead className="text-center font-semibold text-slate-600">এস্টিমেট থেকে %</TableHead>
                      <TableHead className="text-center font-semibold text-slate-600">র‍্যাংক</TableHead>
                      <TableHead className="text-center font-semibold text-slate-600">কারিগরি যোগ্যতা</TableHead>
                      <TableHead className="text-center font-semibold text-slate-600">আর্থিক যোগ্যতা</TableHead>
                      <TableHead className="text-center font-semibold text-slate-600">অ্যাকশন</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {perfData.bids?.map((bid: any, i: number) => (
                      <TableRow key={i} className="hover:bg-slate-50/40">
                        <TableCell className="font-bold text-slate-800">
                          <div className="flex flex-col">
                            <span>{bid.contractorName}</span>
                            {bid.isWinner && (
                              <span className="text-[10px] w-max font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded mt-0.5">
                                🏆 Winner
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-blue-600 hover:underline">
                          <Link to={`/dashboard/nppi-calculation/${bid.recordId}`}>
                            #{bid.tenderId}
                          </Link>
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium text-xs max-w-[200px] truncate" title={bid.organization}>
                          {bid.organization}
                        </TableCell>
                        <TableCell className="text-right font-extrabold text-slate-800">
                          ৳ {bid.quotedRate.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-600">
                          ৳ {bid.oce.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center gap-1 font-bold text-sm ${bid.percentLess >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {bid.percentLess >= 0 ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                            {Math.abs(bid.percentLess).toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-bold text-blue-600">{bid.rank}</TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${bid.qualified ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                            {bid.qualified ? "যোগ্য" : "অযোগ্য"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${bid.isResponsive ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                            {bid.isResponsive ? "Responsive" : "Non-Responsive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            onClick={() => navigate(`/dashboard/nppi-calculation/${bid.recordId}`)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 gap-1.5 rounded-xl transition-all duration-200"
                          >
                            <Eye size={12} /> দেখুন
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : hasSearched ? (
        <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden bg-white p-12 text-center text-slate-500 font-medium">
          কোনো তথ্য পাওয়া যায়নি
        </Card>
      ) : (
        <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden bg-white p-12 text-center text-slate-400 font-medium">
          অনুগ্রহ করে উপরে ঠিকাদারের নাম লিখে খুঁজুন
        </Card>
      )}
    </div>
  );
}

// ─── Local KPI Card Component ───────────────────────────────
function KPICard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: "blue" | "emerald" | "amber";
}) {
  const iconBg: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  const textColor: Record<string, string> = {
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
  };

  return (
    <Card className="rounded-2xl border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white">
      <CardContent className="p-5 space-y-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg[color]}`}>
          {icon}
        </div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className={`text-2xl font-bold ${textColor[color]}`}>{value}</p>
        <p className="text-xs text-slate-400">{subtext}</p>
      </CardContent>
    </Card>
  );
}
