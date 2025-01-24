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

  async getNearbyGuardPharmacies(latitude, longitude) {
    try {
      const response = await axiosInstance.get(`/pharmacies/nearby-guard`, {
        params: { lat: latitude, lng: longitude },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching nearby pharmacies:", error);
      throw error;
    }
  },
};

export default PharmacyService;
