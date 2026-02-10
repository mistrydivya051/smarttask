import TeamMember from "./../models/TeamMember.js";

// check if creator is a team member
export const isTeamMember = async (req, res, next) => {
  try {
    const teamId = req.params.teamId || req.body.teamId || req.body.team;

    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    const member = await TeamMember.findOne({
      team: teamId,
      user: req.user._id,
    });

    if (!member) {
      return res.status(403).json({ message: "Access denied. Not a team member." });
    }

    next();
  } catch (err) {
    next(err);
  }
};

