// @ts-nocheck

import { useEffect, useState } from "react";

const useAllUsers = (searchTerm) => {
  const [users, setUsers] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        const response = await import("@/lib/axiosInstance").then((m) =>
          m.default.get(`/user?searchTerm=${searchTerm}`)
        );
        setUsers(response.data?.data);
        setUsersCount(response.data?.count);
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload, searchTerm]);

  return {
    users,
    setUsers,
    usersCount,
    setUsersCount,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useAllUsers;
