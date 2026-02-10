import express from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTeamTasks,
  getAllTasks
} from "../controllers/taskController.js";

import { createTaskValidator } from "./../validators/taskValidators.js";
import validate from "./../middleware/validateMiddleware.js";
import protect from "./../middleware/authMiddleware.js";
import { isTeamMember } from "./../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/create", protect, createTaskValidator, validate, isTeamMember, createTask);
router.get("/", protect, getAllTasks);
router.put("/update/:taskId", protect, updateTask);
router.delete("/delete/:taskId", protect, deleteTask);
//get task by team
router.get("/:teamId", protect, isTeamMember, getTeamTasks);

export default router;
