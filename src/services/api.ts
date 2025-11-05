// src/services/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "/api/backend",
  withCredentials: true,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("cq_token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (typeof window !== "undefined" && err?.response?.status === 401) {
      const lang = window.location.pathname.split("/")[1] || "it";
      window.location.href = `/${lang}/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
    return Promise.reject(err);
  }
);
