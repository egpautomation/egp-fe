// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState } from "react";

const useMyJobOrdersCounts = (user) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        // https://egp-tender-automation-server.vercel.app
        // https://egpserver.jubairahmad.com
        const url = `${config.apiBaseUrl}/jobOrder/user/count?user=${user}`;
        const response = await fetch(url);
        const data = await response.json();
        setData(data?.data);
        
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload, user]);

  return {
    data,
    setData,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useMyJobOrdersCounts;
