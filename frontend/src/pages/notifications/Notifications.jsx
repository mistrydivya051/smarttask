import { useEffect, useState } from "react";
import {IconButton, List, ListItem,ListItemText,Button, Badge,Paper,Typography,Stack,} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { getNotifications, markAsRead, respondNotification } from "../../api/notificationApi";
import AppSnackbar from "../../components/common/AppSnackbar";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [openPanel, setOpenPanel] = useState(false);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      // Show unread notifications or pending invites
      const filtered =
        res.data.notifications?.filter(
          (n) => !n.isRead && (n.type !== "TEAM_INVITE" || !n.responded)
        ) || [];
      setNotifications(filtered);
    } catch (err) {
      console.error("Fetch notifications error:", err.response?.data || err.message);
      setSnackbar({ open: true, message: "Failed to fetch notifications", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Mark as read error:", err.response?.data || err.message);
      setSnackbar({ open: true, message: "Failed to mark as read", severity: "error" });
    }
  };

  // Respond to team invite
  const handleRespondInvite = async (id, accept) => {
    try {
      const responseString = accept ? "Accepted" : "Declined";
      const res = await respondNotification(id, { response: responseString });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setSnackbar({
        open: true,
        message: res.data.message || `Invite ${responseString}`,
        severity: "success",
      });
    } catch (err) {
      console.error("Respond invite error:", err.response?.data || err.message);
      setSnackbar({ open: true, message: "Failed to respond to invite", severity: "error" });
    }
  };

  const unreadCount = notifications.length;

  // Generate message for each notification
  const getNotificationMessage = (n) => {
    if (n.type === "TASK_ASSIGNED") {
      return `${n.sender?.name || "Someone"} assigned you the task "${n.task?.title || ""}"`;
    }
    if (n.type === "TASK_DUE") {
      return `${n.assignee?.name || "A user"} completed the task "${n.task?.title || ""}"`;
    }
    if (n.type === "TEAM_INVITE") {
      return `${n.sender?.name || "Someone"} invited you to join the team "${n.team?.name || ""}"`;
    }
    return n.message || "You have a new notification";
  };

  return (
    <div className="relative">
      {/* Notification icon */}
      <IconButton onClick={() => setOpenPanel(!openPanel)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Notification panel */}
      {openPanel && (
        <Paper
          elevation={6}
          className="absolute right-0 mt-2 w-96 max-h-[450px] overflow-y-auto p-3 rounded-2xl shadow-lg z-50 bg-white"
        >
          <Typography variant="h6" className="mb-3 font-bold text-slate-900">
            Notifications
          </Typography>

          {loading && <Typography className="text-gray-500 text-center">Loading...</Typography>}
          {!loading && notifications.length === 0 && (
            <Typography className="text-gray-500 text-center">No notifications</Typography>
          )}

          <List className="space-y-2">
            {notifications
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((n) => {
                const message = getNotificationMessage(n);
                const isTaskCompleted = n.type === "TASK_COMPLETED";

                return (
                  <ListItem
                    key={n._id}
                    className={`flex flex-col p-3 rounded-xl border ${
                      isTaskCompleted ? "border-green-400 bg-green-50" : "border-gray-200 bg-yellow-50"
                    }`}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="start">
                      <ListItemText
                        primary={message}
                        secondary={formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      />

                      {/* Mark read button for non-invite notifications */}
                      {n.type !== "TEAM_INVITE" && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleMarkAsRead(n._id)}
                        >
                          Mark Read
                        </Button>
                      )}
                    </Stack>

                    {/* Accept/Reject buttons for invites */}
                    {n.type === "TEAM_INVITE" && (
                      <Stack direction="row" spacing={1} mt={2}>
                        <Button
                          size="small"
                          color="primary"
                          variant="contained"
                          onClick={() => handleRespondInvite(n._id, true)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => handleRespondInvite(n._id, false)}
                        >
                          Reject
                        </Button>
                      </Stack>
                    )}
                  </ListItem>
                );
              })}
          </List>
        </Paper>
      )}

      {/* Snackbar */}
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </div>
  );
};

export default Notifications;
