import api from "./axios";

// Notifications
export const getNotifications = () => api.get("/notifications");
export const respondNotification = (notificationId, data) =>
  api.post(`/team/respond-invite/${notificationId}`, data); // for invites
export const markAsRead = (notificationId) =>
  api.put(`/notifications/read/${notificationId}`);
