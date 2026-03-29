// @ts-nocheck
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

const useAllTenderPreparation = (searchTerm, page, limit, userEmail) => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        // Using axiosInstance for automatic token injection
        const response = await axiosInstance.get(`/tender-preparation`, {
          params: {
            searchTerm,
            page,
            limit,
            userMail: userEmail, // Pass userMail to filter by backend
          },
        });

        const data = response.data;
        console.log(data?.data);
        setData(data?.data);
        setCount(data?.count);
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload, searchTerm, page, limit, userEmail]);

  return {
    data,
    setData,
    count,
    setCount,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useAllTenderPreparation;
