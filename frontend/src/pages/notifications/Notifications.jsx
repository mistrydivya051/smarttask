import { useEffect, useState } from "react";
import { IconButton, List, ListItem, ListItemText, Button, Badge, Paper } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { getNotifications, respondNotification, markAsRead } from "../../api/notificationApi";
import AppSnackbar from "../../components/common/AppSnackbar";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [openPanel, setOpenPanel] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data.notifications || []);
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

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Mark as read error:", err.response?.data || err.message);
      setSnackbar({ open: true, message: "Failed to mark as read", severity: "error" });
    }
  };

  const handleRespondInvite = async (id, response) => {
    try {
      await respondNotification(id, { accept: response });
      setNotifications((prev) => prev.filter((n) => n._id !== id)); // remove invite after response
      setSnackbar({ open: true, message: `Invite ${response ? "accepted" : "rejected"}`, severity: "success" });
    } catch (err) {
      console.error("Respond invite error:", err.response?.data || err.message);
      setSnackbar({ open: true, message: "Failed to respond to invite", severity: "error" });
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      {/* notification icon */}
      <IconButton onClick={() => setOpenPanel(!openPanel)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* notification panel */}
      {openPanel && (
        <Paper
          elevation={3}
          className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto p-2 z-50"
        >
          {loading && <p>Loading...</p>}
          {!loading && notifications.length === 0 && <p>No notifications</p>}

          <List>
            {notifications.map((n) => (
              <ListItem
                key={n._id}
                className={`${!n.isRead ? "bg-gray-100" : ""} rounded mb-1`}
              >
                <ListItemText
                  primary={n.message}
                  secondary={new Date(n.createdAt).toLocaleString()}
                />
                {!n.isRead && (
                  <Button size="small" onClick={() => handleMarkAsRead(n._id)}>
                    Mark Read
                  </Button>
                )}
                {n.type === "TEAM_INVITE" && (
                  <div className="flex gap-1 ml-2">
                    <Button
                      size="small"
                      color="primary"
                      variant="outlined"
                      onClick={() => handleRespondInvite(n._id, true)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => handleRespondInvite(n._id, false)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

     {/* snackbar notification */}
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
