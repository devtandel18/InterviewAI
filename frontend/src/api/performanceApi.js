import { axiosClient } from "./axiosClient";

export const getPerformanceRequest = async () => {
  const response = await axiosClient.get("/performance");
  return response.data;
};