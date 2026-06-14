import axios from 'axios';

const getBaseURL = () => {
  const windowEnv = (window as any).env;
  if (windowEnv && windowEnv.VITE_API_URL) {
    return windowEnv.VITE_API_URL;
  }

  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => Promise.reject(error),
);

export default api;
