// @ts-nocheck
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

const useOtmBypassReportCount = (userEmail, isAdmin = false) => {
  const [data, setData] = useState({
    new: 0,
    waiting: 0,
    total: 0,
    cancel: 0,
  });
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!userEmail) return;

    const fetchCount = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/otm-bypass-report/count", {
          params: {
            user: userEmail,
            isAdmin: isAdmin,
          },
        });
        
        if (response.data?.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching OTM Bypass Report counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [userEmail, isAdmin, reload]);

  return {
    data,
    loading,
    reload,
    setReload,
  };
};

export default useOtmBypassReportCount;
