import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllTeams } from "../../api/teamApi";
import { Paper, Button } from "@mui/material";
import CreateTeam from "../../components/teams/CreateTeam";
import AppSnackbar from "../../components/common/AppSnackbar";
import TeamDetails from "../../components/teams/TeamDetails";
import ReceivedInvites from "../../components/teams/ReceivedInvites";

// Material UI Icons
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

const Teams = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // fetching teams from backend (UI changes only)
  const fetchTeams = async () => {
    try {
      const res = await getAllTeams();
      const allTeams = res.data.teams || [];

      // filter only teams where user is owner or member
      const userTeams = allTeams.filter(
        (team) =>
          team.owner?._id === currentUser?._id ||
          team.members?.some((m) => m.user?._id === currentUser?._id)
      );

      setTeams(userTeams);

      // if selected team removed then reset selection
      if (selectedTeam) {
        const stillExists = userTeams.find((t) => t._id === selectedTeam._id);
        if (!stillExists) setSelectedTeam(null);
      }
    } catch (err) {
      console.error("Fetch teams error:", err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: "Failed to fetch teams",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Teams</h2>
          <p className="text-slate-600 mt-1">
            Manage your teams and view team details.
          </p>
        </div>

        <Button
          variant="contained"
          startIcon={<AddCircleOutlineRoundedIcon />}
          onClick={() => setOpenCreate(true)}
          sx={{
            background: "linear-gradient(90deg, #4f46e5, #9333ea)",
            borderRadius: "14px",
            fontWeight: 800,
            textTransform: "none",
            px: 2.2,
            py: 1.2,
            boxShadow: "0px 10px 25px rgba(79,70,229,0.25)",
            "&:hover": {
              background: "linear-gradient(90deg, #4338ca, #7e22ce)",
            },
          }}
        >
          Create Team
        </Button>
      </div>

      {/* Received Invites */}
      <div className="mb-8">
        <ReceivedInvites onInviteAccepted={fetchTeams} />
      </div>

      {/* Teams grid */}
      {teams.length === 0 ? (
        <Paper className="p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">No teams found</h3>
          <p className="text-slate-600 mt-2">
            Create a new team or accept an invite to get started.
          </p>
        </Paper>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {teams.map((team) => {
            const isSelected = selectedTeam?._id === team._id;
            const isOwner = team.owner?._id === currentUser?._id;

            return (
              <Paper
                key={team._id}
                className={`p-5 rounded-2xl cursor-pointer transition-all border
                ${
                  isSelected
                    ? "border-indigo-500 shadow-lg"
                    : "border-slate-200 hover:shadow-lg hover:border-indigo-200"
                }`}
                onClick={() => setSelectedTeam(team)}
              >
                {/* Team name */}
                <h3 className="text-lg font-extrabold text-slate-900">
                  {team.name}
                </h3>

                {/* Team description */}
                {team.description && (
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                    {team.description}
                  </p>
                )}

                {/* Team info */}
                <div className="flex justify-between items-center mt-4 text-sm font-semibold text-slate-700">
                  <span className="flex items-center gap-2">
                    <GroupOutlinedIcon
                      fontSize="small"
                      sx={{ color: "#4f46e5" }}
                    />
                    {team.membersCount || team.members?.length || 0} Members
                  </span>

                  <span className="flex items-center gap-2">
                    {isOwner ? (
                      <>
                        <WorkspacePremiumOutlinedIcon
                          fontSize="small"
                          sx={{ color: "#9333ea" }}
                        />
                        Owner
                      </>
                    ) : (
                      <>
                        <PersonOutlineOutlinedIcon
                          fontSize="small"
                          sx={{ color: "#64748b" }}
                        />
                        Member
                      </>
                    )}
                  </span>
                </div>
              </Paper>
            );
          })}
        </div>
      )}

      {/* Selected team details */}
      {selectedTeam && (
        <div className="mt-2">
          <TeamDetails
            team={selectedTeam}
            currentUser={currentUser}
            onUpdate={fetchTeams}
          />
        </div>
      )}

      {/* Create team dialog */}
      {openCreate && (
        <CreateTeam
          onClose={() => setOpenCreate(false)}
          onCreated={() => {
            fetchTeams();
            setOpenCreate(false);
            setSnackbar({
              open: true,
              message: "Team created successfully!",
              severity: "success",
            });
          }}
        />
      )}

      {/* Snackbar */}
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
