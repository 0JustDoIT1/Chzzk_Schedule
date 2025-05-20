import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001", // Replace with your API endpoint
});

export default axiosInstance;
