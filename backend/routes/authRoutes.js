import express from "express";
import { register, login, getAllUsers  } from "../controllers/authController.js";
import { registerValidator, loginValidator } from "../validators/authValidators.js";
import validate from "../middleware/validateMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.get("/users", protect, getAllUsers);

export default router;