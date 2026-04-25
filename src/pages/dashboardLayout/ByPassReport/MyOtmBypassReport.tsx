// @ts-nocheck

import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useMyOtmBypassReports from "@/hooks/useMyOtmBypassReports";
import { AuthContext } from "@/provider/AuthProvider";
import { AlignJustify, XCircle, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useContext, useState, useEffect } from "react";

const MyOtmBypassReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, setReload, pagination } = useMyOtmBypassReports(
    searchTerm,
    user?.email,
    currentPage,
    20,
    statusFilter
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handleCancelRequest = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const confirmCancel = () => {
    if (selectedItem) {
      const url = `${config.apiBaseUrl}/otm-bypass-report/update-status`;
      const payload = {
        reportId: selectedItem?._id,
        status: "canceled",
      };
      fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result?.success) {
            setReload((prev) => prev + 1);
          }
        })
        .catch((error) => console.error("Error canceling report:", error));
      setIsDialogOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="pb-8">
      <div className="flex max-md:flex-col max-md:gap-2 justify-between mt-5">
        <div className="flex items-center gap-2">
          <AlignJustify />
          <h1 className="text-2xl font-semibold mb-1">My OTM Bypass Reports</h1>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            value={searchTerm}
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {/* Desktop Table */}
        <table className="mt-5 w-full max-lg:hidden">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">SL</th>
              <th className="whitespace-nowrap px-4 py-2 text-start">Tender ID</th>
              <th className="whitespace-nowrap px-4 py-2 text-start">Invoice No</th>
              <th className="whitespace-nowrap px-4 py-2 text-start">Company Name</th>
              <th className="whitespace-nowrap px-4 py-2 text-start">EGP Email</th>
              <th className="whitespace-nowrap px-4 py-2 text-start">Bank</th>
              <th className="whitespace-nowrap px-4 py-2 text-start">Status</th>
              <th className="whitespace-nowrap px-4 py-2 text-start rounded-tr">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && data?.length > 0 ? (
              data.map((item, idx) => (
                <tr key={item?._id || idx} className={`border ${idx % 2 === 1 && "bg-gray-100"}`}>
                  <td className="px-4 py-2">{(currentPage - 1) * 20 + idx + 1}</td>
                  <td className="px-4 py-2">{item?.tender_id}</td>
                  <td className="px-4 py-2">{item?.invoice_no}</td>
                  <td className="px-4 py-2">{item?.company_name}</td>
                  <td className="px-4 py-2">{item?.egp_email}</td>
                  <td className="px-4 py-2">{item?.bank_name}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`border-none shadow-none rounded inline-block py-0.5 px-1.5 font-semibold ${
                        item?.status === "fulfilled"
                          ? "bg-green-300 text-green-900"
                          : item?.status === "canceled"
                            ? "bg-red-400 text-red-900"
                            : item?.status === "processing"
                              ? "bg-blue-300 text-blue-900"
                              : item?.status === "waiting"
                                ? "bg-yellow-300 text-yellow-900"
                                : "bg-orange-300 text-orange-900"
                      }`}
                    >
                      {item?.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {item?.status !== "canceled" && item?.status !== "fulfilled" ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelRequest(item)}
                        className="flex items-center gap-1"
                      >
                        <XCircle size={16} />
                        Cancel Req
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="flex items-center gap-1 opacity-50">
                        <XCircle size={16} />
                        {item?.status === "canceled" ? "Canceled" : "Fulfilled"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-3">
                  {loading ? "Loading..." : "No Report Found!"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mobile Card Layout */}
        <MobileTableLayout data={data} loading={loading} handleCancelRequest={handleCancelRequest} />
      </div>

      {/* Pagination */}
      {!loading && data?.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 border-t pt-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{(currentPage - 1) * 20 + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(currentPage * 20, pagination?.totalCount || 0)}
            </span>{" "}
            of <span className="font-semibold">{pagination?.totalCount || 0}</span> results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="cursor-pointer flex items-center gap-1"
            >
              <ChevronsLeft size={16} />
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={!pagination?.hasPreviousPage}
              className="cursor-pointer"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(pagination?.totalPages || 1, 5) }, (_, i) => {
                let pageNum;
                if (pagination?.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination?.totalPages - 2) {
                  pageNum = pagination?.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="cursor-pointer w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!pagination?.hasNextPage}
              className="cursor-pointer"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(pagination?.totalPages || 1)}
              disabled={currentPage === pagination?.totalPages}
              className="cursor-pointer flex items-center gap-1"
            >
              Last
              <ChevronsRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Cancel OTM Report</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2">
              <p className="text-base">Are you sure you want to cancel this OTM bypass report?</p>
              {selectedItem && (
                <div className="bg-gray-50 border rounded-lg p-4 space-y-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Tender ID:</span>
                    <span className="text-gray-900 font-medium">{selectedItem?.tender_id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Invoice No:</span>
                    <span className="text-gray-900 font-medium">{selectedItem?.invoice_no}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Company:</span>
                    <span className="text-gray-900 font-medium">{selectedItem?.company_name}</span>
                  </div>
                </div>
              )}
              <p className="text-sm text-red-600 mt-3">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              No, Keep It
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-red-600 hover:bg-red-700">
              Yes, Cancel Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const MobileTableLayout = ({ data, loading, handleCancelRequest }) => {
  if (loading) {
    return <div className="lg:hidden text-center py-8 text-gray-500">Loading...</div>;
  }
  return (
    <div className="flex flex-col gap-6 my-8 lg:hidden px-2">
      {data?.length > 0 ? (
        data.map((item, idx) => (
          <div key={item?._id || idx} className="flex flex-col gap-2 border rounded-xl p-4 py-6 shadow-sm bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
              <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Tender ID:</span>
              <span className="text-gray-800 break-words sm:text-right font-bold text-xl">{item?.tender_id}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
              <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Invoice No:</span>
              <span className="text-gray-800 break-words sm:text-right font-medium">{item?.invoice_no}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
              <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Company:</span>
              <span className="text-gray-800 break-words sm:text-right font-medium">{item?.company_name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
              <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">EGP Email:</span>
              <span className="text-gray-800 break-all sm:text-right font-medium">{item?.egp_email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
              <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Bank:</span>
              <span className="text-gray-800 break-words sm:text-right font-medium">{item?.bank_name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2 my-2">
              <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Status:</span>
              <span className="text-gray-800 break-words sm:text-right">
                <span
                  className={`inline-block py-0.5 px-2 rounded font-semibold text-sm ${
                    item?.status === "fulfilled"
                      ? "bg-green-100 text-green-700"
                      : item?.status === "canceled"
                        ? "bg-red-100 text-red-700"
                        : item?.status === "processing"
                          ? "bg-blue-100 text-blue-700"
                          : item?.status === "waiting"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {item?.status}
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-4">
              <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Actions:</span>
              <div className="flex items-center gap-2">
                {item?.status !== "canceled" && item?.status !== "fulfilled" ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelRequest(item)}
                    className="flex items-center gap-1 h-8 text-xs"
                  >
                    <XCircle size={14} />
                    Cancel Request
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled className="flex items-center gap-1 opacity-50 h-8 text-xs">
                    <XCircle size={14} />
                    {item?.status === "canceled" ? "Canceled" : "Fulfilled"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">No Report Found!</div>
      )}
    </div>
  );
};

export default MyOtmBypassReport;
