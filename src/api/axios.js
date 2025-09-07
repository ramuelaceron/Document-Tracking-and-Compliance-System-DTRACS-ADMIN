// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.62:8000",
  timeout: 5000,
});

// Optional: Log all requests
api.interceptors.request.use(
  (config) => {
    console.log("🚀 Request URL:", config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;