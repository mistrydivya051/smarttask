import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    // Reference to the Team
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // Role of the member in the team
    role: {
      type: String,
      enum: ["Owner", "Member"],
      default: "Member"
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});

teamMemberSchema.index({ team: 1, user: 1 }, { unique: true });

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
export default TeamMember;