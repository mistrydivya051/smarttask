import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllTeams } from "../../api/teamApi";
import { Paper, Button } from "@mui/material";
import CreateTeam from "../../components/teams/CreateTeam";
import AppSnackbar from "../../components/common/AppSnackbar";
import TeamDetails from "../../components/teams/TeamDetails";
import ReceivedInvites from "../../components/teams/ReceivedInvites";

const Teams = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // fetch all teams
  const fetchTeams = async () => {
    try {
      const res = await getAllTeams();
      console.log("Teams API:", res.data); // debug
      const allTeams = res.data.teams || [];
      const userTeams = allTeams.filter(
        (team) =>
          team.owner._id === currentUser._id ||
          team.members.some((m) => m.user._id === currentUser._id)
      );
      setTeams(userTeams);
    } catch (err) {
      console.error("Fetch teams error:", err.response?.data || err.message);
      setSnackbar({ open: true, message: "Failed to fetch teams", severity: "error" });
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Teams</h2>
        <Button variant="contained" color="primary" onClick={() => setOpenCreate(true)}>
          Create Team
        </Button>
      </div>

      {/* Received Invites */}
      <ReceivedInvites onInviteAccepted={fetchTeams} />

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {teams.map((team) => (
          <Paper
            key={team._id}
            className={`p-4 shadow-md hover:shadow-lg cursor-pointer ${
              selectedTeam?._id === team._id ? "border-2 border-indigo-600" : ""
            }`}
            onClick={() => setSelectedTeam(team)}
          >
            <h3 className="text-lg font-semibold">{team.name}</h3>
            <p className="text-gray-500">{team.membersCount || 0} Members</p>
          </Paper>
        ))}
      </div>

      {/* selected team */}
      {selectedTeam && ( <TeamDetails team={selectedTeam} currentUser={currentUser} onUpdate={fetchTeams} />)}

      {/* create team dialog */}
      {openCreate && (
        <CreateTeam onClose={() => setOpenCreate(false)} onCreated={() => { 
            fetchTeams();
            setOpenCreate(false);
            setSnackbar({ open: true, message: "Team created!", severity: "success" });
          }}
        />
      )}

    {/* snackbar notification */}
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </DashboardLayout>
  );
};

export default Teams;
