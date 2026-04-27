// @ts-nocheck
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "./AuthProvider";
import { io } from "socket.io-client";
import { config } from "@/lib/config";
import axiosInstance from "@/lib/axiosInstance";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const token = authContext?.getToken?.();
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/notifications/unread-count");
      if (res.data?.success) setUnreadCount(res.data.count);
    } catch {}
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!token) return;

    const apiUrl = config.apiBaseUrl;
    const socketUrl = apiUrl.replace(/\/api\/v1$/, "");

    const s = io(socketUrl, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    setSocket(s);

    s.on("new-notification", () => {
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [token]);

  const markAsRead = async (id: string) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.patch("/notifications/mark-all-read");
      setUnreadCount(0);
    } catch {}
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/notifications/${id}`);
      if (res.data?.success) {
        fetchUnreadCount();
      }
    } catch {}
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refreshUnreadCount: fetchUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
