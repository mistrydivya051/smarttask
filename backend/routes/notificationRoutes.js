import express from "express";
import { getNotifications, markAsRead, respondNotification } from "../controllers/notificationController.js";
import protect  from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/read/:notificationId", protect, markAsRead);

router.post("/respond-invite/:notificationId", protect, respondNotification);

export default router;
