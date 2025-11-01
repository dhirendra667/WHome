import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1", // backend base URL
  withCredentials: true, // include cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

