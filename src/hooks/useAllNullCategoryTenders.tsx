// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState } from "react";

const useAllNullCategoryTenders = (
  searchTerm = "",
  method = "",
  page = 1,
  limit = 20
) => {
  const [tenders, setTenders] = useState([]);
  const [tendersCount, setTendersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      // https://egpserver.jubairahmad.com
      try {
        setLoading(true);
        const url = `${config.apiBaseUrl}/tenders/tender-null-category?searchTerm=${searchTerm}&method=${method}&page=${page}&limit=${limit}`;
        const response = await fetch(url);
        const data = await response.json();
        setTenders(data?.data);
        setTendersCount(data?.count);
        
      } catch (error) {
        console.log(error)
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  
  }, [reload, searchTerm, method, page, limit]);

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

export default useAllNullCategoryTenders;
