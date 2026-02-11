import { useEffect, useState } from "react";
import { Paper, Button, Typography, Box } from "@mui/material";
import { getReceivedInvites, respondInvite } from "../../api/teamApi";
import AppSnackbar from "../common/AppSnackbar";

const ReceivedInvites = ({ onInviteAccepted }) => {
  const [invites, setInvites] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // fetch received invites
  const fetchInvites = async () => {
    try {
      const res = await getReceivedInvites();
      setInvites(res.data.invites || []);
    } catch (err) {
      console.error("Failed to fetch invites:", err.response?.data || err.message);
      setSnackbar({ open: true, message: "Failed to fetch invites", severity: "error" });
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  // respond to invite
  const handleResponse = async (notificationId, response) => {
    try {
      await respondInvite(notificationId, { response });
      setSnackbar({ open: true, message: `Invite ${response.toLowerCase()}!`, severity: "success" });
      setInvites((prev) => prev.filter((i) => i._id !== notificationId));

      if (response === "Accepted" && onInviteAccepted) {
        onInviteAccepted(); // refresh teams after accepting
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to respond to invite", severity: "error" });
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        mb: 6,
        borderRadius: "16px",
        background: "linear-gradient(135deg, #f0f4ff, #e0e7ff)",
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
        Team Invitations
      </Typography>

      {invites.length === 0 ? (
        <Typography color="gray">No pending invites</Typography>
      ) : (
        <Box className="space-y-3">
          {invites.map((invite) => (
            <Box
              key={invite._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: "12px",
                background: "#fff",
                boxShadow: 1,
              }}
            >
              <Typography>
                <strong>{invite.senderName}</strong> invited you to join <strong>{invite.teamName}</strong>
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => handleResponse(invite._id, "Accepted")}
                  sx={{ fontWeight: 600 }}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleResponse(invite._id, "Declined")}
                  sx={{ fontWeight: 600 }}
                >
                  Decline
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* snackbar notification */}
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </Paper>
  );
};

export default ReceivedInvites;
