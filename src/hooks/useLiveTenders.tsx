import { useEffect, useState } from "react";
import { config } from "@/lib/config";
import axiosInstance from "@/lib/axiosInstance";

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
        const params: any = {
          page,
          limit,
        };

        const s = searchTerm.trim();
        const m = ministry.trim();
        const d = district.trim();
        const t = typeMethod.trim();
        const pDate = publishingDate.trim();

        if (s) params.searchTerm = s;
        if (t) params.method = t;
        if (m) params.organization = m;
        if (d) params.locationDistrict = d;
        if (pDate) params.publicationDateTime = pDate;

        const response = await axiosInstance.get("/live-tenders", { params });
        const data = response.data;

        const list =
          data?.data?.tenders ??
          data?.tenders ??
          data?.result ??
          (Array.isArray(data?.data) ? data.data : []);

        setTenders(list);
        setTendersCount(data?.data?.total || data?.total || list.length);
        setAllTenders(list);
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
