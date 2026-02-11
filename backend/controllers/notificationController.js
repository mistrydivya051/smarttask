import Notification from "../models/Notification.js";
import TeamMember from "../models/TeamMember.js";
import Team from "../models/Team.js";

// Get all notifications for logged-in user
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ receiver: req.user._id })
      .sort({ createdAt: -1 })
      .populate("sender", "name email")
      .populate("task", "title")
      .populate("team", "name");
    
    res.status(200).json({ notifications });
  } catch (err) {
    next(err);
  }
};

// Mark notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed." });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read." });
  } catch (error) {
    next(error);
  }
};

// Respond to a team invite (accept/decline)
export const respondNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const { accept } = req.body; // boolean: true=accept, false=decline

    const notification = await Notification.findById(notificationId).populate("team");

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    if (notification.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed." });
    }

    if (notification.type !== "TEAM_INVITE") {
      return res.status(400).json({ message: "This notification is not a team invite." });
    }

    if (accept) {
      // Add user as team member if not already
      const existingMember = await TeamMember.findOne({
        team: notification.team._id,
        user: req.user._id,
      });

      if (!existingMember) {
        await TeamMember.create({
          team: notification.team._id,
          user: req.user._id,
          role: "Member",
        });
      }
    }

    // Delete notification after responding
    await notification.deleteOne();

    res.status(200).json({ message: `Invite ${accept ? "Accepted" : "Declined"}` });
  } catch (err) {
    next(err);
  }
};
