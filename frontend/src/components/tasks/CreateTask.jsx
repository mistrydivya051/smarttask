import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions,TextField, Button,MenuItem,Paper} from "@mui/material";
import { createTask } from "../../api/taskApi";
import { getAllTeams, getTeamMembers } from "../../api/teamApi";
import AppSnackbar from "../common/AppSnackbar";

const CreateTask = ({ onClose, onCreated, defaultTeamId = "" }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [team, setTeam] = useState(defaultTeamId || "");
  const [assignedTo, setAssignedTo] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch user teams
  const fetchTeams = async () => {
    try {
      const res = await getAllTeams();
      const allTeams = res.data.teams || [];
      const userTeams = allTeams.filter(
        (t) =>
          t.owner?._id === currentUser?._id ||
          t.members?.some((m) => m.user?._id === currentUser?._id)
      );
      setTeams(userTeams);

      if (!team && userTeams.length > 0) setTeam(userTeams[0]._id);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to fetch teams",
        severity: "error",
      });
    }
  };

  // Fetch team members
  const fetchMembers = async (teamId) => {
    if (!teamId) return;
    try {
      const res = await getTeamMembers(teamId);
      setMembers(res.data.members || []);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to fetch team members",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    setAssignedTo("");
    setMembers([]);
    if (team) fetchMembers(team);
  }, [team]);

  const handleCreate = async () => {
    if (!team) {
      setSnackbar({ open: true, message: "Please select a team", severity: "error" });
      return;
    }
    if (!title.trim()) {
      setSnackbar({ open: true, message: "Task title is required", severity: "error" });
      return;
    }

    setLoading(true);
    try {
      const payload = { team, title, description, priority, dueDate: dueDate || null, assignedTo: assignedTo || null };
      const res = await createTask(payload);
      setSnackbar({ open: true, message: "Task created successfully!", severity: "success" });
      onCreated?.(res.data.task);

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");
      setAssignedTo("");
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to create task",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open onClose={onClose} fullWidth maxWidth="sm">
        {/* Paper with soft shadow and rounded corners for student-style design */}
        <Paper className="p-6 rounded-2xl shadow-lg">
          <DialogTitle className="text-center text-2xl font-bold mb-2" 
            sx={{
              background: "linear-gradient(90deg, #6366f1, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
            Create Task
          </DialogTitle>

          <DialogContent className="space-y-4 mt-2">
            <TextField
              select
              label="Select Team"
              fullWidth
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              disabled={loading || teams.length === 0}
            >
              {teams.map((t) => (
                <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Assign To"
              fullWidth
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={loading || !team}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {members.map((m) => (
                <MenuItem key={m.user._id} value={m.user._id}>
                  {m.user.name} ({m.user.email})
                </MenuItem>
              ))}
            </TextField>

            <TextField label="Task Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
            <TextField label="Description" fullWidth multiline minRows={3} value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
            <TextField select label="Priority" fullWidth value={priority} onChange={(e) => setPriority(e.target.value)} disabled={loading}>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
            <TextField label="Due Date" type="date" fullWidth value={dueDate} onChange={(e) => setDueDate(e.target.value)} InputLabelProps={{ shrink: true }} disabled={loading} />
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} disabled={loading} sx={{ borderRadius: "12px" }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={loading}
              sx={{
                borderRadius: "12px",
                background: "linear-gradient(90deg, #4f46e5, #7c3aed, #d946ef)",
                fontWeight: "bold"
              }}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </>
  );
};

export default CreateTask;
