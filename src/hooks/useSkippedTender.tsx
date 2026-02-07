// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState } from "react";

const useSkippedTenders = (
  searchTerm = "",
  page = 1,
  limit = 50
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
        const url = `${config.apiBaseUrl}/tenders/skipped-tenders?searchTerm=${searchTerm}&page=${page}&limit=${limit}`;
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
  
  }, [reload, searchTerm,  page, limit]);

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

export default useSkippedTenders;
