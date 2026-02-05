// @ts-nocheck

import { useEffect, useState } from "react";

const useFormattedTendersTTI = (currentPage, pageLimit) => {
  const [tenders, setTenders] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        // https://egp-tender-automation-server.vercel.app
        // https://egpserver.jubairahmad.com
        const url = `https://egpserver.jubairahmad.com/api/v1/tti-dataEntry?page=${currentPage}&limit=${pageLimit}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.data);
        setTenders(data?.data);
        setCount(data?.count);
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload, currentPage, pageLimit]);

  return {
    tenders,
    setTenders,
    count,
    setCount,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useFormattedTendersTTI;
