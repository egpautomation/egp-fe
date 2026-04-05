// @ts-nocheck

import { config } from "@/lib/config";
import { TenderMethodComboBox } from "@/components/mainlayout/Tenders/TenderMethodComboBox";
import { Input } from "@/components/ui/input";
import useAllTenderIds from "@/hooks/useAllTenderIds";
import { formatDate } from "@/lib/formateDate";
import Pagination from "@/shared/Pagination/Pagination";
import {
  AlignJustify,
  Download,
  X,
  FileJson,
  Upload,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Info,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

/* ─────────────────────────────────────────────── */
/*  JSON / CSV Import Panel                        */
/* ─────────────────────────────────────────────── */

const JsonImportPanel = ({ onImportDone }) => {
  const fileRef = useRef(null);
  const [parsed, setParsed] = useState(null);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      return headers.reduce((obj, header, i) => {
        obj[header] = values[i] || "";
        return obj;
      }, {});
    });
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        let arr = [];
        const content = ev.target.result;
        if (file.name.endsWith(".json")) {
          const raw = JSON.parse(content);
          arr = Array.isArray(raw) ? raw : (raw?.data ?? []);
        } else if (file.name.endsWith(".csv")) {
          arr = parseCSV(content);
        }
        setParsed(arr);
        toast.success(`${arr.length} records loaded`);
      } catch {
        toast.error("Invalid file format");
        setParsed(null);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleImport = async () => {
    if (!parsed?.length) return;
    setLoading(true);
    const toastId = toast.loading(`Importing ${parsed.length} records…`);
    try {
      const res = await axiosInstance.post(`${config.apiBaseUrl}/tenderIds/import-json`, parsed);
      toast.dismiss(toastId);
      const { inserted, skipped } = res.data?.data || { inserted: 0, skipped: 0 };

      if (inserted === 0 && skipped > 0) {
        toast.error(`Rejected: All ${skipped} records are duplicates!`, { duration: 5000 });
      } else if (skipped > 0) {
        toast.success(`Accepted: ${inserted}, Rejected (Duplicates): ${skipped}`, {
          duration: 6000,
        });
      } else {
        toast.success(`All ${inserted} records imported successfully!`);
      }
      setParsed(null);
      setFilename("");
      onImportDone?.();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err?.response?.data?.message ?? "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/60 p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <FileJson size={20} className="text-indigo-600" />
        <span className="font-semibold text-indigo-700 text-base">JSON/CSV Bulk Import</span>
        <span className="text-sm text-gray-500 ml-1">— import multiple tender IDs at once</span>
      </div>

      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile({ target: { files: [file] } });
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".json,.csv"
          className="hidden"
          onChange={handleFile}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-100 transition rounded-lg px-4 py-2 text-sm font-medium shadow-sm"
        >
          <Upload size={15} />
          {filename || "Choose JSON/CSV file"}
        </button>

        {parsed && (
          <>
            <span className="text-sm text-gray-600">
              <strong className="text-indigo-700">{parsed.length}</strong> records ready
            </span>
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
            >
              Preview {preview ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            <Button
              onClick={handleImport}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2 rounded-lg shadow-sm"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin mr-1 inline" />
              ) : (
                <Upload size={14} className="mr-1 inline" />
              )}
              Import
            </Button>
            <button
              onClick={() => {
                setParsed(null);
                setFilename("");
              }}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>

      {preview && parsed?.length > 0 && (
        <div className="mt-4 overflow-x-auto max-h-52 rounded-lg border border-indigo-200 bg-white">
          <table className="text-sm w-full">
            <thead className="bg-indigo-100 text-indigo-700 sticky top-0">
              <tr>
                {Object.keys(parsed[0]).map((k) => (
                  <th key={k} className="px-3 py-1.5 text-left whitespace-nowrap">
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsed.slice(0, 10).map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                  {Object.values(row).map((v, j) => (
                    <td key={j} className="px-3 py-1.5 whitespace-nowrap text-gray-700">
                      {String(v ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {parsed.length > 10 && (
            <p className="text-center text-sm text-gray-400 py-1">
              + {parsed.length - 10} more records
            </p>
          )}
        </div>
      )}

      {!parsed && (
        <p className="mt-3 text-sm text-gray-500 flex items-center gap-1">
          <Info size={12} /> Supports JSON/CSV arrays. Drag & drop supported.
        </p>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────── */
/*  Main Component                                 */
/* ─────────────────────────────────────────────── */

const TenderIds = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [method, setMethod] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showImport, setShowImport] = useState(false);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageLimit, setPageLimit] = useState(Number(searchParams.get("limit")) || 20);

  const { tenders, loading, tendersCount, setReload } = useAllTenderIds(
    searchTerm,
    method,
    currentPage,
    pageLimit
  );
  const skeleton = new Array(Math.min(pageLimit, 8)).fill(0);

  const handleDelete = async (id) => {
    const url = `${config.apiBaseUrl}/tenderIds/delete-tenderId/${id}`;
    const toastId = toast.loading("Deleting...");
    try {
      const response = await axiosInstance.delete(url);
      if (response.status === 200) {
        toast.dismiss(toastId);
        toast.success("Deleted ✓");
        setReload((prev) => prev + 1);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message || "Delete failed");
    }
  };

  const downloadTenderIds = async () => {
    const toastId = toast.loading("Fetching all Tender IDs…");
    try {
      const res = await axiosInstance.get(
        `/live-tenders/export-ids?searchTerm=${searchTerm}&method=${method}`
      );
      if (res.data?.success) {
        const ids = res.data.data;
        if (!ids?.length) {
          toast.error("No Tender IDs found.");
          return;
        }
        const blob = new Blob(["Tender ID\n" + ids.join("\n")], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `tender_ids_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 100);
        toast.success(`Downloaded ${ids.length} IDs ✓`);
      }
    } catch (err) {
      toast.error("Download failed");
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("limit", pageLimit.toString());
    setSearchParams(params, { replace: true });
  }, [currentPage, pageLimit]);

  return (
    <div className="px-1 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <AlignJustify size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">Tender IDs</h1>
            <p className="text-sm text-gray-500">
              {loading ? "Loading…" : `Total ${tendersCount} records`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID or Type…"
              className="pl-8 h-10 text-base w-72"
            />
            {searchTerm && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => setSearchTerm("")}
              >
                <X size={13} />
              </button>
            )}
          </div>

          <TenderMethodComboBox setMethod={setMethod} />

          <button
            onClick={() => setReload((r) => r + 1)}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>

          <Button
            onClick={() => setShowImport(!showImport)}
            variant={showImport ? "default" : "outline"}
            className="h-10 text-base gap-1.5 px-4 rounded-xl shadow-sm"
          >
            <FileJson size={14} /> JSON Import
          </Button>

          <Button
            onClick={downloadTenderIds}
            variant="outline"
            className="h-10 text-base gap-1.5 bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-4 rounded-xl shadow-sm"
          >
            <Download size={14} /> Download IDs
          </Button>
        </div>
      </div>

      {showImport && <JsonImportPanel onImportDone={() => setReload((r) => r + 1)} />}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-4 py-3 text-left">Tender ID</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Method</th>
              <th className="px-4 py-3 text-left">District</th>
              <th className="px-4 py-3 text-center">Publication</th>
              <th className="px-4 py-3 text-center">Opening</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              skeleton.map((_, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  {Array(7)
                    .fill(0)
                    .map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                </tr>
              ))
            ) : tenders?.length > 0 ? (
              tenders.map((item, idx) => (
                <tr
                  key={item?._id || idx}
                  className={`border-b border-gray-100 hover:bg-blue-50/40 ${idx % 2 === 1 ? "bg-gray-50/60" : ""}`}
                >
                  <td className="px-4 py-4 font-mono font-bold text-indigo-700">
                    {item?.tenderId}
                  </td>
                  <td className="px-4 py-4">{item?.ProcurementType}</td>
                  <td className="px-4 py-4">{item?.procurementMethod}</td>
                  <td className="px-4 py-4 text-sm">{item?.locationDistrict || "N/A"}</td>
                  <td className="px-4 py-4 text-center text-sm">
                    {formatDate(item?.publicationDateTime, "dd-MMM-yyyy")}
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-red-600">
                    {formatDate(item?.openingDateTime, "dd-MMM-yyyy")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      onClick={() => handleDelete(item?._id)}
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-400">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {tendersCount > 0 && (
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
