import { axiosClient } from "./axiosClient";

export async function registerRequest(payload) {
  const { data } = await axiosClient.post("/auth/register", payload);
  return data.data;
}

export async function loginRequest(payload) {
  const { data } = await axiosClient.post("/auth/login", payload);
  return data.data;
}

export async function getMeRequest() {
  const { data } = await axiosClient.get("/auth/me");
  return data.data;
}

export async function forgotPasswordRequest(email) {
  const { data } = await axiosClient.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPasswordRequest(token, newPassword) {
  const { data } = await axiosClient.post("/auth/reset-password", { token, newPassword });
  return data;
}