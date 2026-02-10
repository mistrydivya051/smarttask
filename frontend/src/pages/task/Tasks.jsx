// import { useEffect, useState } from "react";
// import { Paper, Button, TextField, MenuItem } from "@mui/material";

// import DashboardLayout from "../../components/layout/DashboardLayout";
// import { getAllTeams } from "../../api/teamApi";
// import { getTeamTasks } from "../../api/taskApi";

// import CreateTask from "../../components/tasks/CreateTask";
// import TaskCard from "../../components/tasks/TaskCard";
// import AppSnackbar from "../../components/common/AppSnackbar";

// const Tasks = () => {
//   const currentUser = JSON.parse(localStorage.getItem("user"));

//   const [teams, setTeams] = useState([]);
//   const [selectedTeamId, setSelectedTeamId] = useState("");

//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [openCreate, setOpenCreate] = useState(false);

//   const [searchText, setSearchText] = useState("");
//   const [priorityFilter, setPriorityFilter] = useState("");

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "info",
//   });

//   //fetch teams user belongs to
//   const fetchTeams = async () => {
//     try {
//       const res = await getAllTeams();
//       const allTeams = res.data.teams || [];

//       const userTeams = allTeams.filter((t) => {
//         const isOwner = t.owner?._id === currentUser?._id;
//         const isMember = t.members?.some((m) => m.user?._id === currentUser?._id);
//         return isOwner || isMember;
//       });

//       setTeams(userTeams);

//       if (!selectedTeamId && userTeams.length > 0) {
//         setSelectedTeamId(userTeams[0]._id);
//       }
//     } catch (err) {
//       console.error("Fetch teams error:", err.response?.data || err.message);
//       setSnackbar({
//         open: true,
//         message: "Failed to fetch teams",
//         severity: "error",
//       });
//     }
//   };

//   //Fetch tasks for selected team with search & priority
//   const fetchTasks = async (teamId) => {
//     if (!teamId) return;

//     setLoading(true);
//     try {
//       const params = {};
//       if (searchText) params.search = searchText;
//       if (priorityFilter) params.priority = priorityFilter;

//       const res = await getTeamTasks(teamId, params);
//       setTasks(res.data.tasks || []);
//     } catch (err) {
//       console.error("Fetch tasks error:", err.response?.data || err.message);
//       setSnackbar({
//         open: true,
//         message: err.response?.data?.message || err.message || "Failed to fetch tasks",
//         severity: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeams();
//   }, []);

//   useEffect(() => {
//     if (selectedTeamId) fetchTasks(selectedTeamId);
//   }, [selectedTeamId, searchText, priorityFilter]);

//   return (
//     <DashboardLayout>
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Tasks</h2>

//         <Button variant="contained" onClick={() => setOpenCreate(true)} disabled={!selectedTeamId}>
//           Create Task
//         </Button>
//       </div>

//       {/* team tabs */}
//       <div className="flex gap-3 mb-4 overflow-x-auto">
//         {teams.map((team) => (
//           <Paper
//             key={team._id}
//             onClick={() => setSelectedTeamId(team._id)}
//             className={`px-4 py-2 cursor-pointer whitespace-nowrap rounded-lg ${
//               selectedTeamId === team._id
//                 ? "bg-indigo-600 text-white transition-colors duration-300"
//                 : "bg-gray-100"
//             }`}
//           >
//             {team.name}
//           </Paper>
//         ))}
//       </div>

//       {/* search and filter */}
//       <div className="flex gap-3 mb-4">
//         <TextField label="Search by Title"  value={searchText} onChange={(e) => setSearchText(e.target.value)} fullWidth/>

//         <TextField select label="Priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ minWidth: 150 }}>
//           <MenuItem value="">All</MenuItem>
//           <MenuItem value="Low">Low</MenuItem>
//           <MenuItem value="Medium">Medium</MenuItem>
//           <MenuItem value="High">High</MenuItem>
//         </TextField>
//       </div>

//       {/* task list */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {loading && <p>Loading tasks...</p>}

//         {!loading && tasks.length === 0 && (
//           <p className="text-gray-500">No tasks found for this team.</p>
//         )}

