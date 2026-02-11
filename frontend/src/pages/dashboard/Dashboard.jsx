import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button, Paper, Chip, Typography } from "@mui/material";
import { getAllTeams } from "../../api/teamApi";
import { getAllTasks } from "../../api/taskApi";
import AppSnackbar from "../../components/common/AppSnackbar";
import { useNavigate } from "react-router-dom";

// Material UI Icons
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import LabelIcon from "@mui/icons-material/Label";

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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // fetch teams
      const teamsRes = await getAllTeams();
      setTeams(teamsRes.data.teams || []);

      // fetch tasks
      const tasksRes = await getAllTasks();

      // filter tasks only for logged in user
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

      // refresh every 60 sec
      const interval = setInterval(fetchDashboardData, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <DashboardLayout>
      {/* Greeting */}
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900">
          Hello, {user?.name}
        </h2>
        <p className="text-slate-600 mt-1">
          Here's what's happening today in SmartTask.
        </p>
      </div>

      {/* Teams */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">Your Teams</h3>

          <Button
            variant="contained"
            onClick={() => navigate("/teams")}
            sx={{
              background: "linear-gradient(90deg, #4f46e5, #9333ea)",
              borderRadius: "12px",
              fontWeight: 700,
              textTransform: "none",
              paddingX: "18px",
              paddingY: "10px",
            }}
          >
            View Teams
          </Button>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading teams...</p>
        ) : teams.length === 0 ? (
          <p className="text-slate-500">You are not part of any team.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {teams.map((team) => (
              <Paper
                key={team._id}
                className="p-5 rounded-2xl hover:shadow-xl transition cursor-pointer border border-slate-100"
                onClick={() => navigate(`/teams`)}
              >
                <h4 className="font-extrabold text-lg text-slate-900">
                  {team.name}
                </h4>

                {team.description && (
                  <p className="text-sm text-slate-600 mt-1">
                    {team.description}
                  </p>
                )}

                <p className="text-sm text-slate-500 mt-2">
                  Owner: {team.owner?.name}
                </p>

                <div className="flex justify-between mt-4 text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-1">
                    <GroupIcon fontSize="small" />
                    <span>{team.members?.length || 0} Members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AssignmentIcon fontSize="small" />
                    <span>{team.tasksCount || 0} Tasks</span>
                  </div>
                </div>
              </Paper>
            ))}
          </div>
        )}
      </div>

      {/* My Tasks */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-900 mb-4">My Tasks</h3>

        {loading ? (
          <p className="text-slate-500">Loading tasks...</p>
        ) : myTasks.length === 0 ? (
          <p className="text-slate-500">No tasks assigned to you.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myTasks.map((task) => (
              <Paper
                key={task._id}
                className="p-5 rounded-2xl border hover:shadow-xl transition cursor-pointer"
                style={{
                  borderColor:
                    task.priority === "High"
                      ? "rgba(239,68,68,0.35)"
                      : task.priority === "Medium"
                      ? "rgba(245,158,11,0.35)"
                      : "rgba(59,130,246,0.35)",
                }}
                onClick={() => navigate(`/tasks/${task._id}`)}
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 900, color: "#0f172a" }}
                    >
                      {task.title}
                    </Typography>

                    <div className="flex gap-2 items-center mt-2 text-sm text-slate-600">
                      <EventIcon fontSize="small" />
                      <span>
                        Due:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>

                    <div className="flex gap-2 items-center mt-1 text-sm text-slate-600">
                      <PersonIcon fontSize="small" />
                      <span>Assigned by: {task.createdBy?.name}</span>
                    </div>

                    <div className="flex gap-2 items-center mt-1 text-sm text-slate-600">
                      <LabelIcon fontSize="small" />
                      <span>Team: {task.team?.name || "N/A"}</span>
                    </div>
                  </div>

                  <Chip
                    label={task.priority || "Low"}
                    color={
                      task.priority === "High"
                        ? "error"
                        : task.priority === "Medium"
                        ? "warning"
                        : "info"
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
        <Button
          variant="contained"
          onClick={() => navigate("/tasks")}
          sx={{
            background: "linear-gradient(90deg, #4f46e5, #9333ea)",
            borderRadius: "12px",
            fontWeight: 700,
            textTransform: "none",
            paddingX: "18px",
            paddingY: "10px",
          }}
        >
          Create Task
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/teams")}
          sx={{
            borderColor: "rgba(79,70,229,0.35)",
            color: "#4f46e5",
            borderRadius: "12px",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              borderColor: "rgba(79,70,229,0.6)",
              background: "rgba(79,70,229,0.06)",
            },
          }}
        >
          Create Team
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/teams")}
          sx={{
            borderColor: "rgba(79,70,229,0.35)",
            color: "#4f46e5",
            borderRadius: "12px",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              borderColor: "rgba(79,70,229,0.6)",
              background: "rgba(79,70,229,0.06)",
            },
          }}
        >
          View Teams
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/tasks")}
          sx={{
            borderColor: "rgba(79,70,229,0.35)",
            color: "#4f46e5",
            borderRadius: "12px",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              borderColor: "rgba(79,70,229,0.6)",
              background: "rgba(79,70,229,0.06)",
            },
          }}
        >
          View Tasks
        </Button>
      </div>

      {/* Snackbar Notification */}
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
