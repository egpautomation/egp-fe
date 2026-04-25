// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState, useMemo } from "react";

const useMyOtmBypassReports = (searchTerm, _userEmail, page = 1, limit = 20, status = "all") => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${config.apiBaseUrl}/otm-bypass-report`;
        const response = await fetch(url);
        const result = await response.json();
        setAllData(result?.data || []);
      } catch (error) {
        console.error("Error fetching OTM Bypass reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reload]);

  const filtered = useMemo(() => {
    let items = [...allData];

    if (status && status !== "all") {
      items = items.filter((item) => item?.status === status);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item?.tender_id?.toLowerCase().includes(term) ||
          item?.invoice_no?.toLowerCase().includes(term) ||
          item?.company_name?.toLowerCase().includes(term)
      );
    }

    return items;
  }, [allData, status, searchTerm]);

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  const pagination = {
    currentPage: page,
    totalPages,
    totalCount,
    limit,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return { data, loading, reload, setReload, pagination };
};

export default useMyOtmBypassReports;
