// api/categoriesService.js

import api from "./axios";

// GET ALL
export const getAllCategories = async () => {
  const response = await api.get("/categoriess/all");
  return response.data;
};

// CREATE
export const createCategory = async (data) => {
  const response = await api.post("/categoriess", data);
  return response.data;
};

// UPDATE
export const updateCategory = async (id, data) => {
  const response = await api.put(`/categoriess/${id}`, data);
  return response.data;
};

// DELETE
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categoriess/${id}`);
  return response.data;
};
