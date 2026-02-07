// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState } from "react";

const useAllTutorialsCategories = (searchTerm = "", page = 1, limit = 20) => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      // https://egpserver.jubairahmad.com
      try {
        setLoading(true);
        const url = `${config.apiBaseUrl}/tutorials-categories?searchTerm=${searchTerm}&page=${page}&limit=${limit}`;
        const response = await fetch(url);
        const data = await response.json();
        setData(data?.data);
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
    data,
    setData,
    count,
    setCount,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useAllTutorialsCategories;
