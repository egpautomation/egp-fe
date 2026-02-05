// @ts-nocheck
import TenderCategories from "@/pages/dashboardLayout/TenderCategories/TenderCategories";
import { useEffect, useState } from "react";

const useAllTenderCategories = (
  
) => {
  const [categories, setTenderCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        // https://egpserver.jubairahmad.com
        const url = `https://egpserver.jubairahmad.com/api/v1/tender-categories`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        setTenderCategories(data?.data);
        setCount(data?.count);
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload,]);

  return {
    categories,
    setTenderCategories,
    count,
    setCount,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useAllTenderCategories;
