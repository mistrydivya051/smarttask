import api from "./axios";

export const createTeam = (data) => api.post("/team/create", data);
export const getAllTeams = () => api.get("/team"); // fetch all teams
export const getTeamDetails = (teamId) => api.get(`/team/${teamId}`);
export const getTeamMembers = (teamId) => api.get(`/team/members/${teamId}`);
export const inviteMember = (teamId, data) => api.post(`/team/invite/${teamId}`, data);
export const respondInvite = (notificationId, data) =>
  api.post(`/team/respond-invite/${notificationId}`, data);
export const getReceivedInvites = () => api.get("/team/received-invites");
export const removeMember = (teamId, memberId) =>
  api.delete(`/team/${teamId}/remove/${memberId}`);
