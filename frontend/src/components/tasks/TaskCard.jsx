// import { useState } from "react";
// import { Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material";
// import { deleteTask, updateTask } from "../../api/taskApi";
// import AppSnackbar from "../common/AppSnackbar";

// const TaskCard = ({ task, teamMembers = [], onUpdated }) => {
//   const [openUpdate, setOpenUpdate] = useState(false);
//   const [title, setTitle] = useState(task.title);
//   const [description, setDescription] = useState(task.description || "");
//   const [status, setStatus] = useState(task.status || "Pending");
//   const [priority, setPriority] = useState(task.priority || "Medium");
//   const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id || "");
//   const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split("T")[0] : "");

//   const [loading, setLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

//   // delete task
//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete this task?")) return;

//     try {
//       await deleteTask(task._id);
//       onUpdated();
//     } catch (err) {
//       console.error("Delete task error:", err.response?.data || err.message);
//       setSnackbar({ open: true, message: err.response?.data?.message || "Failed to delete task", severity: "error" });
//     }
//   };

//   // update task
//   const handleUpdate = async () => {
//     if (!title.trim()) {
//       setSnackbar({ open: true, message: "Title is required", severity: "error" });
//       return;
//     }

//     setLoading(true);
//     try {
//       await updateTask(task._id, {
//         title,
//         description,
//         status,
//         priority,
//         dueDate: dueDate || null,
//         assignedTo: assignedTo || null,
//       });

//       setSnackbar({ open: true, message: "Task updated successfully!", severity: "success" });
//       setOpenUpdate(false);
//       onUpdated();
//     } catch (err) {
//       console.error("Update task error:", err.response?.data || err.message);
//       setSnackbar({ open: true, message: err.response?.data?.message || "Failed to update task", severity: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // color for status and priority
//   const statusColors = { Pending: "bg-yellow-100 text-yellow-800", Completed: "bg-green-100 text-green-800", InProgress: "bg-blue-100 text-blue-800" };
//   const priorityColors = { Low: "bg-green-100 text-green-800", Medium: "bg-yellow-100 text-yellow-800", High: "bg-red-100 text-red-800" };

//   return (
//     <>
//       <Paper className="p-4 shadow-md flex flex-col justify-between">
//         <div>
//           <h4 className="font-semibold text-lg">{task.title}</h4>
//           <p className="text-gray-600">{task.description}</p>
//           <div className="flex gap-2 mt-2">
//             <span className={`px-2 py-1 rounded text-sm ${statusColors[task.status] || "bg-gray-100 text-gray-800"}`}>
//               {task.status || "Pending"}
//             </span>
//             <span className={`px-2 py-1 rounded text-sm ${priorityColors[task.priority] || "bg-gray-100 text-gray-800"}`}>
//               {task.priority || "Medium"}
//             </span>
//           </div>
//           {task.assignedTo && <p className="text-sm mt-1">Assignee: {task.assignedTo.name}</p>}
//           {task.dueDate && <p className="text-sm mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
//         </div>

//         <div className="flex gap-2 mt-4">
//           <Button size="small" variant="outlined" color="primary" onClick={() => setOpenUpdate(true)}>
//             Update
//           </Button>
//           <Button size="small" variant="outlined" color="error" onClick={handleDelete}>
//             Delete
//           </Button>
//         </div>
//       </Paper>

//       {/* Update Task Dialog */}
//       <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} fullWidth maxWidth="sm">
//         <DialogTitle>Update Task</DialogTitle>
//         <DialogContent className="space-y-4 mt-2">
//           <TextField label="Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
//           <TextField label="Description" fullWidth multiline minRows={3} value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
//           <TextField select label="Status" fullWidth value={status} onChange={(e) => setStatus(e.target.value)} disabled={loading}>
//             <MenuItem value="Pending">Pending</MenuItem>
//             <MenuItem value="In Progress">In Progress</MenuItem>
//             <MenuItem value="Completed">Completed</MenuItem>
//           </TextField>
//           <TextField select label="Priority" fullWidth value={priority} onChange={(e) => setPriority(e.target.value)} disabled={loading}>
//             <MenuItem value="Low">Low</MenuItem>
//             <MenuItem value="Medium">Medium</MenuItem>
//             <MenuItem value="High">High</MenuItem>
//           </TextField>
//           <TextField select label="Assign To" fullWidth value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} disabled={loading || !teamMembers.length}>
//             <MenuItem value="">Unassigned</MenuItem>
//             {teamMembers.map((m) => (
//               <MenuItem key={m.user._id} value={m.user._id}>
//                 {m.user.name} ({m.user.email})
//               </MenuItem>
//             ))}
//           </TextField>
//           <TextField
//             label="Due Date" type="date" fullWidth value={dueDate} onChange={(e) => setDueDate(e.target.value)} InputLabelProps={{ shrink: true }} disabled={loading}/>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenUpdate(false)} disabled={loading}>Cancel</Button>
//           <Button variant="contained" onClick={handleUpdate} disabled={loading}>
//             {loading ? "Updating..." : "Update"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* snackbar notification */}
//       <AppSnackbar
//         open={snackbar.open}
//         message={snackbar.message}
//         severity={snackbar.severity}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       />
//     </>
//   );
// };

// export default TaskCard;

import { useState } from "react";
import {
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from "@mui/material";
import { deleteTask, updateTask } from "../../api/taskApi";
import AppSnackbar from "../common/AppSnackbar";

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
      console.error("Delete task error:", err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to delete task",
        severity: "error"
      });
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
      console.error("Update task error:", err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to update task",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // Colors
  const statusColors = {
    "To Do": "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800"
  };
  const priorityColors = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800"
  };

  return (
    <>
      <Paper className="p-4 shadow-md flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-lg">{task.title}</h4>
          <p className="text-gray-600">{task.description}</p>
          <div className="flex gap-2 mt-2">
            <span className={`px-2 py-1 rounded text-sm ${statusColors[task.status] || "bg-gray-100 text-gray-800"}`}>
              {task.status || "To Do"}
            </span>
            <span className={`px-2 py-1 rounded text-sm ${priorityColors[task.priority] || "bg-gray-100 text-gray-800"}`}>
              {task.priority || "Medium"}
            </span>
          </div>
          {task.assignedTo && <p className="text-sm mt-1">Assignee: {task.assignedTo.name}</p>}
          {task.dueDate && <p className="text-sm mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
        </div>

        <div className="flex gap-2 mt-4">
          {(isOwner || isAssignee) && (
            <Button size="small" variant="outlined" color="primary" onClick={() => setOpenUpdate(true)}>
              Update
            </Button>
          )}
          {isOwner && (
            <Button size="small" variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      </Paper>

      {/* Update Task Dialog */}
      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Task</DialogTitle>
        <DialogContent className="space-y-4 mt-2">
          {isOwner && (
            <>
              <TextField label="Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
              <TextField label="Description" fullWidth multiline minRows={3} value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
              <TextField select label="Priority" fullWidth value={priority} onChange={(e) => setPriority(e.target.value)} disabled={loading}>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
              <TextField select label="Assign To" fullWidth value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} disabled={loading || !teamMembers.length}>
                <MenuItem value="">Unassigned</MenuItem>
                {teamMembers.map((m) => (
                  <MenuItem key={m.user._id} value={m.user._id}>
                    {m.user.name} ({m.user.email})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Due Date"
                type="date"
                fullWidth
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                disabled={loading}
              />
            </>
          )}

          {/* Status for both owner & assignee */}
          <TextField select label="Status" fullWidth value={status} onChange={(e) => setStatus(e.target.value)} disabled={loading}>
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)} disabled={loading}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
