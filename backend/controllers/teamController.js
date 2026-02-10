import Team from "../models/Team.js";
import TeamMember from "../models/TeamMember.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js"

//create a team
export const createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const teamExists = await Team.findOne({ name });
    if (teamExists) {
      return res.status(400).json({ message: "Team with this name already exists." });
    }
    const team = await Team.create({
      name,
      description,
      owner: req.user._id
    });

    await TeamMember.create({
      team: team._id,
      user: req.user._id,
      role: "Owner"
    });
    res.status(201).json({ message: "Team created successfully.", team });
  } catch (error) {
    next(error);
  }
};

// Get team details with owner info
export const getTeamDetails = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId)
      .populate('owner', 'name email'); // Get owner name and email

    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }
    // check if current user is the owner
    const isOwner = team.owner._id.toString() === req.user._id.toString();

    res.status(200).json({
      team,
      isOwner, 
      userId: req.user._id
    });
  } catch (error) {
    next(error);
  }
};

// invite member with  notification
export const inviteMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { teamId } = req.params;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Only owner can invite
    const isOwner = await TeamMember.findOne({
      team: teamId,
      user: req.user._id,
      role: "Owner"
    });
    if (!isOwner) return res.status(403).json({ message: "Only team owners can invite members." });

    const alreadyMember = await TeamMember.findOne({ team: teamId, user: user._id });
    if (alreadyMember) return res.status(400).json({ message: "User is already a team member." });

    const existingInvite = await Notification.findOne({
      type: "TEAM_INVITE",
      receiver: user._id,
      team: teamId,
      status: "Pending"
    });
    if (existingInvite) return res.status(400).json({ message: "Invite already sent." });

    // Create invite
    const invite = await Notification.create({
      type: "TEAM_INVITE",
      sender: req.user._id,
      receiver: user._id,
      team: teamId,
      status: "Pending",
      isRead: false
    });

    res.status(200).json({ message: "Invitation sent successfully.", invite });
  } catch (error) {
    next(error);
  }
};

// Respond to invite with notification
export const respondToInvite = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const { response } = req.body;

    const notification = await Notification.findById(notificationId);
    if (!notification || notification.type !== "TEAM_INVITE")
      return res.status(404).json({ message: "Invitation not found." });

    // Only receiver can respond
    if (notification.receiver.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "This invite is not for you." });

    if (!["Accepted", "Declined"].includes(response))
      return res.status(400).json({ message: "Invalid response." });

    if (notification.status === "Accepted" || notification.status === "Declined")
      return res.status(400).json({ message: "Invite already responded." });

    notification.status = response;
    notification.isRead = true;
    await notification.save();

    // if accepted then add to team
    if (response === "Accepted") {
      const alreadyMember = await TeamMember.findOne({
        team: notification.team,
        user: req.user._id
      });
      if (!alreadyMember) {
        await TeamMember.create({
          team: notification.team,
          user: req.user._id,
          role: "Member"
        });
      }
    }
    res.status(200).json({ message: `Invitation ${response.toLowerCase()} successfully.` });
  } catch (error) {
    next(error);
  }
};

// Get all members in a team
export const getTeamMembers = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    // Check logged in user is member
    const member = await TeamMember.findOne({
      team: teamId,
      user: req.user._id
    });

    if (!member) {
      return res.status(403).json({ message: "Not allowed. You are not a team member." });
    }

    const members = await TeamMember.find({ team: teamId })
      .populate("user", "name email")
      .select("role user createdAt");

    res.status(200).json({ message: "Team members", members });
  } catch (error) {
    next(error);
  }
};

// owner can remove member
export const removeMember = async (req, res, next) => {
  try {
    const { teamId, memberId } = req.params;

    // check logged in user is owner
    const isOwner = await TeamMember.findOne({
      team: teamId,
      user: req.user._id,
      role: "Owner"
    });

    if (!isOwner) {
      return res.status(403).json({ message: "Only owner can remove members." });
    }

    // owner cannot remove themselves
    if (req.user._id.toString() === memberId.toString()) {
      return res.status(400).json({ message: "Owner cannot remove themselves." });
    }

    const deleted = await TeamMember.findOneAndDelete({
      team: teamId,
      user: memberId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Member not found in this team." });
    }

    res.status(200).json({ message: "Member removed successfully." });
  } catch (error) {
    next(error);
  }
};

// // Get all teams
// export const getAllTeams = async (req, res, next) => {
//   try {
//     // fetch all teams
//     const teams = await Team.find().lean();

//     // attach members info to each team
//     const teamsWithMembers = await Promise.all(
//       teams.map(async (team) => {
//         const members = await TeamMember.find({ team: team._id })
//           .populate("user", "name email")
//           .select("role user");
//         return {
//           ...team,
//           members,
//           membersCount: members.length
//         };
//       })
//     );

//     res.json({ teams: teamsWithMembers });
//   } catch (error) {
//     next(error);
//   }
// };


// Get all teams for logged-in user (owner or member)
export const getAllTeams = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // find all teams where user is owner OR member
    const teams = await Team.find({
      $or: [
        { owner: userId },
        { _id: { $in: await TeamMember.find({ user: userId }).distinct("team") } }
      ]
    }).lean();

    // attach members info to each team
    const teamsWithMembers = await Promise.all(
      teams.map(async (team) => {
        const members = await TeamMember.find({ team: team._id })
          .populate("user", "name email")
          .select("role user");
        return {
          ...team,
          members,
          membersCount: members.length
        };
      })
    );

    res.json({ teams: teamsWithMembers });
  } catch (error) {
    next(error);
  }
};


// Get received invites for loggedin user
export const getReceivedInvites = async (req, res, next) => {
  try {
    const invites = await Notification.find({
      receiver: req.user._id,
      type: "TEAM_INVITE",
      status: "Pending"
    })
      .populate("sender", "name email")
      .populate("team", "name");

    const formattedInvites = invites.map((i) => ({
      _id: i._id,
      senderName: i.sender.name,
      teamName: i.team.name
    }));

    res.status(200).json({ invites: formattedInvites });
  } catch (error) {
    next(error);
  }
};
