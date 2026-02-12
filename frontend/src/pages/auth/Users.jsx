import { useEffect, useState } from "react";
import { Stack, Typography, TextField } from "@mui/material";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllUsers } from "../../api/authApi";
import UserCard from "../../components/users/UserCard";
import AppSnackbar from "../../components/common/AppSnackbar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to fetch users",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <Stack mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Users
        </Typography>
      </Stack>

      {/* Search */}
      <Stack mb={4}>
        <TextField
          label="Search users"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          fullWidth
        />
      </Stack>

      {/* Users Grid (SAME STYLE AS TASKS) */}
      <Stack direction="row" spacing={3} flexWrap="wrap">
        {loading && <Typography>Loading users...</Typography>}

        {!loading && filteredUsers.length === 0 && (
          <Typography color="text.secondary">No users found.</Typography>
        )}

        {!loading &&
          filteredUsers.map((user, index) => (
            <UserCard key={index} user={user} />
          ))}
      </Stack>

      {/* Snackbar */}
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

export default Users;
