import { body } from "express-validator";

export const createTeamValidator = [
  body("name").notEmpty().withMessage("Team name is required"),
  body("description").optional().isString().withMessage("Description must be a string"),
];

export const inviteMemberValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
];

export const respondMemberInviteValidator = [
  body("response").isIn(["Accepted", "Declined"]).withMessage("Response must be either Accepted or Declined"),
];
