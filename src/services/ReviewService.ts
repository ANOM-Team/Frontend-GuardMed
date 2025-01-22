import axiosInstance from "../config/axios";

const ReviewService = {
  async get(pharmacyId: string) {
    try {
      const response = await axiosInstance.get("/reviews/pharmacy/" + pharmacyId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ReviewService;