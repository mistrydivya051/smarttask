import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button, Paper, Chip, Typography } from "@mui/material";
import { getAllTeams } from "../../api/teamApi";
import { getAllTasks } from "../../api/taskApi";
import AppSnackbar from "../../components/common/AppSnackbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
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

      // Fetch all teams
      const teamsRes = await getAllTeams();
      setTeams(teamsRes.data.teams || []);

      // Fetch all tasks
      const tasksRes = await getAllTasks();
      // Filter tasks assigned to current user
      const tasksForUser = (tasksRes.data.tasks || [])
        .filter((task) => task.assignedTo?._id === user?._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setMyTasks(tasksForUser);
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
    if (user) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 10000); // refresh every 10s
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Hello, {user?.name} 👋</h2>
        <p className="text-gray-600">Here's what's happening today</p>
      </div>

      {/* Teams Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Your Teams</h3>
        {loading ? (
          <p className="text-gray-500">Loading teams...</p>
        ) : teams.length === 0 ? (
          <p className="text-gray-500">You are not part of any team.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teams.map((team) => (
              <Paper key={team._id} className="p-4 hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/teams/${team._id}`)}>
                <h4 className="font-bold text-lg">{team.name}</h4>
                {team.description && <p className="text-sm text-gray-500">{team.description}</p>}
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

      {/* My Tasks Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">My Tasks</h3>
        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : myTasks.length === 0 ? (
          <p className="text-gray-500">No tasks assigned to you.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myTasks.map((task) => (
              <Paper
                key={task._id}
                className="p-4 border-l-4 hover:shadow-md transition cursor-pointer"
                style={{
                  borderColor:
                    task.priority === "High"
                      ? "#f44336"
                      : task.priority === "Medium"
                      ? "#ff9800"
                      : "#2196f3",
                }}
                onClick={() => navigate(`/tasks/${task._id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Typography variant="h6" className="font-bold">
                      {task.title}
                    </Typography>
                    <p className="text-sm text-gray-500 mt-1">
                      Due:{" "}
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Assigned by: {task.createdBy?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Team: {task.team?.name || "N/A"}
                    </p>
                  </div>
                  <Chip
                    label={task.priority || "Low"}
                    color={
                      task.priority === "High"
                        ? "error"
                        : task.priority === "Medium"
                        ? "warning"
                        : "default"
                    }
                    size="small"
                  />
                </div>
              </Paper>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="contained" onClick={() => navigate("/tasks")}>Create Task</Button>
        <Button variant="outlined" onClick={() => navigate("/teams")}>Create Team</Button>
        <Button variant="outlined" onClick={() => navigate("/teams")}>View Teams</Button>
        <Button variant="outlined" onClick={() => navigate("/tasks")}>View Tasks</Button>
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
