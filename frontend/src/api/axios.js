import axios from "axios";

//for local
// const api = axios.create({
//   baseURL: "http://localhost:3000/api",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

//for render
const api = axios.create({
  baseURL: "https://smarttask-backend-btpx.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
