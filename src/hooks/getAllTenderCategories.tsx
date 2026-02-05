// @ts-nocheck
import { useEffect, useState } from "react";

const useAllTenderCategories = () => {
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        // https://egp-tender-automation-server.vercel.app
        const url = `https://egpserver.jubairahmad.com/api/v1/tenders/tender-categories`;
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
  }, [reload]);

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

export default useAllTenderCategories;
