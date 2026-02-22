// @ts-nocheck
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AlignJustify, X, Search, RefreshCw, Eye, Plus, CheckCircle, AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import Pagination from "@/shared/Pagination/Pagination";
import useLiveTenders from "@/hooks/useLiveTenders";
import { formatDate } from "@/lib/formateDate";
import axiosInstance from "@/lib/axiosInstance";

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

/**
 * useTenderIdMap
 * Fetches ALL stored tenders (up to 2000) and returns a Map<tenderId, _id>
 * so we can quickly look up whether a live-tender exists in the DB.
 */
function useTenderIdMap() {
    const [tenderIdMap, setTenderIdMap] = useState(new Map());
    const [mapLoading, setMapLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const fetchMap = async () => {
            try {
                setMapLoading(true);
                // Fetch a large batch — adjust limit if you have more tenders
                const res = await axiosInstance.get(`/tenders?limit=2000&page=1`);
                const list = res.data?.data ?? [];
                if (!cancelled) {
                    const map = new Map();
                    list.forEach((t) => {
                        if (t?.tenderId && t?._id) {
                            map.set(String(t.tenderId).trim(), t._id);
                        }
                    });
                    setTenderIdMap(map);
                }
            } catch (err) {
                console.error("useTenderIdMap: fetch failed", err);
            } finally {
                if (!cancelled) setMapLoading(false);
            }
        };
        fetchMap();
        return () => { cancelled = true; };
    }, []);

    return { tenderIdMap, mapLoading };
}

