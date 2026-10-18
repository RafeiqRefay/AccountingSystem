import api from "./axios";

// GET ALL
export const getAllExpenses = async () => {
  const res = await api.get("/expensess/all");
  return res.data;
};

// CREATE
export const createExpense = async (data) => {
  const res = await api.post("/expensess", data);
  return res.data;
};

// UPDATE
export const updateExpense = async (id, data) => {
  const res = await api.put(`/expensess/${id}`, data);
  return res.data;
};

// DELETE
export const deleteExpense = async (id) => {
  const res = await api.delete(`/expensess/${id}`);
  return res.data;
};