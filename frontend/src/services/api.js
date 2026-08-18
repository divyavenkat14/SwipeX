import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://swipex-backend-6zfm.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  console.log("TOKEN SENT:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
