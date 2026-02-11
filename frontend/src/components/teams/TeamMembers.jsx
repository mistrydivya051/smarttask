import { useState, useEffect } from "react";
import { Paper, Button, Typography, Box } from "@mui/material";
import { getTeamMembers, removeMember } from "../../api/teamApi";
import AppSnackbar from "../common/AppSnackbar";

const TeamMembers = ({ teamId, currentUser, onMembersUpdated }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // fetch team members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await getTeamMembers(teamId);
      setMembers(res.data.members || []);
    } catch (err) {
      console.error("Failed to fetch members:", err.response?.data || err.message);
      setSnackbar({ open: true, message: "Failed to fetch members", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) fetchMembers();
  }, [teamId]);

  // remove member
  const handleRemove = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      await removeMember(teamId, memberId);
      setSnackbar({ open: true, message: "Member removed successfully", severity: "success" });
      fetchMembers();
      onMembersUpdated && onMembersUpdated(); // parent refresh
    } catch (err) {
      console.error("Failed to remove member:", err.response?.data || err.message);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to remove member", severity: "error" });
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: "16px",
        background: "linear-gradient(135deg, #f3f4f6, #e0e7ff)",
        boxShadow: 3,
        mb: 4,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
        Team Members
      </Typography>

      {members.length === 0 ? (
        <Typography color="gray">No members found.</Typography>
      ) : (
        <Box className="space-y-2">
          {members.map((m) => (
            <Box
              key={m._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: "12px",
                background: "#fff",
                boxShadow: 1,
                mb: 1,
              }}
            >
              <Typography>{m.user.name} ({m.role})</Typography>

              {/* Remove button only for owner */}
              {currentUser._id === m.teamOwnerId && m.role !== "Owner" && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleRemove(m.user._id)}
                  sx={{
                    fontWeight: 600,
                    "&:hover": { background: "rgba(239,68,68,0.08)" },
                  }}
                >
                  Remove
                </Button>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Snackbar */}
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

export default TeamMembers;
