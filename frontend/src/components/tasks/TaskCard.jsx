import { useState } from "react";
import { Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Stack, Typography, IconButton, } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import AppSnackbar from "../common/AppSnackbar";
import { deleteTask, updateTask } from "../../api/taskApi";

const TaskCard = ({ task, teamMembers = [], currentUserId, isOwner, onUpdated }) => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "To Do");
  const [priority, setPriority] = useState(task.priority || "Medium");
  const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id || "");
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split("T")[0] : "");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const isAssignee = task.assignedTo?._id === currentUserId;

  // Delete task
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    try {
      await deleteTask(task._id);
      setSnackbar({ open: true, message: "Task deleted successfully!", severity: "success" });
      onUpdated();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to delete task", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Update task
  const handleUpdate = async () => {
    if (isOwner && !title.trim()) {
      setSnackbar({ open: true, message: "Title is required", severity: "error" });
      return;
    }

    setLoading(true);
    const payload = isOwner
      ? { title, description, status, priority, dueDate: dueDate || null, assignedTo: assignedTo || null }
      : { status };

    try {
      await updateTask(task._id, payload);
      setSnackbar({ open: true, message: "Task updated successfully!", severity: "success" });
      setOpenUpdate(false);
      onUpdated();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to update task", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Priority icons
  const priorityIcon = {
    Low: <LowPriorityIcon fontSize="small" className="text-green-600" />,
    Medium: <PriorityHighIcon fontSize="small" className="text-yellow-600" />,
    High: <PriorityHighIcon fontSize="small" className="text-red-600" />,
  };

  // Status icons
  const statusIcon = {
    "To Do": <PendingIcon fontSize="small" className="text-yellow-600" />,
    "In Progress": <PendingIcon fontSize="small" className="text-blue-600" />,
    Completed: <CheckCircleIcon fontSize="small" className="text-green-600" />,
  };

  return (
    <>
      <Paper className="p-4 rounded-2xl shadow-lg flex flex-col justify-between">
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight="bold">{task.title}</Typography>
          {description && <Typography variant="body2" color="text.secondary">{description}</Typography>}

          <Stack direction="row" spacing={1} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center" className="px-2 py-1 rounded bg-gray-100">
              {statusIcon[task.status]} <Typography variant="caption">{task.status}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center" className="px-2 py-1 rounded bg-gray-100">
              {priorityIcon[task.priority]} <Typography variant="caption">{task.priority}</Typography>
            </Stack>
          </Stack>

          {task.assignedTo && <Typography variant="caption">Assignee: {task.assignedTo.name}</Typography>}
          {task.createdBy && (
            <Typography variant="caption" color="text.secondary">
              Created by: {task.createdBy.name}
            </Typography>
          )}
          {task.dueDate && <Typography variant="caption">Due: {new Date(task.dueDate).toLocaleDateString()}</Typography>}
        </Stack>

        <Stack direction="row" spacing={1} mt={2}>
          {(isOwner || isAssignee) && (
            <Button
              variant="contained"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setOpenUpdate(true)}
            >
              Update
            </Button>
          )}
          {isOwner && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Update Task Dialog */}
      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} fullWidth maxWidth="sm">
        <Paper className="p-6 rounded-2xl shadow-lg">
          <DialogTitle
            className="text-center text-2xl font-bold mb-2"
            sx={{
              background: "linear-gradient(90deg, #6366f1, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Update Task
          </DialogTitle>

          <DialogContent className="space-y-4 mt-2">
            {/* Fields editable only for Owner */}
            <TextField
            id="task-title"
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading || !isOwner}  // <-- Owner check
            />
            <TextField
              id="task-description"
              label="Description"
              fullWidth
              multiline
              minRows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading || !isOwner} // <-- Owner check
            />
            <TextField
            id="task-priority"
              select
              label="Priority"
              fullWidth
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading || !isOwner} // <-- Owner check
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
            <TextField
            id="task-assignedto"
              select
              label="Assign To"
              fullWidth
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={loading || !isOwner || !teamMembers.length} // <-- Owner check + member check
            >
              <MenuItem value="">Unassigned</MenuItem>
              {teamMembers.map((m) => (
                <MenuItem key={m.user._id} value={m.user._id}>
                  {m.user.name} ({m.user.email})
                </MenuItem>
              ))}
            </TextField>
            <TextField
            id="task-duedate"
              label="Due Date"
              type="date"
              fullWidth
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={loading || !isOwner} // <-- Owner check
            />

            {/* Status field editable for everyone */}
            <TextField
            id="task-status"
              select
              label="Status"
              fullWidth
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading} // Members and Owner can update
            >
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenUpdate(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdate}
              disabled={loading}
              sx={{
                background: "linear-gradient(90deg, #4f46e5, #7c3aed, #d946ef)",
                fontWeight: "bold",
              }}
            >
              {loading ? "Updating..." : "Update"}
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

export default TaskCard;
