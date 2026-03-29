// @ts-nocheck
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

const useUsersCompanyMigration = (user, searchTerm) => {
  const [companyMigrations, setCompanyMigration] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        const url = `/companyMigration/user?searchTerm=${searchTerm}&user=${user}`;
        const response = await axiosInstance.get(url);
        const data = response.data;

        setCompanyMigration(data?.data);
        setCount(data?.count);
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload, searchTerm, user]);

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

export default useUsersCompanyMigration;
