import { useState } from "react";
import { TextField, Button, Paper } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import AppSnackbar from "../../components/common/AppSnackbar";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0] || "Login failed");
      setOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <Paper className="p-8 w-full max-w-md shadow-xl rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-6">SmartTask Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField label="Email" fullWidth value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField label="Password" type="password" fullWidth value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/>

          <Button type="submit" variant="contained" fullWidth size="large">
            Login
          </Button>
        </form>

        <p className="text-center mt-4">
          No account?{" "}
          <Link to="/register" className="text-indigo-600 font-semibold">
            Register
          </Link>
        </p>
      </Paper>

{/* snackbar notification */}
      <AppSnackbar
        open={open}
        message={error}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default Login;
