import api from "./axios";

export const createTask = (data) => api.post(`/task/create`, data);
export const getAllTasks = () => api.get("/task");

export const getTeamTasks = (teamId, params) =>
  api.get(`/task/${teamId}`, { params });

export const updateTask = (taskId, data) => api.put(`/task/update/${taskId}`, data);
export const deleteTask = (taskId) => api.delete(`/task/delete/${taskId}`);
export const searchTasks = (params) => api.get("/task/search", { params });