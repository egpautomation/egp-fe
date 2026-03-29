// @ts-nocheck
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

const useByPassReport = (page, limit) => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters - only page and limit
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        // Backend will extract user email from JWT token automatically
        const url = `/jobOrder/by-pass-report?${params.toString()}`;
        const response = await axiosInstance.get(url);

        // Destructure response: { success, data, count }
        const { success, data: responseData, count: responseCount } = response.data || {};

        // Validate response structure
        if (success !== undefined) {
          // Ensure data is always an array
          const dataArray = Array.isArray(responseData) ? responseData : [];
          const countValue = typeof responseCount === "number" ? responseCount : dataArray.length;

          setData(dataArray);
          setCount(countValue);
        } else {
          // Fallback for unexpected response structure
          console.warn("Unexpected API response structure:", response.data);
          setData(Array.isArray(response.data?.data) ? response.data.data : []);
          setCount(response.data?.count || 0);
        }
      } catch (error) {
        console.error("Error fetching by-pass-report:", error);
        setError(
          error?.response?.data?.message || error?.message || "Failed to fetch bypass report"
        );
        setData([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    result();
  }, [reload, page, limit]);

  return {
    data,
    setData,
    count,
    setCount,
    reload,
    setLoading,
    setReload,
    loading,
    error,
  };
};

export default useByPassReport;
