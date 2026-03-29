// @ts-nocheck

import config from "@/lib/config";
import { useEffect, useState } from "react";

const useAllSOR = (searchTerm, page, limit) => {
  const [sors, setSors] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
       
        
        const response = await fetch(
          `${config.apiBaseUrl}/sor?departmentShortName=${searchTerm?.departmentShortName || ""}&itemCode=${searchTerm?.itemCode || ""}&description=${searchTerm?.description || ""}&page=${page}&limit=${limit}`
        );
        const data = await response.json();
        console.log(data);
        setSors(data?.data);
        setCount(data?.count);
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload, searchTerm]);

  return {
    sors,
    setSors,
    count,
    setCount,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useAllSOR;
