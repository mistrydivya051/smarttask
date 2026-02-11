import { useEffect, useState } from "react";
import { Paper, Button, TextField, MenuItem, Stack, Typography } from "@mui/material";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllTeams } from "../../api/teamApi";
import { getTeamTasks } from "../../api/taskApi";

import CreateTask from "../../components/tasks/CreateTask";
import TaskCard from "../../components/tasks/TaskCard";
import AppSnackbar from "../../components/common/AppSnackbar";

import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

const Tasks = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id;

  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch teams user belongs to
  const fetchTeams = async () => {
    try {
      const res = await getAllTeams();
      const allTeams = res.data.teams || [];

      const userTeams = allTeams.filter((t) => {
        const isOwner = t.owner?._id === currentUserId;
        const isMember = t.members?.some((m) => m.user?._id === currentUserId);
        return isOwner || isMember;
      });

      setTeams(userTeams);

      if (!selectedTeamId && userTeams.length > 0) {
        setSelectedTeamId(userTeams[0]._id);
      }
    } catch (err) {
      console.error("Fetch teams error:", err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: "Failed to fetch teams",
        severity: "error",
      });
    }
  };

  // Fetch tasks for selected team
  const fetchTasks = async (teamId) => {
    if (!teamId) return;
    setLoading(true);
    try {
      const params = {};
      if (searchText) params.search = searchText;
      if (priorityFilter) params.priority = priorityFilter;

      const res = await getTeamTasks(teamId, params);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Fetch tasks error:", err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || "Failed to fetch tasks",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeamId) fetchTasks(selectedTeamId);
  }, [selectedTeamId, searchText, priorityFilter]);

  const selectedTeam = teams.find((t) => t._id === selectedTeamId);
  const isOwner = selectedTeam?.owner?._id === currentUserId;

  return (
    <DashboardLayout>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Tasks</Typography>
        {isOwner && (
          <Button
            variant="contained"
             startIcon={<AddCircleOutlineRoundedIcon />}
            onClick={() => setOpenCreate(true)}
           sx={{
            background: "linear-gradient(90deg, #4f46e5, #9333ea)",
            borderRadius: "14px",
            fontWeight: 800,
            textTransform: "none",
            px: 2.2,
            py: 1.2,
            boxShadow: "0px 10px 25px rgba(79,70,229,0.25)",
            "&:hover": {
              background: "linear-gradient(90deg, #4338ca, #7e22ce)",
            },
          }}
          >
            Create Task
          </Button>
        )}
      </Stack>

      {/* Team Tabs */}
      <Stack direction="row" spacing={2} mb={4} overflow="auto">
        {teams.map((team) => (
          <Paper
            key={team._id}
            onClick={() => setSelectedTeamId(team._id)}
            sx={{
              px: 3,
              py: 1,
              cursor: "pointer",
              borderRadius: 3,
              backgroundColor: selectedTeamId === team._id ? "#6366f1" : "#f3f4f6",
              color: selectedTeamId === team._id ? "#fff" : "#000",
              transition: "all 0.3s",
            }}
          >
            {team.name}
          </Paper>
        ))}
      </Stack>

      {/* Search & Filter */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
        <TextField
          label="Search by Title"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Priority"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>
      </Stack>

      {/* Task Grid */}
      <Stack direction="row" spacing={3} flexWrap="wrap">
        {loading && <Typography>Loading tasks...</Typography>}
        {!loading && tasks.length === 0 && (
          <Typography color="text.secondary">No tasks found for this team.</Typography>
        )}

        {!loading && tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            teamMembers={selectedTeam?.members || []}
            currentUserId={currentUserId}
            isOwner={isOwner}
            onUpdated={() => fetchTasks(selectedTeamId)}
             showSnackbar={(message, severity) => setSnackbar({ open: true, message, severity })}
            sx={{ width: 500 }}
          />
        ))}
      </Stack>

      {/* Create Task Dialog */}
      {openCreate && (
        <CreateTask
          defaultTeamId={selectedTeamId}
          onClose={() => setOpenCreate(false)}
          onCreated={() => {
            fetchTasks(selectedTeamId);
            setOpenCreate(false);
            setSnackbar({ open: true, message: "Task created successfully!", severity: "success" });
          }}
        />
      )}

      {/* Snackbar */}
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </DashboardLayout>
  );
};

export default Tasks;
