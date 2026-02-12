import { Paper, Stack, Typography, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const UserCard = ({ user }) => {
  return (
    <Paper className="p-4 rounded-2xl shadow-lg flex flex-col justify-between">
      <Stack spacing={2} alignItems="center">
        <Avatar
          sx={{
            width: 56,
            height: 56,
            background: "linear-gradient(90deg, #6366f1, #a855f7)",
            boxShadow: "0px 8px 20px rgba(99,102,241,0.4)",
          }}
        >
          <PersonIcon />
        </Avatar>

        <Typography variant="h6" fontWeight="bold">
          {user.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default UserCard;
