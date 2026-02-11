import { useState } from "react";
import { TextField, Button, Paper, Divider } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import AppSnackbar from "../../components/common/AppSnackbar";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0] ||
          err.response?.data?.message ||
          "Registration failed"
      );
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      {/* soft blobs */}
      <motion.div
        animate={{ x: [0, 18, 0], y: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-300/40 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -15, 0], y: [0, -10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-300/40 blur-3xl"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative w-full max-w-md"
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "22px",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(99,102,241,0.15)",
            boxShadow: "0 18px 40px rgba(99,102,241,0.18)",
          }}
        >
          {/* Title */}
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-extrabold tracking-tight"
            >
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                SmartTask
              </span>
            </motion.h2>

            <p className="text-sm text-slate-600 mt-1">
              Create your account and start managing tasks 
            </p>
          </div>

          <Divider className="!my-6" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Name"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  background: "#fff",
                },
              }}
            />

            <TextField
              label="Email"
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  background: "#fff",
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  background: "#fff",
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                py: 1.4,
                borderRadius: "14px",
                fontWeight: 800,
                textTransform: "none",
                fontSize: "16px",
                background:
                  "linear-gradient(90deg, #4f46e5, #7c3aed, #d946ef)",
                boxShadow: "0 12px 28px rgba(99,102,241,0.28)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #4338ca, #6d28d9, #c026d3)",
                },
              }}
            >
              {loading ? "Creating..." : "Register"}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </Paper>
      </motion.div>

      <AppSnackbar open={open} message={error} onClose={() => setOpen(false)} />
    </div>
  );
};

export default Register;
