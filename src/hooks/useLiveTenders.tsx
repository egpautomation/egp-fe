// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState } from "react";

const LIVE_TENDERS_API = `${config.apiBaseUrl}/live-tenders`;

const useLiveTenders = (searchTerm = "", page = 1, limit = 20) => {
    const [tenders, setTenders] = useState([]);
    const [tendersCount, setTendersCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const url = `${LIVE_TENDERS_API}?searchTerm=${encodeURIComponent(
                    searchTerm
                )}&page=${page}&limit=${limit}`;
                const response = await fetch(url);
                const data = await response.json();

                // Handle: { data: [...], total/count: N }  or  [...] directly
                // or  { tenders: [...] }  or  { result: [...] }
                const list =
                    data?.data ??
                    data?.tenders ??
                    data?.result ??
                    (Array.isArray(data) ? data : []);

                const count =
                    data?.total ??
                    data?.count ??
                    data?.totalCount ??
                    list.length ??
                    0;

                setTenders(list);
                setTendersCount(count);
            } catch (error) {
                console.error("Error fetching live tenders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [reload, searchTerm, page, limit]);

    return {
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
