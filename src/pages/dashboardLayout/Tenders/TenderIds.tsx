// @ts-nocheck

import { config } from "@/lib/config";
import { TenderMethodComboBox } from "@/components/mainlayout/Tenders/TenderMethodComboBox";
import { Input } from "@/components/ui/input";
import useAllTenderIds from "@/hooks/useAllTenderIds";
import { formatDate } from "@/lib/formateDate";
import Pagination from "@/shared/Pagination/Pagination";
import { AlignJustify, Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JsonFileUploader from "./JSONConverter";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

const TenderIds = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [method, setMethod] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [pageLimit, setPageLimit] = useState(
    Number(searchParams.get("limit")) || 3
  );

  const { tenders, loading, tendersCount, setReload } = useAllTenderIds(
    searchTerm,
    method,
    currentPage,
    pageLimit
  );
  const skeleton = new Array(pageLimit).fill(Math?.random());

  const handleDelete = async (id) => {
    const url = `${config.apiBaseUrl}/tenderIds/delete-tenderId/${id}`
    const toastId = toast.loading("Loading...");
    try {
      const response = await axios.delete(url, { withCredentials: false });
      if (response.status === 200) {
        ;
        toast.dismiss(toastId);
        toast.success("success");
        setMessage("Successfully Deleted")
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message || "An unexpected error occurred");
      console.error("Error:", error);
    } finally {
      toast.dismiss(toastId);
      setReload((prevReload) => prevReload + 1);
    }
  };

  const downloadTenderIds = async () => {
    const toastId = toast.loading("Fetching all Tender IDs…");
    try {
      const res = await axiosInstance.get('/live-tenders/export-ids');
      if (res.data?.success) {
        const ids = res.data.data;
        if (!ids || ids.length === 0) {
          toast.error("No Tender IDs found.");
          return;
        }

        // CSV generation using Blob for larger datasets
        const csvHeader = "Tender ID\n";
        const csvRows = ids.join("\n");
        const csvContent = csvHeader + csvRows;
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `tender_ids_full_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        toast.success(`Downloaded ${ids.length} total IDs ✓`);
      }
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Download failed. Make sure backend is running.");
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage);
    params.set("limit", pageLimit);
    setSearchParams(params);
  }, [currentPage, pageLimit]);

  return (
    <div>
      <div className=" my-5 ">
        <div className="flex gap-4 items-center justify-between">
          <JsonFileUploader setReload={setReload} />
          
          <Button 
            onClick={downloadTenderIds}
            variant="outline"
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
          >
            <Download size={18} />
            Download all IDs (CSV)
          </Button>
        </div>
      </div>
      <div
        id="tenderId-delete-message"
        className="text-green-600  mt-4 font-medium"
      >
        {message && message}{" "}
        {message && (
          <X
            size={16}
            className="inline-block cursor-pointer"
            onClick={() => setMessage("")}
          />
        )}

      </div>
      <div className="flex items-center gap-2 flex-wrap mt-5 justify-between">
        <div className="flex items-center gap-2">
          <AlignJustify />
          <h1 className="text-2xl font-semibold mb-1">
            {tendersCount} {method && `${method}`} Tenders Found{" "}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3 flex-1 justify-end">
          <Input
            value={searchTerm}
            placeholder="Search by Tender Id or Type"
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={(e) => setSearchTerm(e.target.value.trim())}
            className="max-w-[300px]"
          />
          <TenderMethodComboBox setMethod={setMethod} />
        </div>
      </div>
      {
        <div className="overflow-x-auto">
          <table className="mt-5 w-full">
            <thead>
              <tr className="bg-primary text-primary-foreground">

                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tl">
                  Tender Id
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start">Type</th>

                <th className="whitespace-nowrap px-4 py-2  text-start">
                  Method
                </th>
                <th className="whitespace-nowrap px-4 py-2  text-start">
                  District
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Publication Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start ">
                  Opening Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-start rounded-tr">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading ? (
                tenders?.length > 0 ? (
                  tenders?.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`border ${idx % 2 == 1 && "bg-gray-100"}`}
                    >

                      <td className="px-4 py-2">{item?.tenderId}</td>
                      <td className="px-4 py-2">{item?.ProcurementType}</td>
                      <td className="px-4 py-2">{item?.procurementMethod}</td>
                      <td className="px-4 py-2">{item?.locationDistrict || "NOT AVAILABLE"}</td>

                      <td className="px-4 py-2">
                        {formatDate(item?.publicationDateTime, "MM-dd-yyyy")}
                      </td>
                      <td className="px-4 py-2">
                        {formatDate(item?.openingDateTime, "MM-dd-yyyy")}
                      </td>
                      <td className="px-4 py-2"><Button onClick={() => handleDelete(item?._id)} className="cursor-pointer">Delete</Button></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-1">
                      No Data Found
                    </td>
                  </tr>
                )
              ) : (
                skeleton.map((item, idx) => (
                  <tr key={idx}>
                    <td
                      colSpan={7}
                      className={`h-20 ${idx % 2 == 1 ? "bg-gray-300" : "bg-white"
                        }`}
                    ></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      }
      {tenders?.length > 0 && (
        <Pagination
          data={{
            pageLimit,
            setCurrentPage,
            setPageLimit,
            count: tendersCount,
            currentPage,
          }}
        />
      )}
    </div>
  );
};

export default TenderIds;
