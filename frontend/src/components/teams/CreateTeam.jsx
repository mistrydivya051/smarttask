import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Paper, Typography } from "@mui/material";
import { createTeam } from "../../api/teamApi";
import AppSnackbar from "../common/AppSnackbar";

const CreateTeam = ({ onClose, onCreated }) => {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // handle creating new team
  const handleCreate = async () => {
    if (!teamName.trim()) {
      setSnackbar({ open: true, message: "Team name is required", severity: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await createTeam({ name: teamName, description: teamDescription });
      onCreated(res.data.team); // refresh teams in parent

      // reset form
      setTeamName("");
      setTeamDescription("");

      setSnackbar({ open: true, message: "Team created successfully!", severity: "success" });
      onClose(); // close dialog after creation
    } catch (err) {
      console.error("Create team error:", err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to create team",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Dialog container */}
      <Dialog open onClose={onClose} fullWidth maxWidth="sm">
        {/* Custom Paper for gradient & card feel */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            background: "linear-gradient(135deg, #f3f4f6, #e0e7ff)",
            borderRadius: "16px",
          }}
        >
          {/* Dialog title */}
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
              Create New Team
            </Typography>
          </DialogTitle>

          {/* Form inputs */}
          <DialogContent className="space-y-4">
            <TextField
              label="Team Name"
              fullWidth
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              disabled={loading}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={2}
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              disabled={loading}
            />
          </DialogContent>

          {/* Actions */}
          <DialogActions>
            <Button
              onClick={onClose}
              disabled={loading}
              sx={{ color: "#64748b", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={loading}
              sx={{
                background: "linear-gradient(90deg, #4f46e5, #9333ea)",
                fontWeight: 700,
                "&:hover": {
                  background: "linear-gradient(90deg, #4338ca, #7e22ce)",
                },
              }}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>

      {/* Snackbar notification */}
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default CreateTeam;
