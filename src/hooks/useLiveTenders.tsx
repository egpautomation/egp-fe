// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/formateDate";

const LIVE_TENDERS_API = `${config.apiBaseUrl}/live-tenders`;

const useLiveTenders = (
    searchTerm = "",
    ministry = "",
    district = "",
    typeMethod = "",
    page = 1,
    limit = 20,
    publishingDate = ""
) => {
    const [allTenders, setAllTenders] = useState([]);
    const [tenders, setTenders] = useState([]);
    const [tendersCount, setTendersCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(0);

    // 1. Fetch ALL data once (or on manual reload)
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                // Fetch a large enough limit to get all live tenders
                const url = `${LIVE_TENDERS_API}?limit=10000&page=1`;
                const response = await fetch(url);
                const data = await response.json();

                const list =
                    data?.data ??
                    data?.tenders ??
                    data?.result ??
                    (Array.isArray(data) ? data : []);

                setAllTenders(list);
            } catch (error) {
                console.error("Error fetching live tenders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [reload]);

    // 2. Perform client-side filtering and pagination whenever filters or page change
    useEffect(() => {
        if (!allTenders || allTenders.length === 0) {
            setTenders([]);
            setTendersCount(0);
            return;
        }

        // Apply filters
        const s = searchTerm.trim().toLowerCase();
        const m = ministry.trim().toLowerCase();
        const d = district.trim().toLowerCase();
        const t = typeMethod.trim().toLowerCase();
        const pDate = publishingDate.trim().toLowerCase();

        const filtered = allTenders.filter((item) => {
            // Search term (Tender ID, Title, etc.)
            const idStr = String(item?.tenderId || "").toLowerCase();
            const descStr = String(item?.BriefDescriptionofWorks || item?.title || "").toLowerCase();
            const orgStrMatch = String(item?.organization || "").toLowerCase();
            const searchMatch = !s || idStr.includes(s) || descStr.includes(s) || orgStrMatch.includes(s);

            // Ministry / Org
            const ministryValue = String(item?.ministry || item?.organization || "").toLowerCase();
            const ministryMatch = !m || ministryValue.includes(m);

            // District
            const districtValue = String(item?.locationDistrict || "").toLowerCase();
            const districtMatch = !d || districtValue.includes(d);

            // Type / Method
            const typeMethodValue = String(`${item?.ProcurementType || item?.type || ""} ${item?.procurementMethod || item?.method || ""}`).toLowerCase();
            const typeMethodMatch = !t || typeMethodValue.includes(t);

            // Publishing Date (robust date comparison against "dd-MMM-yyyy" format from API `item?.publicationDateTime`)
            let publishingDateMatch = true;
            if (publishingDate) {
                try {
                    const itemPublishing = item?.publicationDateTime || item?.publishingDate || "";
                    if (itemPublishing) {
                        const parsedItemDate = formatDate(itemPublishing, "dd-MMM-yyyy").toLowerCase();
                        publishingDateMatch = parsedItemDate === pDate;
                    } else {
                        publishingDateMatch = false;
                    }
                } catch (e) {
                    publishingDateMatch = false;
                }
            }

            return searchMatch && ministryMatch && districtMatch && typeMethodMatch && publishingDateMatch;
        });

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedSlice = filtered.slice(startIndex, endIndex);

        setTenders(paginatedSlice);
        setTendersCount(filtered.length);
    }, [allTenders, searchTerm, ministry, district, typeMethod, page, limit, publishingDate]);

    return {
        allTenders,
        tenders,
        setTenders,
        tendersCount,
        setTendersCount,
        loading,
        setLoading,
        reload,
        setReload,
    };
};

export default useLiveTenders;
export { LIVE_TENDERS_API };
