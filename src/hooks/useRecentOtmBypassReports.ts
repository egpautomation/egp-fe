// @ts-nocheck
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

const useRecentOtmBypassReports = (userEmail, limit = 5) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!userEmail) return;

    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/otm-bypass-report/user", {
          params: {
            user: userEmail,
            page: 1,
            limit: limit,
          },
        });
        
        if (response.data?.success) {
          setReports(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching recent OTM Bypass reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userEmail, limit, reload]);

  return {
    reports,
    loading,
    reload,
    setReload,
  };
};

export default useRecentOtmBypassReports;
