import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { createTeam } from "../../api/teamApi";
import AppSnackbar from "../common/AppSnackbar";

const CreateTeam = ({ onClose, onCreated }) => {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCreate = async () => {
    if (!teamName.trim()) {
      setSnackbar({ open: true, message: "Team name is required", severity: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await createTeam({ name: teamName, description: teamDescription });
      onCreated(res.data.team); // callback to refresh team list

      setTeamName("");
      setTeamDescription("");

      setSnackbar({ open: true, message: "Team created successfully!", severity: "success" });
      onClose(); // close the dialog after creation
    } catch (err) {
      console.error("Create team error:", err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to create team",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Create New Team</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField label="Team Name" fullWidth value={teamName} onChange={(e) => setTeamName(e.target.value)} disabled={loading}/>
          <TextField label="Description" fullWidth multiline minRows={2} value={teamDescription} onChange={(e) => setTeamDescription(e.target.value)} disabled={loading}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* snackbar notification */}
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
