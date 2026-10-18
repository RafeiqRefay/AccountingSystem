import axiosInstance from "./axios";

export const getAllTypes = async () => {
  const response = await axiosInstance.get("/typess/all");
  return response.data;
};

export const createType = async (data) => {
  const response = await axiosInstance.post("/typess", data);
  return response.data;
};

export const updateType = async (id, data) => {
  const response = await axiosInstance.put(`/typess/${id}`, data);
  return response.data;
};

export const deleteType = async (id) => {
  const response = await axiosInstance.delete(`/typess/${id}`);
  return response.data;
};