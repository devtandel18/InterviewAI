import { axiosClient } from "./axiosClient";

export async function getDashboardRequest() {
  const { data } = await axiosClient.get("/dashboard");
  return data.data;
}