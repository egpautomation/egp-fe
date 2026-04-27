// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { config } from "@/lib/config";

const useSocket = (token: string | null) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const apiUrl = config.apiBaseUrl;
    const socketUrl = apiUrl.replace(/\/api\/v1$/, "");

    const socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socketRef.current = socket;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", () => setIsConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [token]);

  return { socket: socketRef.current, isConnected };
};

export default useSocket;
