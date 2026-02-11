import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/AuthContext";
import Notifications from "../../pages/notifications/Notifications";

const Navbar = () => {
  const { logout } = useAuth();

  // Get user info from context or localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar className="flex justify-between">
        <Typography variant="h6" className="text-indigo-600 font-bold">
          SmartTask
        </Typography>

        <div className="flex items-center gap-4">
          {user && (
            <Typography
              variant="body1"
              className="text-gray-800 font-medium"
            >
              Hello, {user.name}
            </Typography>
          )}

          {/* Notification icon + panel */}
          <Notifications />

          {/* Logout button */}
          <IconButton
            onClick={logout}
            color="error"
            className="hover:bg-red-100"
            title="Logout"
          >
            <LogoutIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
