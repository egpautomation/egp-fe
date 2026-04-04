// @ts-nocheck

import config from "@/lib/config";
import { useEffect, useState } from "react";

const useAllSimilarRateSOR = (itemCode, descriptionOfItem) => {
 
  const [sors, setSors] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${config.apiBaseUrl}/sor/similar-rates?itemCode=${itemCode || ""}&descriptionOfItem=${descriptionOfItem || ""}`
        );
        const data = await response.json();
        setSors(data?.data);
        setCount(data?.count);
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload, itemCode, descriptionOfItem]);

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

export default useAllSimilarRateSOR;
