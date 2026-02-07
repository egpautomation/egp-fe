// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState } from "react";

const useAllMethodTenders = (
  method,
  searchTerm="",
  from="",
  to="",
  department="",
  category="",
  location="",
  page=1,
  limit=20
) => {
  const [tenders, setTenders] = useState([]);
  const [tendersCount, setTendersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        // https://egp-tender-automation-server.vercel.app
        // https://egpserver.jubairahmad.com

        const url = `${config.apiBaseUrl}/tenders/method/${method}?searchTerm=${searchTerm}&from=${from}&to=${to}&department=${department}&category=${category}&location=${location}&page=${page}&limit=${limit}`;
        const response = await fetch(url);
        const data = await response.json();
        setTenders(data?.data);
        setTendersCount(data?.count);
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload, searchTerm, from, to, method, department, category,location, page, limit]);

  return {
    tenders,
    setTenders,
    tendersCount,
    setTendersCount,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useAllMethodTenders;
