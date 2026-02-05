// @ts-nocheck
import { useEffect, useState } from "react";

const useAllUniqueOrganizations = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        // https://egp-tender-automation-server.vercel.app
        const url = `https://egpserver.jubairahmad.com/api/v1/departments/unique-organizations`;
        const response = await fetch(url);
        const data = await response.json();
        setData(data?.data);
        setCount(data?.count);
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload]);

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

export default useAllUniqueOrganizations;
