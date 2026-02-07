// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState } from "react";

const useAllTenderCategoriesWithPagination = (searchTerm, page, limit) => {
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        // https://egp-tender-automation-server.vercel.app
        const url = `${config.apiBaseUrl}/tender-categories/with-pagination?searchTerm=${searchTerm}&page=${page}&limit=${limit}`;
        const response = await fetch(url);
        const data = await response.json();
        
        setCategories(data?.data);
        setCount(data?.count);
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload, searchTerm, page, limit]);

  return {
    categories,
    setCategories,
    count,
    setCount,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useAllTenderCategoriesWithPagination;
