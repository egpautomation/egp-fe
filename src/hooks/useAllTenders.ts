// @ts-nocheck
import { useEffect, useState } from "react";

const useAllTenders = (
  searchTerm = "",
  from = "",
  to = "",
  method = "",
  department = "",
  category = "",
  location = "",
  page = 1,
  limit = 20
) => {
  const [tenders, setTenders] = useState([]);
  const [tendersCount, setTendersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {

    const result = async () => {
      try {
        setLoading(true);
        // Clean up department names by removing "(XXX)" because backend regex search fails on unescaped parentheses
        const cleanDepartment = department
          ? department
            .split(",")
            .map((d) => d.replace(/\s*\([^)]*\)/g, "").trim())
            .join(",")
          : "";

        const response = await import("@/lib/axiosInstance").then(m => m.default.get('/tenders', {
          params: {
            searchTerm,
            from,
            to,
            method,
            department: cleanDepartment,
            category,
            location,
            page,
            limit
          }
        }));
        setTenders(response.data?.data);
        setTendersCount(response.data?.count);
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [
    reload,
    searchTerm,
    from,
    to,
    method,
    department,
    category,
    location,
    page,
    limit,
  ]);

  const fetchAllTenders = async () => {
    try {
      const cleanDepartment = department
        ? department
          .split(",")
          .map((d) => d.replace(/\s*\([^)]*\)/g, "").trim())
          .join(",")
        : "";

      const response = await import("@/lib/axiosInstance").then(m => m.default.get('/tenders', {
        params: {
          searchTerm,
          from,
          to,
          method,
          department: cleanDepartment,
          category,
          location,
          page: 1,
          limit: 10000
        }
      }));
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching all tenders for print:", error);
      return [];
    }
  };

  return {
    fetchAllTenders,
    tenders,
    setTenders,
    tendersCount,
    setTendersCount,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useAllTenders;
