// @ts-nocheck
import { useEffect, useState } from "react";

const useAllJobOrders = (searchTerm, page = 1, limit = 20, status = "all") => {
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
        const url = `https://egpserver.jubairahmad.com/api/v1/jobOrder?searchTerm=${searchTerm}&page=${page}&limit=${limit}${statusParam}`;
        const response = await fetch(url);
        const apiResult = await response.json();

        // Since backend returns all data, we need to implement client-side pagination
        const allData = apiResult?.data || [];

        // Apply status filter on client-side
        const filteredData = status === "all"
          ? allData
          : allData.filter(item => item.status === status);

        const totalCount = filteredData.length;

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        // Slice data for current page
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setData(paginatedData);
        setCount(totalCount);
        setPagination({
          currentPage: page,
          totalPages: totalPages,
          totalCount: totalCount,
          limit: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        });
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload, searchTerm, page, limit, status]);

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

export default useAllJobOrders;
