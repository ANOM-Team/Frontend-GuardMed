import axiosInstance from "../config/axios";

const PharmacyService = {
  async getAll() {
    try {
      const response = await axiosInstance.get("/pharmacies");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async get(id: string) {
    try {
      const response = await axiosInstance.get(`/pharmacies/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export default PharmacyService;
