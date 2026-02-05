// @ts-nocheck
import { useEffect, useState } from "react";

const useAllUserJobOrderCart = (user) => {
  const [userJobOrderCart, setUserJobOrderCart] = useState([]);
  const [JobOrderCount, setJobOrderCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    
    const result = async () => {
      try {
        setLoading(true);
        // https://egp-tender-automation-server.vercel.app
        const url = `https://egpserver.jubairahmad.com/api/v1/jobOrder-cart/user?user=${user}`;
        const response = await fetch(url);
        const data = await response.json();
        setUserJobOrderCart(data?.data);
        setJobOrderCount(data?.count);
        setTotalPrice(data?.totalPrice);
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        setLoading(false);
      }
    };
    result();
  }, [reload, ]);

  return {
    userJobOrderCart,
    setUserJobOrderCart,
    JobOrderCount,
    setJobOrderCount,
    reload,
    setLoading,
    setReload,
    loading,
    totalPrice
  };
};

export default useAllUserJobOrderCart;
