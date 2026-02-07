// @ts-nocheck
import { config } from "@/lib/config";
import { useEffect, useState } from "react";

const useAllTenderDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    
    const result = async () => {
      try {
        setLoading(true);
        // https://egp-tender-automation-server.vercel.app
        const url = `${config.apiBaseUrl}/tenders/tender-departments`;
        const response = await fetch(url);
        const data = await response.json();
        setDepartments(data?.data);
        setCount(data?.count);
       
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload, ]);

  return {
   departments,
    setDepartments,
    count,
    setCount,
    reload,
    setLoading,
    setReload,
    loading,
   
  };
};

export default useAllTenderDepartments;
