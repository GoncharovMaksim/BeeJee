import axios from "axios";

export const api = axios.create({ withCredentials: true });

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
