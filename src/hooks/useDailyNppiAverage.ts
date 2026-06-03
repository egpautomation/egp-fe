// @ts-nocheck
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { config } from "@/lib/config";

interface DailyNppiData {
  asOfDate: string | null;
  thirtyDayAverage: {
    works: number;
    goods: number;
  };
  dailyData: Array<{
    date: string;
    works: number | null;
    goods: number | null;
  }>;
}

const useDailyNppiAverage = () => {
  const [data, setData] = useState<DailyNppiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${config.apiBaseUrl}/stl/daily-nppi-average`
      );
      if (response.data?.success) {
        setData(response.data.data);
      } else {
        setError(response.data?.message || "Failed to fetch data");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export default useDailyNppiAverage;