//         {tasks.map((task) => (
//           <TaskCard  key={task._id} task={task} onUpdated={() => fetchTasks(selectedTeamId)}/>
//         ))}
//       </div>

//       {/* create task dialog */}
//       {openCreate && (
//         <CreateTask defaultTeamId={selectedTeamId} onClose={() => setOpenCreate(false)} onCreated={() => {
//             fetchTasks(selectedTeamId);
//             setOpenCreate(false);
//             setSnackbar({
//               open: true,
//               message: "Task created successfully!",
//               severity: "success",
//             });
//           }}
//         />
//       )}

//       {/* snackbar notification */}
//       <AppSnackbar
//         open={snackbar.open}
//         message={snackbar.message}
//         severity={snackbar.severity}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       />
//     </DashboardLayout>
//   );
// };

// export default Tasks;


import { useEffect, useState } from "react";
import { Paper, Button, TextField, MenuItem } from "@mui/material";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllTeams } from "../../api/teamApi";
import { getTeamTasks } from "../../api/taskApi";

import CreateTask from "../../components/tasks/CreateTask";
import TaskCard from "../../components/tasks/TaskCard";
import AppSnackbar from "../../components/common/AppSnackbar";

const Tasks = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id;

  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch teams user belongs to
  const fetchTeams = async () => {
    try {
      const res = await getAllTeams();
      const allTeams = res.data.teams || [];

      const userTeams = allTeams.filter((t) => {
        const isOwner = t.owner?._id === currentUserId;
        const isMember = t.members?.some((m) => m.user?._id === currentUserId);
        return isOwner || isMember;
      });

      setTeams(userTeams);

      if (!selectedTeamId && userTeams.length > 0) {
        setSelectedTeamId(userTeams[0]._id);
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

  // Fetch tasks for selected team
  const fetchTasks = async (teamId) => {
    if (!teamId) return;
    setLoading(true);
    try {
      const params = {};
      if (searchText) params.search = searchText;
      if (priorityFilter) params.priority = priorityFilter;

      const res = await getTeamTasks(teamId, params);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Fetch tasks error:", err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || "Failed to fetch tasks",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeamId) fetchTasks(selectedTeamId);
  }, [selectedTeamId, searchText, priorityFilter]);

  const selectedTeam = teams.find((t) => t._id === selectedTeamId);
  const isOwner = selectedTeam?.owner?._id === currentUserId;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tasks</h2>

        {isOwner && (
          <Button variant="contained" onClick={() => setOpenCreate(true)}>
            Create Task
          </Button>
        )}
      </div>

      {/* team tabs */}
      <div className="flex gap-3 mb-4 overflow-x-auto">
        {teams.map((team) => (
          <Paper
            key={team._id}
            onClick={() => setSelectedTeamId(team._id)}
            className={`px-4 py-2 cursor-pointer whitespace-nowrap rounded-lg ${
              selectedTeamId === team._id
                ? "bg-indigo-600 text-white transition-colors duration-300"
                : "bg-gray-100"
            }`}
          >
            {team.name}
          </Paper>
        ))}
      </div>

      {/* search and filter */}
      <div className="flex gap-3 mb-4">
        <TextField
          label="Search by Title"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          fullWidth
        />

        <TextField
          select
          label="Priority"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>
      </div>

      {/* task list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p>Loading tasks...</p>}
        {!loading && tasks.length === 0 && (
          <p className="text-gray-500">No tasks found for this team.</p>
        )}

        {!loading &&
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              teamMembers={selectedTeam?.members || []}
              currentUserId={currentUserId}
              isOwner={isOwner}
              onUpdated={() => fetchTasks(selectedTeamId)}
            />
          ))}
      </div>

      {/* create task dialog */}
      {openCreate && (
        <CreateTask
          defaultTeamId={selectedTeamId}
          onClose={() => setOpenCreate(false)}
          onCreated={() => {
            fetchTasks(selectedTeamId);
            setOpenCreate(false);
            setSnackbar({
              open: true,
              message: "Task created successfully!",
              severity: "success",
            });
          }}
        />
      )}

      {/* snackbar */}
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </DashboardLayout>
  );
};

export default Tasks;
