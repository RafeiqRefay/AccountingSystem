import axiosInstance from "./axios";

// ================================
// GET ALL
// ================================
export const getAllProductNames = async () => {
  const response = await axiosInstance.get("/productnames/all");
  return response.data;
};

// ================================
// CREATE
// ================================
export const createProductName = async (data) => {
  const response = await axiosInstance.post("/productnames", {
    productName: data
  });
  return response.data;
};


// ================================
// UPDATE
// ================================
export const updateProductName = async (id, data) => {
  const response = await axiosInstance.put(`/productnames/${id}`, {
    productName: data
  });
  return response.data;
};

// ================================
// DELETE
// ================================
export const deleteProductName = async (id) => {
  const response = await axiosInstance.delete(
    `/productnames/${id}`
  );

  return response.data;
};