import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hf_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      (err.code === "ERR_NETWORK" || err.message === "Network Error"
        ? "Cannot reach the API. On Vercel, set MONGO_URI (Atlas) and keep Root Directory as the repo root. Locally run backend + frontend."
        : err.message) ||
      "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default api;
