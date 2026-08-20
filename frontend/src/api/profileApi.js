import { axiosClient } from "./axiosClient";

export async function getProfileRequest() {
  const { data } = await axiosClient.get("/profile");
  return data.data.user;
}

export async function updateProfileRequest(payload) {
  const { data } = await axiosClient.put("/profile", payload);
  return data.data.user;
}

export async function uploadProfilePictureRequest(file) {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await axiosClient.post("/profile/picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.user;
}