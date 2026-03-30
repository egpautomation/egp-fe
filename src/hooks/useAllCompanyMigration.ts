// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState } from "react";

const useAllCompanyMigration = (searchTerm) => {
  const [companyMigrations, setCompanyMigration] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        // https://egp-tender-automation-server.vercel.app
        // https://egpserver.jubairahmad.com
        const url = `${config.apiBaseUrl}/companyMigration?searchTerm=${searchTerm}`;
        const response = await fetch(url);
        const data = await response.json();

        setCompanyMigration(data?.data);
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
    companyMigrations,
    setCompanyMigration,
    count,
    setCount,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useAllCompanyMigration;
