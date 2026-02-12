import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors"; // cors for cross-origin requests

import errorHandler from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express(); 

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());

//for local
// app.use(cors({
//   origin: "http://localhost:5173", // frontend URL
//   methods: ["GET","POST","PUT","DELETE","OPTIONS"],
//   credentials: true
// }));


//for render
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://smarttask-frontend.onrender.com"
  ],
  credentials: true
}));

app.options("*", cors())

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SmartTask API running" });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
