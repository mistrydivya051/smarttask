import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-lg font-medium transition-colors duration-200
     ${isActive ? "bg-indigo-600 text-white" : "text-white hover:text-indigo-400 hover:bg-slate-800"}`;

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col">
      <h1 className="text-2xl font-bold text-indigo-400 mb-6">SmartTask</h1>
      
      <nav className="space-y-2 flex-1">
        <NavLink to="/" className={linkClasses}>
          Dashboard
        </NavLink>
        <NavLink to="/teams" className={linkClasses}>
          Teams
        </NavLink>
        <NavLink to="/tasks" className={linkClasses}>
          Tasks
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
