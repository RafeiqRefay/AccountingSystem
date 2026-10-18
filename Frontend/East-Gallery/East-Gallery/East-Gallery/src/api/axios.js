import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5047/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;