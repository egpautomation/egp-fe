// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState } from "react";

const useAllPromoCodes = ( searchTerm) => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        // https://egp-tender-automation-server.vercel.app
        // https://egpserver.jubairahmad.com
        const url = `${config.apiBaseUrl}/promoCode?searchTerm=${searchTerm}`;
        const response = await fetch(url);
        const data = await response.json();

        setPromoCodes(data?.data);
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
    promoCodes,
    setPromoCodes,
    count,
    setCount,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useAllPromoCodes;
