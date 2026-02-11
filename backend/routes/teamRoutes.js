import express from "express";
import { createTeam, inviteMember, respondToInvite, getTeamDetails,getTeamMembers,removeMember, getReceivedInvites, getAllTeams, updateTeam, deleteTeam} from "../controllers/teamController.js";
import { createTeamValidator, inviteMemberValidator, respondMemberInviteValidator } from "../validators/teamValidators.js";
import validate from "../middleware/validateMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/received-invites", protect, getReceivedInvites);
router.post("/create", protect, createTeamValidator, validate, createTeam);
router.get("/", protect, getAllTeams);
router.get("/:teamId", protect, getTeamDetails);
router.post("/invite/:teamId", protect, inviteMemberValidator, validate, inviteMember);
router.post("/respond-invite/:notificationId", protect, respondMemberInviteValidator, validate, respondToInvite);
router.get("/members/:teamId", protect, getTeamMembers);
router.delete("/:teamId/remove/:memberId", protect, removeMember);
router.put("/update/:teamId",protect, createTeamValidator, validate, updateTeam);
router.delete("/delete/:teamId",protect, deleteTeam);


export default router;