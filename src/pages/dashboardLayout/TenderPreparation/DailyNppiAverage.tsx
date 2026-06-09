// @ts-nocheck
import { useState, useMemo, useContext } from "react";
import { format } from "date-fns";
import { AuthContext } from "@/provider/AuthProvider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  CalendarDays,
  TrendingUp,
  Package,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileEdit,
  Plus,
} from "lucide-react";
import useDailyNppiAverage from "@/hooks/useDailyNppiAverage";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { config } from "@/lib/config";

const ITEMS_PER_PAGE = 15;

// ---------------------------------------------------------------------------
// KPI Card sub-component
// ---------------------------------------------------------------------------
interface NppiKpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: "blue" | "green";
}

function NppiKpiCard({ icon, label, value, sub, color }: NppiKpiCardProps) {
  const colorMap = {
    blue: {
      iconBg: "bg-blue-50 text-blue-600",
      valueText: "text-blue-600",
      border: "border-t-blue-500",
    },
    green: {
      iconBg: "bg-emerald-50 text-emerald-600",
      valueText: "text-emerald-600",
      border: "border-t-emerald-500",
    },
  };

  const c = colorMap[color];

  return (
    <Card
      className={`rounded-2xl border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-t-4 ${c.border}`}
    >
      <CardContent className="p-6 space-y-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.iconBg}`}
        >
          {icon}
        </div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className={`text-3xl font-bold tracking-tight ${c.valueText}`}>
          {value}
        </p>
        <p className="text-xs text-slate-400">{sub}</p>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 -m-5 p-5 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-80" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Skeleton className="h-52 rounded-2xl" />
        <Skeleton className="h-52 rounded-2xl" />
      </div>
      <Skeleton className="h-[500px] rounded-2xl" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const DailyNppiAverage = () => {
  const { data, loading, error, refetch } = useDailyNppiAverage();
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";
  const [isOpen, setIsOpen] = useState(false);
  const [modalDate, setModalDate] = useState("");
  const [modalWorks, setModalWorks] = useState("");
  const [modalGoods, setModalGoods] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenAddModal = () => {
    setIsEdit(false);
    setModalDate("");
    setModalWorks("");
    setModalGoods("");
    setIsOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setIsEdit(true);
    setModalDate(record.date);
    setModalWorks(record.works !== null ? record.works.toString() : "");
    setModalGoods(record.goods !== null ? record.goods.toString() : "");
    setIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!modalDate) {
      toast.error("Date is required");
      return;
    }
    
    setIsSaving(true);
    try {
      const payload = {
        date: modalDate,
        works: modalWorks === "" ? null : parseFloat(modalWorks),
        goods: modalGoods === "" ? null : parseFloat(modalGoods),
      };

      if (payload.works !== null && isNaN(payload.works)) {
        toast.error("Works value must be a valid number");
        setIsSaving(false);
        return;
      }
      if (payload.goods !== null && isNaN(payload.goods)) {
        toast.error("Goods value must be a valid number");
        setIsSaving(false);
        return;
      }

      const response = await axiosInstance.post(
        `${config.apiBaseUrl}/stl/daily-nppi-average`,
        payload
      );

      if (response.data?.success) {
        toast.success(response.data.message || "Saved successfully");
        setIsOpen(false);
        refetch();
      } else {
        toast.error(response.data?.message || "Failed to save");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  // All hooks must be called BEFORE any early returns
  const totalCount = data?.dailyData?.length || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const pageNumbers = useMemo(() => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 -m-5 p-5 md:p-8">
        <Card className="rounded-2xl border-red-200/60 shadow-sm max-w-lg mx-auto mt-20">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              Failed to load data
            </h2>
            <p className="text-sm text-slate-500">{error}</p>
            <Button
              variant="outline"
              onClick={refetch}
              className="gap-2 mt-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 -m-5 p-5 md:p-8">
        <Card className="rounded-2xl border-slate-200/60 shadow-sm max-w-lg mx-auto mt-20">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              No data available
            </h2>
            <p className="text-sm text-slate-500">
              No NPPI data has been recorded yet. Upload STL PDFs to see daily
              averages.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedAsOfDate = data.asOfDate
    ? format(new Date(data.asOfDate + "T00:00:00"), "MMMM d, yyyy")
    : "N/A";

  // Pagination logic
  const paginatedData = data.dailyData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 -m-5 p-5 md:p-8 space-y-8">
      {/* ---------------------------------------------------------------- */}
      {/* Header Section                                                    */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">
              NPPI Factor by Product/Service Method
            </h1>
            <p className="text-sm text-slate-500">
              30-Day Average (as of {formattedAsOfDate})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button
              onClick={handleOpenAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl shadow-md shadow-blue-200 hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Override Average
            </Button>
          )}

          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-default pointer-events-none"
          >
            <CalendarDays className="w-4 h-4" />
            Daily Table: Last 90 Days
          </a>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* KPI Cards                                                         */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <NppiKpiCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Works"
          value={data.thirtyDayAverage.works.toFixed(3)}
          sub={`30-Day Average (as of ${formattedAsOfDate})`}
          color="blue"
        />
        <NppiKpiCard
          icon={<Package className="w-5 h-5" />}
          label="Goods"
          value={data.thirtyDayAverage.goods.toFixed(3)}
          sub={`30-Day Average (as of ${formattedAsOfDate})`}
          color="green"
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Table Section                                                     */}
      {/* ---------------------------------------------------------------- */}
      <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            Daily NPPI Factor Averages (Last 90 Days)
            <Badge
              variant="secondary"
              className="text-xs font-normal bg-slate-100 text-slate-600 hover:bg-slate-100 border-0"
            >
              {totalCount} Days
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {totalCount === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No daily data available
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-200">
                    <TableHead className="font-semibold text-slate-700 w-12">
                      #
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Date
                    </TableHead>
                    <TableHead className="text-right font-semibold text-blue-600">
                      Works
                    </TableHead>
                    <TableHead className="text-right font-semibold text-emerald-600">
                      Goods
                    </TableHead>
                    {isAdmin && (
                      <TableHead className="text-right font-semibold text-slate-700 w-24">
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((record, index) => (
                    <TableRow
                      key={record.date}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="text-slate-400 text-sm">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </TableCell>
                      <TableCell className="font-medium text-slate-700">
                        {format(
                          new Date(record.date + "T00:00:00"),
                          "MMM d, yyyy"
                        )}
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${
                          record.works !== null
                            ? "text-blue-600"
                            : "text-slate-300"
                        }`}
                      >
                        {record.works !== null
                          ? record.works.toFixed(3)
                          : "—"}
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${
                          record.goods !== null
                            ? "text-emerald-600"
                            : "text-slate-300"
                        }`}
                      >
                        {record.goods !== null
                          ? record.goods.toFixed(3)
                          : "—"}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-100 hover:text-slate-900 rounded-full"
                            onClick={() => handleOpenEditModal(record)}
                          >
                            <FileEdit className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                            <span className="sr-only">Edit override</span>
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* ── Pagination ──────────────────────────────── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/60">
                  <p className="text-sm text-slate-500">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of{" "}
                    {totalCount} records
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </Button>
                    {pageNumbers.map((page) => (
                      <Button
                        key={page}
                        variant={
                          page === currentPage ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-9 h-9 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                    {currentPage < totalPages - 2 && totalPages > 5 && (
                      <span className="text-slate-400 px-1">...</span>
                    )}
                    {totalPages > 5 &&
                      !pageNumbers.includes(totalPages) && (
                        <Button
                          variant={
                            totalPages === currentPage
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className="w-9 h-9 p-0"
                        >
                          {totalPages}
                        </Button>
                      )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* Dialog Modal for Edit / Add Override                           */}
      {/* ---------------------------------------------------------------- */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-100 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">
              {isEdit ? "Edit Daily NPPI Factors" : "Add Daily NPPI Override"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-400">
              {isEdit
                ? `Update NPPI factor overrides for ${modalDate ? format(new Date(modalDate + "T00:00:00"), "MMM d, yyyy") : ""}.`
                : "Set manual NPPI factor overrides for a specific date."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-6 py-4">
            <div className="space-y-4">
              {/* Date Input */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="text-sm font-semibold text-slate-700">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  disabled={isEdit}
                  value={modalDate}
                  onChange={(e) => setModalDate(e.target.value)}
                  className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-60"
                  required
                />
              </div>

              {/* Works Input */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="works" className="text-sm font-semibold text-slate-700">
                  Works NPPI Factor
                </Label>
                <Input
                  id="works"
                  type="number"
                  step="0.0001"
                  placeholder="e.g. 0.9150 (Leave empty to reset to default)"
                  value={modalWorks}
                  onChange={(e) => setModalWorks(e.target.value)}
                  className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Goods Input */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="goods" className="text-sm font-semibold text-slate-700">
                  Goods NPPI Factor
                </Label>
                <Input
                  id="goods"
                  type="number"
                  step="0.0001"
                  placeholder="e.g. 0.9100 (Leave empty to reset to default)"
                  value={modalGoods}
                  onChange={(e) => setModalGoods(e.target.value)}
                  className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-200"
              >
                {isSaving ? "Saving..." : "Save Overrides"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DailyNppiAverage;
