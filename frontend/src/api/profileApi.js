import { axiosClient } from "./axiosClient";

export async function getProfileRequest() {
  const { data } = await axiosClient.get("/profile");
  return data.data.user;
}

export async function updateProfileRequest(payload) {
  const { data } = await axiosClient.put("/profile", payload);
  return data.data.user;
}