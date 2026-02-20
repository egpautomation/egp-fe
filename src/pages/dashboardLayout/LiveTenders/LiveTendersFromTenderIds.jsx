// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  AlignJustify,
  Upload,
  Trash2,
  X,
  Search,
  RefreshCw,
  FileJson,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/shared/Pagination/Pagination";
import useLiveTenders, { LIVE_TENDERS_API } from "@/hooks/useLiveTenders";

/* ─────────────────────────────────────────────── */
/*  Helpers                                        */
/* ─────────────────────────────────────────────── */

/** Safely format a date string like "03-Feb-2026" or ISO */
function fmtDate(dateStr, timeStr = "") {
  if (!dateStr) return "—";
  return timeStr ? `${dateStr}  ${timeStr}` : dateStr;
}

/** Badge colours per procurement nature */
const natureColors = {
  Goods: "bg-emerald-100 text-emerald-800",
  Works: "bg-blue-100 text-blue-800",
  Services: "bg-violet-100 text-violet-800",
  default: "bg-gray-100 text-gray-700",
};

function Badge({ label }) {
  const cls = natureColors[label] ?? natureColors.default;
  return (
    <span
      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}
    >
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────── */
/*  JSON Import Panel                              */
/* ─────────────────────────────────────────────── */

function JsonImportPanel({ onImportDone }) {
  const fileRef = useRef(null);
  const [parsed, setParsed] = useState(null); // data from file
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw = JSON.parse(ev.target.result);
        // Accept both array and { data: [...] }
        const arr = Array.isArray(raw) ? raw : raw?.data ?? [];
        setParsed(arr);
        toast.success(`${arr.length} records loaded`);
      } catch {
        toast.error("Invalid JSON file");
        setParsed(null);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleImport = async () => {
    if (!parsed?.length) return;
    setLoading(true);
    const toastId = toast.loading(`Importing ${parsed.length} tenders…`);
    try {
      const res = await axios.post(`${LIVE_TENDERS_API}/import-json`, parsed);
      toast.dismiss(toastId);
      toast.success(
        `✅ ${res.data?.inserted ?? parsed.length} tenders imported successfully!`
      );
      setParsed(null);
      setFilename("");
      onImportDone?.();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err?.response?.data?.message ?? err.message ?? "Import failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setParsed(null);
    setFilename("");
  };

  return (
    <div className="rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/60 p-5 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <FileJson size={20} className="text-indigo-600" />
        <span className="font-semibold text-indigo-700 text-sm">
          JSON Bulk Import
        </span>
        <span className="text-xs text-gray-500 ml-1">
          — import multiple tenders at once
        </span>
      </div>

      {/* Drop / File area */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) {
            const fakeEvt = { target: { files: [file], value: "" } };
            handleFile(fakeEvt);
          }
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFile}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-100 transition rounded-lg px-4 py-2 text-sm font-medium shadow-sm"
        >
          <Upload size={15} />
          {filename ? filename : "Choose JSON file"}
        </button>

        {parsed && (
          <>
            <span className="text-xs text-gray-600">
              <strong className="text-indigo-700">{parsed.length}</strong>{" "}
              records ready
            </span>

            <button
              onClick={() => setPreview((p) => !p)}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
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
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 transition"
              title="Clear"
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>

      {/* Preview table */}
      {preview && parsed?.length > 0 && (
        <div className="mt-4 overflow-x-auto max-h-52 rounded-lg border border-indigo-200 bg-white">
          <table className="text-xs w-full">
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
                    <td
                      key={j}
                      className="px-3 py-1.5 whitespace-nowrap text-gray-700"
                    >
                      {String(v ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {parsed.length > 10 && (
            <p className="text-center text-xs text-gray-400 py-1">
              + {parsed.length - 10} more records
            </p>
          )}
        </div>
      )}

      {/* Hint */}
      {!parsed && (
        <p className="mt-3 text-xs text-gray-500 flex items-center gap-1">
          <Info size={12} />
          Supports JSON array or{" "}
          <code className="bg-gray-100 px-1 rounded">{"{ \"data\": [...] }"}</code>{" "}
          format. Drag & drop also supported.
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/*  Main Page                                      */
/* ─────────────────────────────────────────────── */

export default function LiveTendersFromTenderIds() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [pageLimit, setPageLimit] = useState(
    Number(searchParams.get("limit")) || 20
  );

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 450);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Sync query params
  useEffect(() => {
    const p = new URLSearchParams();
    p.set("page", currentPage);
    p.set("limit", pageLimit);
    setSearchParams(p, { replace: true });
  }, [currentPage, pageLimit]);

  const { tenders, loading, tendersCount, setReload } = useLiveTenders(
    debouncedSearch,
    currentPage,
    pageLimit
  );

  const skeleton = new Array(Math.min(pageLimit, 8)).fill(0);

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("এই tender delete করতে চান?")) return;
    const toastId = toast.loading("Deleting…");
    try {
      await axios.delete(`${LIVE_TENDERS_API}/${id}`);
      toast.dismiss(toastId);
      toast.success("Deleted ✓");
      setReload((r) => r + 1);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err?.response?.data?.message ?? "Delete failed");
    }
  };

  return (
    <div className="px-1 pb-10">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <AlignJustify size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Live Tenders</h1>
            <p className="text-xs text-gray-500">
              {loading ? "Loading…" : `Total ${tendersCount} records`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tender ID / Title / Organization…"
              className="pl-8 h-9 text-sm w-64"
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

          {/* Refresh */}
          <button
            onClick={() => setReload((r) => r + 1)}
            title="Refresh"
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>

          {/* Import toggle */}
          <Button
            onClick={() => setShowImport((v) => !v)}
            variant={showImport ? "default" : "outline"}
            className="h-9 text-sm gap-1.5"
          >
            <FileJson size={14} />
            JSON Import
          </Button>
        </div>
      </div>

      {/* ── Import Panel ── */}
      {showImport && (
        <JsonImportPanel onImportDone={() => setReload((r) => r + 1)} />
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-4 py-3 text-left whitespace-nowrap rounded-tl-xl w-10">
                #
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">
                Tender ID
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap min-w-[220px]">
                Title / Nature
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap min-w-[200px]">
                Ministry / Org / PE
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                Type / Method
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                Publishing
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                Closing
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap rounded-tr-xl">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              skeleton.map((_, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  {Array(8)
                    .fill(0)
                    .map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div
                          className={`h-4 rounded animate-pulse ${idx % 2 === 0 ? "bg-gray-200" : "bg-gray-100"
                            }`}
                        />
                      </td>
                    ))}
                </tr>
              ))
            ) : tenders?.length > 0 ? (
              tenders.map((item, idx) => (
                <tr
                  key={item?._id ?? idx}
                  className={`border-b border-gray-100 hover:bg-blue-50/40 transition-colors ${idx % 2 === 1 ? "bg-gray-50/60" : ""
                    }`}
                >
                  {/* # */}
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {(currentPage - 1) * pageLimit + idx + 1}
                  </td>

                  {/* Tender ID */}
                  <td className="px-4 py-3 font-mono font-semibold text-indigo-700 whitespace-nowrap">
                    {item?.tenderId ?? "—"}
                  </td>

                  {/* Title / Nature */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 leading-snug line-clamp-2 max-w-[280px]">
                      {item?.title ?? "—"}
                    </p>
                    {item?.procurementNature && (
                      <div className="mt-1">
                        <Badge label={item.procurementNature} />
                      </div>
                    )}
                  </td>

                  {/* Ministry / Org / PE */}
                  <td className="px-4 py-3 text-xs text-gray-700 leading-relaxed max-w-[220px]">
                    {item?.ministry && (
                      <p className="text-gray-500">{item.ministry}</p>
                    )}
                    {item?.organization && (
                      <p className="font-medium">{item.organization}</p>
                    )}
                    {item?.pe && (
                      <p className="text-gray-500">{item.pe}</p>
                    )}
                  </td>

                  {/* Type / Method */}
                  <td className="px-4 py-3 text-center text-xs whitespace-nowrap">
                    <p className="font-medium text-gray-700">{item?.type ?? "—"}</p>
                    <p className="text-gray-500 text-[11px]">
                      {item?.method ?? ""}
                    </p>
                  </td>

                  {/* Publishing */}
                  <td className="px-4 py-3 text-center text-xs whitespace-nowrap text-gray-700">
                    <p>{item?.publishingDate ?? "—"}</p>
                    {item?.publishingTime && (
                      <p className="text-gray-500">{item.publishingTime}</p>
                    )}
                  </td>

                  {/* Closing */}
                  <td className="px-4 py-3 text-center text-xs whitespace-nowrap">
                    <p className="font-medium text-red-600">
                      {item?.closingDate ?? "—"}
                    </p>
                    {item?.closingTime && (
                      <p className="text-red-400">{item.closingTime}</p>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(item?._id)}
                      title="Delete"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-16 text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <AlignJustify size={32} className="opacity-30" />
                    <p className="text-sm">No tenders found</p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="text-xs text-indigo-500 hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
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
}
