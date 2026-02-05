// @ts-nocheck
import { useEffect, useState } from "react";

const useMyJobOrders = (searchTerm, user, page = 1, limit = 20, status = "all") => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 20,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        // https://egp-tender-automation-server.vercel.app
        // https://egpserver.jubairahmad.com
        const statusParam = status === "all" ? "" : `&status=${status}`;
        const url = `https://egpserver.jubairahmad.com/api/v1/jobOrder/user?searchTerm=${searchTerm}&user=${user}&page=${page}&limit=${limit}${statusParam}`;
        const response = await fetch(url);
        const result = await response.json();

        setData(result?.data || []);
        setCount(result?.pagination?.totalCount || 0);
        setPagination(result?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          limit: 20,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload, searchTerm, user, page, limit, status]);

  return {
    data,
    setData,
    count,
    setCount,
    reload,
    setLoading,
    setReload,
    loading,
    pagination,
  };
};

export default useMyJobOrders;
