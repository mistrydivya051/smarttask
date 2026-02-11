import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/AuthContext";
import Notifications from "../../pages/notifications/Notifications";

const Navbar = () => {
  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        color: "#0f172a",
      }}
    >
      <Toolbar className="flex justify-between">
        {/* App title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            letterSpacing: "0.6px",
            background: "linear-gradient(90deg, #4f46e5, #9333ea)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          SmartTask
        </Typography>

        <Box className="flex items-center gap-4">
          {/* User greeting */}
          {user && (
            <Typography
              variant="body1"
              sx={{
                color: "rgba(15, 23, 42, 0.85)",
                fontWeight: 600,
              }}
            >
              Hello, {user.name}
            </Typography>
          )}

          <Box
            sx={{
              "& svg": {
                color: "#0f172a !important",
              },
            }}
          >
            <Notifications />
          </Box>

          {/* logout */}
          <IconButton
            onClick={logout}
            sx={{
              color: "#ef4444",
              background: "rgba(239, 68, 68, 0.08)",
              "&:hover": {
                background: "rgba(239, 68, 68, 0.18)",
              },
            }}
            title="Logout"
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
