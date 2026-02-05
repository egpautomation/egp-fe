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
        const response = await import("@/lib/axiosInstance").then(m => m.default.get(
          `/tenders?searchTerm=${searchTerm}&from=${from}&to=${to}&method=${method}&department=${department}&category=${category}&location=${location}&page=${page}&limit=${limit}`
        ));
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

  return {
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
