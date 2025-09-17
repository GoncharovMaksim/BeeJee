import axios from "axios";

// Fallback к продакшен API, если VITE_API_URL не задан на Render
const baseURL =
  (import.meta?.env && import.meta.env.VITE_API_URL) ||
  "https://beejee-thrw.onrender.com";
export const api = axios.create({ baseURL, withCredentials: true });

let storeRef = null;
export function attachStore(store) {
  storeRef = store;
}

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401 && storeRef) {
      storeRef.dispatch({ type: "auth/logout/fulfilled" });
    }
    return Promise.reject(error);
  }
);

export default api;
