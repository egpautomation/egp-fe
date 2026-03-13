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
  procurementNature = "",
  page = 1,
  limit = 20,
  dateType = "documentLastSelling"
) => {
  const [tenders, setTenders] = useState([]);
  const [tendersCount, setTendersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {

    const result = async () => {
      try {
        setLoading(true);
        const depList = department.includes("||") ? department.split("||") : department.split(",");
        const cleanDepartment = department
          ? depList
            .map((d) => {
              let trimmed = d.replace(/\s*\([^)]*\)/g, "").trim();
              return trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            })
            .join("|")
          : "";

        const catList = category.includes("||") ? category.split("||") : category.split(",");
        const cleanCategory = category
          ? catList
            .map((c) => c.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join("|")
          : "";

        const response = await import("@/lib/axiosInstance").then(m => m.default.get('/tenders', {
          params: {
            searchTerm,
            from,
            to,
            method: method.includes("||") ? method.split("||").join(",") : method,
            department: cleanDepartment,
            category: cleanCategory,
            location: location.includes("||") ? location.split("||").join(",") : location,
            procurementNature: procurementNature.includes("||") ? procurementNature.split("||").join(",") : procurementNature,
            page,
            limit,
            dateType
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
    procurementNature,
    page,
    limit,
    dateType,
  ]);

  const fetchAllTenders = async () => {
    try {
      const depList = department.includes("||") ? department.split("||") : department.split(",");
      const cleanDepartment = department
        ? depList
          .map((d) => {
            let trimmed = d.replace(/\s*\([^)]*\)/g, "").trim();
            return trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          })
          .join("|")
        : "";

      const catList = category.includes("||") ? category.split("||") : category.split(",");
      const cleanCategory = category
        ? catList
          .map((c) => c.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join("|")
        : "";

      const response = await import("@/lib/axiosInstance").then(m => m.default.get('/tenders', {
        params: {
          searchTerm,
          from,
          to,
          method: method.includes("||") ? method.split("||").join(",") : method,
          department: cleanDepartment,
          category: cleanCategory,
          location: location.includes("||") ? location.split("||").join(",") : location,
          procurementNature: procurementNature.includes("||") ? procurementNature.split("||").join(",") : procurementNature,
          page: 1,
          limit: 10000,
          dateType
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
