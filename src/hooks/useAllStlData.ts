// @ts-nocheck

import config from "@/lib/config";
import { useEffect, useState } from "react";

const useAllStlData = () => {
  const [stlData, setStlData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/stl/all`);
        const data = await response.json();
        setStlData(data?.data || []);
      } catch (error) {
        console.error("Error fetching STL data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reload]);

  return {
    stlData,
    setStlData,
    loading,
    reload,
    setReload,
  };
};

export default useAllStlData;
