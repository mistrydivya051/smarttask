import { useEffect, useState } from "react";
import { Paper, Button } from "@mui/material";
import { getReceivedInvites, respondInvite } from "../../api/teamApi";
import AppSnackbar from "../common/AppSnackbar";

const ReceivedInvites = ({ onInviteAccepted }) => {
  const [invites, setInvites] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const fetchInvites = async () => {
    try {
      const res = await getReceivedInvites();
      console.log("Received Invites API:", res.data); // check data
      setInvites(res.data.invites || []);
    } catch (err) {
      console.error("Failed to fetch invites:", err.response?.data || err.message);
      setSnackbar({ open: true, message: "Failed to fetch invites", severity: "error" });
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleResponse = async (notificationId, response) => {
    try {
      await respondInvite(notificationId, { response });
      setSnackbar({ open: true, message: `Invite ${response.toLowerCase()}!`, severity: "success" });
      setInvites((prev) => prev.filter((i) => i._id !== notificationId));

      if (response === "Accepted" && onInviteAccepted) {
        onInviteAccepted(); // refresh teams after accepting invite
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to respond to invite", severity: "error" });
    }
  };

  return (
    <Paper className="p-4 mb-6">
      <h3 className="text-xl font-bold mb-2">Team Invitations</h3>
      {invites.length === 0 ? (
        <p>No pending invites</p>
      ) : (
        invites.map((invite) => (
          <div key={invite._id} className="flex justify-between items-center mb-2">
            <span>
              {invite.senderName} invited you to join <strong>{invite.teamName}</strong>
            </span>
            <div className="flex gap-2">
              <Button variant="contained" color="success" size="small" onClick={() => handleResponse(invite._id, "Accepted")} >
                Accept
              </Button>
              <Button variant="outlined" color="error" size="small" onClick={() => handleResponse(invite._id, "Declined")} > 
                Decline
              </Button>
            </div>
          </div>
        ))
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
