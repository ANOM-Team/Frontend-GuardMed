import axiosInstance from "../config/axios";

const FavoriteService = {
  async getAll() {
    try {
      const response = await axiosInstance.get("/favorites");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async add(favorite: any) {
    try {
      const response = await axiosInstance.post("/favorites", favorite);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async remove(favoriteId: string) {
    try {
      const response = await axiosInstance.delete(`/favorites/${favoriteId}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export default FavoriteService;