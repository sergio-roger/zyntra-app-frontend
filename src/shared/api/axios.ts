import axios from "axios";

const getBaseURL = () => {
  return import.meta.env.VITE_API_URL || "/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => Promise.reject(error),
);

export default api;
