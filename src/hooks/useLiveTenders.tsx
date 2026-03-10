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

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                });
                
                const s = searchTerm.trim();
                const m = ministry.trim();
                const d = district.trim();
                const t = typeMethod.trim();
                const pDate = publishingDate.trim();

                if (s) queryParams.append('search', s);
                if (t) queryParams.append('method', t); 
                if (m) queryParams.append('organization', m);
                if (d) queryParams.append('locationDistrict', d);
                if (pDate) queryParams.append('publicationDateTime', pDate);

                const url = `${LIVE_TENDERS_API}?${queryParams.toString()}`;
                const response = await fetch(url);
                const data = await response.json();

                const list =
                    data?.data ??
                    data?.tenders ??
                    data?.result ??
                    (Array.isArray(data) ? data : []);

                setTenders(list);
                setTendersCount(data?.total || list.length);
                setAllTenders(list); // Keep interface for compatibility
            } catch (error) {
                console.error("Error fetching live tenders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [reload, searchTerm, ministry, district, typeMethod, page, limit, publishingDate]);

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
