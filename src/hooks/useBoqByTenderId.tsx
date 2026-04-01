// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState } from "react";

const useAllTenderIDBOQ = (tenderId) => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        // https://egp-tender-automation-server.vercel.app
        // const url = `${config.apiBaseUrl}/boq/tenderId/tenderId=${tenderId}`;
        const url = `http://localhost:5000/api/v1/boq/tenderId/${tenderId}`;
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
  }, [tenderId, reload]);

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

export default useAllTenderIDBOQ;
