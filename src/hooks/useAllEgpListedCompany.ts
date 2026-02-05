// @ts-nocheck
import { useEffect, useState } from "react";

const useAllEgpListedCompanies = (searchTerm) => {
  const [egpListedCompanies, setEgpListedCompanies] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        // https://egp-tender-automation-server.vercel.app
        // https://egpserver.jubairahmad.com
        const url = `https://egpserver.jubairahmad.com/api/v1/egp-listed-company?searchTerm=${encodeURIComponent(searchTerm)}`;
        const response = await fetch(url);
        const data = await response.json();

        setEgpListedCompanies(data?.data);
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
    egpListedCompanies,
    setEgpListedCompanies,
    count,
    setCount,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useAllEgpListedCompanies;
