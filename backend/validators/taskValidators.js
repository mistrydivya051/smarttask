import { body } from "express-validator";

// validation rules for creating a task
export const createTaskValidator = [
  body("title").notEmpty().withMessage("Task title is required"),
  body("description").optional().isString().withMessage("Description must be a string"),
  body("priority").isIn(["Low", "Medium", "High"]).withMessage("Priority must be Low, Medium, or High"),
  body("dueDate").optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Due date must be in YYYY-MM-DD format"),
  body("team").notEmpty().withMessage("Team ID is required"),
  body("assignedTo").optional().isMongoId().withMessage("Assigned user must be a valid ID"),
];

//validation rules for updating a task
export const updateTaskStatusValidator = [
  body("status")
    .isIn(["To Do", "In Progress", "Completed"])
    .withMessage("Invalid task status")
];