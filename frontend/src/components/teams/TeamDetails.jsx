import { useState, useEffect } from "react";
import {Paper,TextField,Button,Typography,Box,Dialog,DialogTitle,DialogContent,DialogActions,} from "@mui/material";
import { getTeamMembers, inviteMember, updateTeam, deleteTeam } from "../../api/teamApi";
import AppSnackbar from "../common/AppSnackbar";
import TeamMembers from "./TeamMembers";

const TeamDetails = ({ team, currentUser, onUpdate }) => {
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [openEdit, setOpenEdit] = useState(false);
  const [teamName, setTeamName] = useState(team.name);
  const [teamDescription, setTeamDescription] = useState(team.description);

  const fetchMembers = async () => {
    try {
      const res = await getTeamMembers(team._id);
      setMembers(res.data.members || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to fetch members", severity: "error" });
    }
  };

  useEffect(() => {
    if (team) {
      fetchMembers();
      setTeamName(team.name);
      setTeamDescription(team.description || "");
    }
  }, [team]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setSnackbar({ open: true, message: "Email is required", severity: "error" });
      return;
    }
    setLoading(true);
    try {
      await inviteMember(team._id, { email: inviteEmail });
      setInviteEmail("");
      setSnackbar({ open: true, message: "Invitation sent!", severity: "success" });
      fetchMembers();
      onUpdate && onUpdate();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to send invite", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeam = async () => {
    if (!teamName.trim()) {
      setSnackbar({ open: true, message: "Team name is required", severity: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await updateTeam(team._id, { name: teamName, description: teamDescription });
      setSnackbar({ open: true, message: "Team updated successfully!", severity: "success" });
      setOpenEdit(false);
      onUpdate && onUpdate(res.data.team);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to update team", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    setLoading(true);
    try {
      await deleteTeam(team._id);
      setSnackbar({ open: true, message: "Team deleted successfully!", severity: "success" });
      onUpdate && onUpdate(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to delete team", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const isOwner = team.owner._id === currentUser._id;

  return (
    <>
      <Paper
        className="p-6 mb-6"
        sx={{
          borderRadius: "16px",
          background: "linear-gradient(135deg, #f3f4f6, #e0e7ff)",
          boxShadow: 3,
        }}
      >
        {/* Team Header */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {team.name}
        </Typography>
        {team.description && (
          <Typography variant="body2" sx={{ color: "#6b7280", mb: 4 }}>
            {team.description}
          </Typography>
        )}

        {/* Owner Actions */}
        {isOwner && (
          <Box className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
            {/* Invite */}
            <Box className="flex gap-2 flex-1">
              <TextField
                label="Invite Member by Email"
                size="small"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={loading}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleInvite}
                disabled={loading}
                sx={{
                  background: "linear-gradient(90deg, #4f46e5, #9333ea)",
                  fontWeight: 700,
                  textTransform: "none",
                  px: 2.2,
                  py: 1.2,
                  "&:hover": {
                    background: "linear-gradient(90deg, #4338ca, #7e22ce)",
                  },
                }}
              >
                {loading ? "Inviting..." : "Invite"}
              </Button>
            </Box>

            {/* Edit & Delete */}
            <Box className="flex gap-2 mt-2 md:mt-0">
              <Button
                variant="contained"
                onClick={() => setOpenEdit(true)}
                sx={{
                  background: "linear-gradient(90deg, #4f46e5, #9333ea)",
                  fontWeight: 700,
                  textTransform: "none",
                  px: 2.2,
                  py: 1.2,
                  "&:hover": { background: "linear-gradient(90deg, #4338ca, #7e22ce)" },
                }}
              >
                Edit Team
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteTeam}
                sx={{
                  fontWeight: 700,
                  textTransform: "none",
                  px: 2.2,
                  py: 1.2,
                  boxShadow: "0px 10px 25px rgba(239,68,68,0.25)",
                  "&:hover": { backgroundColor: "#dc2626" },
                }}
              >
                Delete Team
              </Button>
            </Box>
          </Box>
        )}

        {/* Team Members */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Members
        </Typography>

        <TeamMembers teamId={team._id} currentUser={currentUser} onMembersUpdated={fetchMembers} />

        <ul className="list-disc list-inside text-gray-700 mt-2">
          {members.map((m) => (
            <li key={m._id}>
              {m.user.name} ({m.role})
            </li>
          ))}
        </ul>
      </Paper>

      {/* Edit Team Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <Paper
          sx={{
            p: 3,
            background: "linear-gradient(135deg, #f3f4f6, #e0e7ff)",
            borderRadius: "16px",
          }}
        >
          <DialogTitle>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(90deg, #4f46e5, #9333ea)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Edit Team
            </Typography>
          </DialogTitle>
          <DialogContent className="space-y-4">
            <TextField
              label="Team Name"
              fullWidth
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={2}
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)} sx={{ color: "#64748b", fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateTeam}
              disabled={loading}
              sx={{
                background: "linear-gradient(90deg, #4f46e5, #9333ea)",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { background: "linear-gradient(90deg, #4338ca, #7e22ce)" },
              }}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogActions>
        </Paper>
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

export default TeamDetails;
