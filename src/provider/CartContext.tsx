// @ts-nocheck
import { config } from "@/lib/config";
import { createContext,  useEffect, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children, userEmail }) => {
  const [userJobOrderCart, setUserJobOrderCart] = useState([]);
  const [JobOrderCount, setJobOrderCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    const fetchCart = async () => {
      try {
        setLoading(true);
        const url = `${config.apiBaseUrl}/jobOrder-cart/user?user=${userEmail}`;
        const res = await fetch(url);
        const data = await res.json();

        setUserJobOrderCart(data?.data || []);
        setJobOrderCount(data?.count || 0);
        setTotalPrice(Number(data?.totalPrice) || 0);
      } catch (err) {
        console.error("Cart fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userEmail, reload]);

  return (
    <CartContext.Provider
      value={{
        userJobOrderCart,
        JobOrderCount,
        totalPrice,
        loading,
        setReload,
        reload,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartProvider

// export const useCart = () => useContext(CartContext);
