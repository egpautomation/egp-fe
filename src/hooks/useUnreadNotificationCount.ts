// @ts-nocheck
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

const useUnreadNotificationCount = () => {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await axiosInstance.get("/notifications/unread-count");
      if (res.data?.success) {
        setCount(res.data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return { count, setCount, refreshCount: fetchCount };
};

export default useUnreadNotificationCount;
