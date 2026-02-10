import { useState, useEffect } from "react";
import { Paper, Button } from "@mui/material";
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
      onMembersUpdated && onMembersUpdated(); // optional parent refresh
    } catch (err) {
      console.error("Failed to remove member:", err.response?.data || err.message);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to remove member", severity: "error" });
    }
  };

  return (
    <Paper className="p-4">
      <h3 className="text-xl font-bold mb-4">Team Members</h3>

      {members.length === 0 && <p>No members found.</p>}
      <ul className="space-y-2">
        {members.map((m) => (
          <li key={m._id} className="flex justify-between items-center">
            <span>{m.user.name} ({m.role})</span>
            {/* show Remove button only if current user is owner and the member is not the owner */}
            {currentUser._id === m.teamOwnerId && m.role !== "Owner" && (
              <Button variant="outlined" color="error" size="small" onClick={() => handleRemove(m.user._id)} >
                Remove
              </Button>
            )}
          </li>
        ))}
      </ul>

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

export default TeamMembers;
