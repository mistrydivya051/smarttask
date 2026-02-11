import { useEffect, useState } from "react";
import {IconButton,List,ListItem,ListItemText,Button,Badge,Paper,Typography} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { getNotifications, markAsRead, respondNotification } from "../../api/notificationApi";
import AppSnackbar from "../../components/common/AppSnackbar";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [openPanel, setOpenPanel] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      // Filter out notifications that are read and invites already responded
      const filtered = res.data.notifications?.filter(
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

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      // Remove the notification from state after marking read
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Mark as read error:", err.response?.data || err.message);
      setSnackbar({ open: true, message: "Failed to mark as read", severity: "error" });
    }
  };

  const handleRespondInvite = async (id, accept) => {
    try {
      const responseString = accept ? "Accepted" : "Declined";
      const res = await respondNotification(id, { response: responseString });
      // Remove invite notification immediately
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

  const unreadCount = notifications.length; // only showing unread/pending invites

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
          elevation={3}
          className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto p-2 z-50"
        >
          {loading && <Typography className="text-gray-500">Loading...</Typography>}
          {!loading && notifications.length === 0 && (
            <Typography className="text-gray-500">No notifications</Typography>
          )}

          <List>
            {notifications
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((n) => {
                let message = "";
                if (n.type === "TASK_ASSIGNED") {
                  message = `${n.sender?.name} assigned you: ${n.task?.title}`;
                } else if (n.type === "TEAM_INVITE") {
                  message = `${n.sender?.name} invited you to a team`;
                } else {
                  message = n.message || "Notification";
                }

                return (
                  <ListItem
                    key={n._id}
                    className={`flex flex-col p-2 mb-1 rounded bg-yellow-100`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <ListItemText
                        primary={message}
                        secondary={formatDistanceToNow(new Date(n.createdAt), {
                          addSuffix: true,
                        })}
                      />
                      {n.type !== "TEAM_INVITE" && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleMarkAsRead(n._id)}
                        >
                          Mark Read
                        </Button>
                      )}
                    </div>

                    {n.type === "TEAM_INVITE" && (
                      <div className="flex gap-2 mt-1">
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
                      </div>
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
