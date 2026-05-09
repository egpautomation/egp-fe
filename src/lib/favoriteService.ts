import axiosInstance from "./axiosInstance";

export const favoriteService = {
  addFavorite: async (tenderId: string) => {
    const res = await axiosInstance.post(`/user/favorites/${tenderId}`);
    return res.data;
  },

  removeFavorite: async (tenderId: string) => {
    const res = await axiosInstance.delete(`/user/favorites/${tenderId}`);
    return res.data;
  },

  getFavorites: async () => {
    const res = await axiosInstance.get(`/user/favorites`);
    return res.data;
  },

  checkFavorite: async (tenderMongoId: string) => {
    const res = await axiosInstance.get(`/user/favorites/check/${tenderMongoId}`);
    return res.data;
  },
};
