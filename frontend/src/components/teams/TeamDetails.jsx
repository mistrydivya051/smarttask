import { useState, useEffect } from "react";
import { Paper, TextField, Button } from "@mui/material";
import { getTeamMembers, inviteMember } from "../../api/teamApi";
import AppSnackbar from "../common/AppSnackbar";
import TeamMembers from "./TeamMembers";

const TeamDetails = ({ team, currentUser, onInviteSent }) => {
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // fetch members of the team
  const fetchMembers = async () => {
    try {
      const res = await getTeamMembers(team._id);
      setMembers(res.data.members || []);
    } catch (err) {
      console.error("Failed to fetch members:", err.response?.data || err.message);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to fetch members", severity: "error" });
    }
  };

  useEffect(() => {
    if (team) fetchMembers();
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
    onInviteSent && onInviteSent(); // refresh parent state if needed
  } catch (err) {
    console.error("Failed to send invite:", err.response?.data || err.message);
    setSnackbar({
      open: true,
      message: err.response?.data?.message || "Failed to send invite",
      severity: "error"
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Paper className="p-4">
        <h3 className="text-xl font-bold mb-2">{team.name}</h3>
        <p className="text-gray-600 mb-4">{team.description}</p>

        {/* invitaion section*/}
        {team.owner._id === currentUser._id && (
          <div className="flex gap-2 mb-4">
            <TextField label="Invite Member by Email" size="small" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} disabled={loading}/>
            <Button variant="contained" onClick={handleInvite} disabled={loading}>
              {loading ? "Inviting..." : "Invite"}
            </Button>
          </div>
        )}


        <TeamMembers teamId={team._id} currentUser={currentUser} onMembersUpdated={fetchMembers} />
        <h4 className="font-semibold mb-2">Members</h4>
        <ul className="list-disc list-inside">
          {members.map((m) => (
            <li key={m._id}>
              {m.user.name} ({m.role})
            </li>
          ))}
        </ul>
      </Paper>

      {/* snackbar notification */}
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
