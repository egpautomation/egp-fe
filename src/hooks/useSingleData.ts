// @ts-nocheck

import { useEffect, useState } from "react";

const useSingleData = (url) => {
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [data, setData] = useState({});
  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const result = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const data = await response.json();
        setData(data?.data);
        
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload, url]);

  return { data, loading, setReload };
};

export default useSingleData;
