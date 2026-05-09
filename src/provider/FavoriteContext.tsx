// @ts-nocheck
import { createContext, useEffect, useState } from "react";
import { favoriteService } from "@/lib/favoriteService";

export const FavoriteContext = createContext();

const FavoriteProvider = ({ children }) => {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await favoriteService.getFavorites();
        setFavoriteCount(res?.count || 0);
      } catch {
      }
    };
    fetchCount();
  }, [reload]);

  return (
    <FavoriteContext.Provider
      value={{
        favoriteCount,
        setReload,
        reload,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export default FavoriteProvider;
