import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";

const Sidebar = () => {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200
     ${
       isActive
         ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
         : "text-slate-700 hover:text-indigo-700 hover:bg-indigo-100"
     }`;

  return (
    <div className="w-64 bg-white min-h-screen p-5 flex flex-col border-r border-slate-200 shadow-sm">
      {/* Logo */}
      <h1 className="text-2xl font-extrabold mb-8">
        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          SmartTask
        </span>
      </h1>

      {/* Links */}
      <nav className="space-y-3 flex-1">
        <NavLink to="/" className={linkClasses}>
          <DashboardIcon />
          Dashboard
        </NavLink>

        <NavLink to="/users" className={linkClasses}>
          <GroupIcon />
          Users
        </NavLink>

        <NavLink to="/teams" className={linkClasses}>
          <GroupIcon />
          Teams
        </NavLink>

        <NavLink to="/tasks" className={linkClasses}>
          <AssignmentIcon />
          Tasks
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
