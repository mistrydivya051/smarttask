import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button, Paper, Chip, Typography } from "@mui/material";
import { getAllTeams } from "../../api/teamApi";
import { getAllTasks } from "../../api/taskApi";
import { getNotifications } from "../../api/notificationApi";
import AppSnackbar from "../../components/common/AppSnackbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [latestTask, setLatestTask] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // --- Teams user belongs to (from updated backend API) ---
      const teamsRes = await getAllTeams(); 
      // backend now returns only teams user is owner/member
      setTeams(teamsRes.data.teams || []);

      // --- Tasks assigned to current user ---
      const tasksRes = await getAllTasks();
      const tasksForUser = tasksRes.data.tasks
        .filter((task) => task.assignedTo?._id === user?._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMyTasks(tasksForUser);
      setLatestTask(tasksForUser[0] || null);

      // --- Notifications ---
      const notificationsRes = await getNotifications();
      setNotifications(notificationsRes.data.notifications || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: "Failed to fetch dashboard data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Hello, {user?.name} 👋</h2>
        <p className="text-gray-600">Here's what's happening today</p>
      </div>

      {/* Teams */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Your Teams</h3>
        {loading ? (
          <p className="text-gray-500">Loading teams...</p>
        ) : teams.length === 0 ? (
          <p className="text-gray-500">You are not part of any team.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teams.map((team) => (
              <Paper key={team._id} className="p-4 hover:shadow-md transition">
                <h4 className="font-bold text-lg">{team.name}</h4>
                <p className="text-sm text-gray-500">{team.description}</p>
                <p className="text-sm text-gray-500 mt-1">Owner: {team.owner?.name}</p>
                <div className="flex justify-between mt-3 text-sm">
                  <span>👥 {team.members?.length || 0} Members</span>
                  <span>📋 {team.tasksCount || 0} Tasks</span>
                </div>
              </Paper>
            ))}
          </div>
        )}
      </div>

      {/* Latest Task */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Latest Task</h3>
        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : latestTask ? (
          <Paper className="p-4 border-l-4 border-blue-500 shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <Typography variant="h6" className="font-bold">
                  {latestTask.title}
                </Typography>
                <p className="text-sm text-gray-500">
                  Due: {latestTask.dueDate ? new Date(latestTask.dueDate).toLocaleDateString() : "N/A"}
                </p>
                <p className="text-sm text-gray-500">Assigned by: {latestTask.createdBy?.name}</p>
              </div>
              <Chip
                label={latestTask.priority || "Low"}
                color={
                  latestTask.priority === "High"
                    ? "error"
                    : latestTask.priority === "Medium"
                    ? "warning"
                    : "default"
                }
                size="small"
              />
            </div>
          </Paper>
        ) : (
          <p className="text-gray-500">No tasks assigned to you</p>
        )}
      </div>

      {/* Notifications */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Notifications</h3>
        <Paper className="p-4 space-y-2">
          {loading ? (
            <p className="text-gray-500">Loading notifications...</p>
          ) : notifications.length > 0 ? (
            notifications.map((note) => (
              <p key={note._id} className="text-sm text-gray-700">
                🔔 {note.message}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No notifications</p>
          )}
        </Paper>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="contained" onClick={() => navigate("/tasks")}>
          Create Task
        </Button>
        <Button variant="outlined" onClick={() => navigate("/teams")}>
          Create Team
        </Button>
        <Button variant="outlined" onClick={() => navigate("/teams")}>
          View Teams
        </Button>
        <Button variant="outlined" onClick={() => navigate("/tasks")}>
          View Tasks
        </Button>
      </div>

      {/* Snackbar */}
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
