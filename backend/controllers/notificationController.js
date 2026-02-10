import Notification from "./../models/Notification.js";

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user._id
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name")
      .populate("team", "name")
      .populate("task", "title");

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};


// mark a notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    // only receiver can update
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
