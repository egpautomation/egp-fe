// @ts-nocheck
import { useEffect, useState } from "react";

const useAllDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [transformedDepartments, setTransformedDepartments] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const result = async () => {
      try {
        setLoading(true);
        const url = `https://egpserver.jubairahmad.com/api/v1/departments`;
        const response = await fetch(url);
        const data = await response.json();

        if (data?.success && data?.data) {
          setDepartments(data.data);
          setCount(data.count);

          // Transform to AGENCIES-compatible format
          const transformed = data.data.map((dept) => ({
            value: dept.shortName,
            label: dept.shortName,
            detailsName: dept.detailsName,
            organization: dept.organization,
          }));
          setTransformedDepartments(transformed);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload]);

  return {
    departments,
    transformedDepartments, // For use in forms (AGENCIES format)
    setDepartments,
    count,
    setCount,
    reload,
    setLoading,
    setReload,
    loading,
  };
};

export default useAllDepartments;
