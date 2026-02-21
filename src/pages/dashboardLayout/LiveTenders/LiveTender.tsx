// @ts-nocheck
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlignJustify, X, Search, RefreshCw } from "lucide-react";

import { Input } from "@/components/ui/input";
import Pagination from "@/shared/Pagination/Pagination";
import useLiveTenders from "@/hooks/useLiveTenders";
import { formatDate } from "@/lib/formateDate";

/* ── Badge ── */
const natureColors = {
    Goods: "bg-emerald-100 text-emerald-800",
    Works: "bg-blue-100 text-blue-800",
    Services: "bg-violet-100 text-violet-800",
    default: "bg-gray-100 text-gray-700",
};
function Badge({ label }) {
    const cls = natureColors[label] ?? natureColors.default;
    return (
        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
            {label}
        </span>
    );
}

/* ── Main ── */
export default function LiveTender() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const [pageLimit, setPageLimit] = useState(Number(searchParams.get("limit")) || 20);

    // Debounce
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm), 450);
        return () => clearTimeout(t);
    }, [searchTerm]);

    // Sync URL params
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

    return (
        <div className="px-1 pb-10">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <AlignJustify size={20} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-tight">Live Tender</h1>
                        <p className="text-xs text-gray-500">
                            {loading ? "Loading…" : `Total ${tendersCount} records`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="Tender ID / Description / Organization…"
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
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-primary text-primary-foreground">
                            <th className="px-4 py-3 text-left whitespace-nowrap rounded-tl-xl w-10">#</th>
                            <th className="px-4 py-3 text-left whitespace-nowrap">Tender ID</th>
                            <th className="px-4 py-3 text-left whitespace-nowrap min-w-[220px]">Brief Description</th>
                            <th className="px-4 py-3 text-left whitespace-nowrap min-w-[200px]">Ministry / Org / PE / Location</th>
                            <th className="px-4 py-3 text-center whitespace-nowrap">Type / Method</th>
                            <th className="px-4 py-3 text-center whitespace-nowrap">Publishing</th>
                            <th className="px-4 py-3 text-center whitespace-nowrap rounded-tr-xl">Opening</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            skeleton.map((_, idx) => (
                                <tr key={idx} className="border-b border-gray-100">
                                    {Array(7).fill(0).map((_, j) => (
                                        <td key={j} className="px-4 py-3">
                                            <div className={`h-4 rounded animate-pulse ${idx % 2 === 0 ? "bg-gray-200" : "bg-gray-100"}`} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : tenders?.length > 0 ? (
                            tenders.map((item, idx) => (
                                <tr
                                    key={item?._id ?? idx}
                                    className={`border-b border-gray-100 hover:bg-blue-50/40 transition-colors ${idx % 2 === 1 ? "bg-gray-50/60" : ""}`}
                                >
                                    {/* # */}
                                    <td className="px-4 py-3 text-gray-500 text-xs">
                                        {(currentPage - 1) * pageLimit + idx + 1}
                                    </td>

                                    {/* Tender ID */}
                                    <td className="px-4 py-3 font-mono font-semibold text-indigo-700 whitespace-nowrap">
                                        {item?.tenderId ?? "—"}
                                    </td>

                                    {/* Description / Nature */}
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-800 leading-snug line-clamp-2 max-w-[280px]">
                                            {item?.BriefDescriptionofWorks ?? item?.title ?? "—"}
                                        </p>
                                        {item?.procurementNature && (
                                            <div className="mt-1">
                                                <Badge label={item.procurementNature} />
                                            </div>
                                        )}
                                    </td>

                                    {/* Ministry / Org / PE / Location */}
                                    <td className="px-4 py-3 text-xs text-gray-700 leading-relaxed max-w-[220px]">
                                        {item?.ministry && <p className="text-gray-500">{item.ministry}</p>}
                                        {item?.organization && <p className="font-medium">{item.organization}</p>}
                                        {item?.pe && <p className="text-gray-500">{item.pe}</p>}
                                        {item?.locationDistrict && (
                                            <p className="text-indigo-600 font-medium">District: {item.locationDistrict}</p>
                                        )}
                                    </td>

                                    {/* Type / Method */}
                                    <td className="px-4 py-3 text-center text-xs whitespace-nowrap">
                                        <p className="font-medium text-gray-700">{item?.ProcurementType ?? item?.type ?? "—"}</p>
                                        <p className="text-gray-500 text-[11px]">{item?.procurementMethod ?? item?.method ?? ""}</p>
                                    </td>

                                    {/* Publishing */}
                                    <td className="px-4 py-3 text-center text-xs whitespace-nowrap text-gray-700">
                                        {formatDate(item?.publicationDateTime ?? item?.publishingDate, "dd-MMM-yyyy hh:mm a")}
                                    </td>

                                    {/* Opening/Closing */}
                                    <td className="px-4 py-3 text-center text-xs whitespace-nowrap">
                                        <p className="font-medium text-red-600">
                                            {formatDate(item?.openingDateTime ?? item?.closingDate, "dd-MMM-yyyy hh:mm a")}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-16 text-gray-400">
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

            {/* Pagination */}
            {tendersCount > 0 && (
                <Pagination
                    data={{ pageLimit, setCurrentPage, setPageLimit, count: tendersCount, currentPage }}
                />
            )}
        </div>
    );
}
