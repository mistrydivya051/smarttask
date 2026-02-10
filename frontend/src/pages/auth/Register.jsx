import { useState } from "react";
import { TextField, Button, Paper } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import AppSnackbar from "../../components/common/AppSnackbar";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.errors?.[0] ||  err.response?.data?.message ||  "Registration failed" );
      setOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
      <Paper className="p-8 w-full max-w-md shadow-xl rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField label="Name" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Email" fullWidth value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}  />
          <TextField label="Password"  type="password" fullWidth value={form.password}  onChange={(e) => setForm({ ...form, password: e.target.value })} />

          <Button type="submit" variant="contained" fullWidth size="large">
            Register
          </Button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </Paper>

      <AppSnackbar
        open={open}
        message={error}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default Register;