/* ── Main ── */
export default function LiveTender() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [tenderIdSearch, setTenderIdSearch] = useState("");
    const [debouncedTenderIdSearch, setDebouncedTenderIdSearch] = useState("");
    const [ministrySearch, setMinistrySearch] = useState("");
    const [debouncedMinistrySearch, setDebouncedMinistrySearch] = useState("");
    const [districtSearch, setDistrictSearch] = useState("");
    const [debouncedDistrictSearch, setDebouncedDistrictSearch] = useState("");
    const [typeMethodSearch, setTypeMethodSearch] = useState("");
    const [debouncedTypeMethodSearch, setDebouncedTypeMethodSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const [pageLimit, setPageLimit] = useState(Number(searchParams.get("limit")) || 20);

    // Debounce
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedTenderIdSearch(tenderIdSearch);
            setDebouncedMinistrySearch(ministrySearch);
            setDebouncedDistrictSearch(districtSearch);
            setDebouncedTypeMethodSearch(typeMethodSearch);
        }, 450);
        return () => clearTimeout(t);
    }, [tenderIdSearch, ministrySearch, districtSearch, typeMethodSearch]);

    // Sync URL params
    useEffect(() => {
        const p = new URLSearchParams();
        p.set("page", currentPage);
        p.set("limit", pageLimit);
        setSearchParams(p, { replace: true });
    }, [currentPage, pageLimit]);

    const { tenders, loading, tendersCount, setReload } = useLiveTenders(
        debouncedTenderIdSearch,
        debouncedMinistrySearch,
        debouncedDistrictSearch,
        debouncedTypeMethodSearch,
        currentPage,
        pageLimit
    );

    // Build tenderId → _id lookup map from stored tenders
    const { tenderIdMap, mapLoading } = useTenderIdMap();
    const [addingTenderId, setAddingTenderId] = useState(null);
    const [addStatus, setAddStatus] = useState({});

    const handleAddTender = async (tender) => {
        if (!tender?.tenderId) return;

        setAddingTenderId(tender.tenderId);
        setAddStatus(prev => ({ ...prev, [tender.tenderId]: null }));

        try {
            // Send complete tender data with all supported fields
            const payload = [{
                tenderId: tender.tenderId,
                BriefDescriptionofWorks: tender.BriefDescriptionofWorks || tender.title || '',
                organization: tender.organization || '',
                ProcurementType: tender.ProcurementType || tender.type || '',
                procurementMethod: tender.procurementMethod || tender.method || '',
                publicationDateTime: tender.publicationDateTime || tender.publishingDate || '',
                openingDateTime: tender.openingDateTime || tender.closingDate || '',
                locationDistrict: tender.locationDistrict || ''
            }];

            const response = await axiosInstance.post('/tenderIds/create-tenderIds', payload);

            if (response.data?.success) {
                setAddStatus(prev => ({ ...prev, [tender.tenderId]: 'success' }));
                // Refresh the tenderIdMap to include the newly added tender
                setTimeout(() => {
                    window.location.reload(); // Simple refresh to update the map
                }, 1000);
            } else {
                throw new Error(response.data?.message || 'Failed to add tender');
            }
        } catch (error) {
            console.error('Add tender error:', error);
            setAddStatus(prev => ({ ...prev, [tender.tenderId]: 'error' }));
        } finally {
            setTimeout(() => {
                setAddingTenderId(null);
            }, 2000);
        }
    };

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

            {/* Column Filters */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                        value={tenderIdSearch}
                        onChange={(e) => { setTenderIdSearch(e.target.value); setCurrentPage(1); }}
                        placeholder="Tender ID"
                        className="pl-8 h-9 text-sm"
                    />
                    {tenderIdSearch && (
                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                            onClick={() => setTenderIdSearch("")}
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>

                <Input
                    value={ministrySearch}
                    onChange={(e) => { setMinistrySearch(e.target.value); setCurrentPage(1); }}
                    placeholder="Ministry / Organization"
                    className="h-9 text-sm"
                />

                <Input
                    value={districtSearch}
                    onChange={(e) => { setDistrictSearch(e.target.value); setCurrentPage(1); }}
                    placeholder="District"
                    className="h-9 text-sm"
                />

                <Input
                    value={typeMethodSearch}
                    onChange={(e) => { setTypeMethodSearch(e.target.value); setCurrentPage(1); }}
                    placeholder="Type / Method"
                    className="h-9 text-sm"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-primary text-primary-foreground">
                            <th className="px-4 py-3 text-left whitespace-nowrap rounded-tl-xl w-10">#</th>
                            <th className="px-4 py-3 text-left whitespace-nowrap">Tender ID</th>
                            <th className="px-4 py-3 text-left whitespace-nowrap min-w-[220px]">Brief Description</th>
                            <th className="px-4 py-3 text-left whitespace-nowrap min-w-[200px]">Ministry / Org / PE</th>
                            <th className="px-4 py-3 text-left whitespace-nowrap">District</th>
                            <th className="px-4 py-3 text-center whitespace-nowrap">Type / Method</th>
                            <th className="px-4 py-3 text-center whitespace-nowrap">Publishing / Opening</th>
                            <th className="px-4 py-3 text-center whitespace-nowrap rounded-tr-xl">Action</th>
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
                            tenders.map((item, idx) => {
                                const matchedId = tenderIdMap.get(String(item?.tenderId ?? "").trim());
                                const isMatched = !!matchedId;

                                return (
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

                                        {/* Ministry / Org / PE */}
                                        <td className="px-4 py-3 text-xs text-gray-700 leading-relaxed max-w-[200px]">
                                            {item?.ministry && <p className="text-gray-500">{item.ministry}</p>}
                                            {item?.organization && <p className="font-medium">{item.organization}</p>}
                                            {item?.pe && <p className="text-gray-500">{item.pe}</p>}
                                        </td>

                                        {/* District */}
                                        <td className="px-4 py-3 text-xs text-gray-700">
                                            {item?.locationDistrict ? (
                                                <p className="font-medium text-indigo-600">{item.locationDistrict}</p>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>

                                        {/* Type / Method */}
                                        <td className="px-4 py-3 text-center text-xs whitespace-nowrap">
                                            <p className="font-medium text-gray-700">{item?.ProcurementType ?? item?.type ?? "—"}</p>
                                            <p className="text-gray-500 text-[11px]">{item?.procurementMethod ?? item?.method ?? ""}</p>
                                        </td>

                                        {/* Publishing / Opening */}
                                        <td className="px-4 py-3 text-center text-xs whitespace-nowrap">
                                            <p className="font-medium text-gray-700">
                                                {formatDate(item?.publicationDateTime ?? item?.publishingDate, "dd-MMM-yyyy hh:mm a")}
                                            </p>
                                            <p className="text-red-600 font-medium">
                                                {formatDate(item?.openingDateTime ?? item?.closingDate, "dd-MMM-yyyy hh:mm a")}
                                            </p>
                                        </td>

                                        {/* Action */}
                                        <td className="px-4 py-3 text-center whitespace-nowrap">
                                            {mapLoading ? (
                                                <div className="inline-block h-5 w-16 rounded animate-pulse bg-gray-200" />
                                            ) : isMatched ? (
                                                <button
                                                    onClick={() => navigate(`/dashboard/view-tender/${matchedId}`)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-sm"
                                                    title="View stored tender details"
                                                >
                                                    <Eye size={13} />
                                                    View
                                                </button>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1">
                                                    {addStatus[item?.tenderId] === 'success' && (
                                                        <CheckCircle size={16} className="text-green-500" title="Successfully added" />
                                                    )}
                                                    {addStatus[item?.tenderId] === 'error' && (
                                                        <AlertCircle size={16} className="text-red-500" title="Failed to add" />
                                                    )}
                                                    <button
                                                        onClick={() => handleAddTender(item)}
                                                        disabled={addingTenderId === item?.tenderId || addStatus[item?.tenderId] === 'success'}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all shadow-sm ${addingTenderId === item?.tenderId || addStatus[item?.tenderId] === 'success'
                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                : 'border border-indigo-300 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400'
                                                            }`}
                                                        title={addStatus[item?.tenderId] === 'success' ? "Already added" : "Add to tender IDs"}
                                                    >
                                                        <Plus size={13} />
                                                        {addingTenderId === item?.tenderId ? 'Adding...' : addStatus[item?.tenderId] === 'success' ? 'Added' : 'Add'}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-16 text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <AlignJustify size={32} className="opacity-30" />
                                        <p className="text-sm">No tenders found</p>
                                        {(tenderIdSearch || ministrySearch || districtSearch || typeMethodSearch) && (
                                            <button
                                                onClick={() => {
                                                    setTenderIdSearch("");
                                                    setMinistrySearch("");
                                                    setDistrictSearch("");
                                                    setTypeMethodSearch("");
                                                }}
                                                className="text-xs text-indigo-500 hover:underline"
                                            >
                                                Clear filters
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
