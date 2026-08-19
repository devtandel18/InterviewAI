import { axiosClient } from "./axiosClient";

export async function updatePasswordRequest(payload) {
  const { data } = await axiosClient.put("/settings/password", payload);
  return data;
}

export async function updateSettingsRequest(payload) {
  const { data } = await axiosClient.put("/settings", payload);
  return data.data.user;
}

export async function deleteAccountRequest() {
  const { data } = await axiosClient.delete("/settings/account");
  return data;
}