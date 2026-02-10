// import Task from "./../models/Task.js";
// import TeamMember from "./../models/TeamMember.js";
// import Notification from "./../models/Notification.js";

// //create task
// export const createTask = async (req, res, next) => {
//   try {
//     const { title, description, priority, dueDate, assignedTo, team } = req.body;

//     //team is required
//     if (!team) {
//       return res.status(400).json({ message: "Team is required" });
//     }

//     //check creator is a member
//     const creatorMember = await TeamMember.findOne({
//       team: team,
//       user: req.user._id
//     });

//     if (!creatorMember) {
//       return res.status(403).json({ message: "Not a team member" });
//     }

//     //assigned user must be a member
//     if (assignedTo) {
//       const assignedMember = await TeamMember.findOne({
//         team: team,
//         user: assignedTo
//       });

//       if (!assignedMember) {
//         return res.status(400).json({
//           message: "Cannot assign. User did not accept invite."
//         });
//       }
//     }

//     const existingTask = await Task.findOne({ team, title: title.trim() });

//     if (existingTask) {
//       return res.status(400).json({
//         message: "Task with this title already exists in this team."
//       });
//     }

//     //create task
//     const task = await Task.create({
//       title,
//       description,
//       priority,
//       dueDate,
//       team,
//       assignedTo: assignedTo || null,
//       createdBy: req.user._id
//     });

//     //notification
//     if (assignedTo) {
//       const existingNotification = await Notification.findOne({
//         type: "TASK_ASSIGNED",
//         receiver: assignedTo,
//         team,
//         task: task._id
//       });

//       if (!existingNotification) {
//         await Notification.create({
//           type: "TASK_ASSIGNED",
//           sender: req.user._id,
//           receiver: assignedTo,
//           task: task._id,
//           team,
//           status: "Pending",
//           isRead: false
//         });
//       }
//     }
//     return res.status(201).json({
//       message: "Task created successfully",
//       task
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// //update task
// export const updateTask = async (req, res, next) => {
//   try {
//     const task = await Task.findById(req.params.taskId);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     // only creator or team owner can update
//     const isOwner = await TeamMember.findOne({
//       team: task.team,
//       user: req.user._id,
//       role: "Owner"
//     });

//     if (task.createdBy.toString() !== req.user._id.toString() && !isOwner) {
//       return res.status(403).json({ message: "Permission denied" });
//     }

//     // allow only these fields to update
//     const allowedFields = ["title", "description", "status", "priority", "dueDate", "assignedTo"];

//     allowedFields.forEach((field) => {
//       if (req.body[field] !== undefined) {
//         task[field] = req.body[field];
//       }
//     });

//     await task.save();

//     res.json({ message: "Task updated successfully.", task });
//   } catch (error) {
//     next(error);
//   }
// };

// //delete task
// export const deleteTask = async (req, res, next) => {
//   try {
//     const task = await Task.findById(req.params.taskId);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     // only team owner can delete
//     const isOwner = await TeamMember.findOne({
//       team: task.team,
//       user: req.user._id,
//       role: "Owner"
//     });

//     if (!isOwner) {
//       return res.status(403).json({ message: "Only owner can delete tasks" });
//     }

//     await task.deleteOne();
//     res.json({ message: "Task deleted successfully" });
//   } catch (error) {
//     next(error);
//   }
// };


// //Get Tasks by Team
// export const getTeamTasks = async (req, res, next) => {
//   try {
//     const { teamId } = req.params;
//     const { search, priority } = req.query;
//     const filter = { team: teamId };
//     if (priority) filter.priority = priority;

//     // search by title
//     if (search) filter.title = { $regex: search, $options: "i" };

//     const tasks = await Task.find(filter)
//       .sort({ createdAt: -1 })
//       .populate("assignedTo", "name email")
//       .populate("createdBy", "name");

//     res.json({ message: "Filtered tasks", tasks });
//   } catch (error) {
//     next(error);
//   }
// };


// //for logged in user
// export const getAllTasks = async (req, res, next) => {
//   try {
//     // find all teams where user is member
//     const memberships = await TeamMember.find({ user: req.user._id }).select("team");

//     const teamIds = memberships.map((m) => m.team);

//     // get all tasks from those teams
//     const tasks = await Task.find({ team: { $in: teamIds } })
//       .sort({ createdAt: -1 })
//       .populate("assignedTo", "name email")
//       .populate("createdBy", "name email")
//       .populate("team", "name");

//     res.status(200).json({ message: "All tasks", tasks });
//   } catch (error) {
//     next(error);
//   }
// };

// export const searchTasks = async (req, res, next) => {
//   try {
//     const { search, priority } = req.query;

//     // find teams where user is a member
//     const memberships = await TeamMember.find({ user: req.user._id }).select("team");
//     const teamIds = memberships.map((m) => m.team);

//     const filter = { team: { $in: teamIds } };
//     if (priority) filter.priority = priority;
//     if (search) filter.title = { $regex: search, $options: "i" };
//     const tasks = await Task.find(filter)
//       .sort({ createdAt: -1 })
//       .populate("assignedTo", "name email")
//       .populate("createdBy", "name email")
//       .populate("team", "name");

//     res.status(200).json({ message: "Searched tasks", tasks });
//   } catch (error) {
//     next(error);
//   }
// };

import Task from "./../models/Task.js";
import TeamMember from "./../models/TeamMember.js";
import Notification from "./../models/Notification.js";

//create task
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, assignedTo, team } = req.body;

    //team is required
    if (!team) {
      return res.status(400).json({ message: "Team is required" });
    }

    //check creator is a member
    const isOwner = await TeamMember.findOne({
  team,
  user: req.user._id,
  role: "Owner"
});

if (!isOwner) {
  return res.status(403).json({
    message: "Only team owner can create tasks"
  });
}

    //assigned user must be a member
    if (assignedTo) {
      const assignedMember = await TeamMember.findOne({
        team: team,
        user: assignedTo
      });

      if (!assignedMember) {
        return res.status(400).json({
          message: "Cannot assign. User did not accept invite."
        });
      }
    }

    const existingTask = await Task.findOne({ team, title: title.trim() });

    if (existingTask) {
      return res.status(400).json({
        message: "Task with this title already exists in this team."
      });
    }

    //create task
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      team,
      status: "To Do",
      assignedTo: assignedTo || null,
      createdBy: req.user._id
    });

    //notification
    if (assignedTo) {
      const existingNotification = await Notification.findOne({
        type: "TASK_ASSIGNED",
        receiver: assignedTo,
        team,
        task: task._id
      });

      if (!existingNotification) {
        await Notification.create({
          type: "TASK_ASSIGNED",
          sender: req.user._id,
          receiver: assignedTo,
          task: task._id,
          team,
          isRead: false
        });
      }
    }
    return res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    next(error);
  }
};


//update task
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

  const member = await TeamMember.findOne({
  team: task.team,
  user: req.user._id
});

if (!member) {
  return res.status(403).json({ message: "Not authorized" });
}

// allowed status values
const allowedStatuses = ["To Do", "In Progress", "Completed"];

if (req.body.status && !allowedStatuses.includes(req.body.status)) {
  return res.status(400).json({ message: "Invalid status value." });
}

const isOwner = member.role === "Owner";
const isAssignee = task.assignedTo?.toString() === req.user._id.toString();

if (!isOwner && !isAssignee) {
  return res.status(403).json({ message: "Permission denied" });
}

    // allow only these fields to update
   let allowedFields = [];

if (isOwner) {
  allowedFields = [
    "title",
    "description",
    "status",
    "priority",
    "dueDate",
    "assignedTo"
  ];
} else if (isAssignee) {
  allowedFields = ["status"];
}

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    res.json({ message: "Task updated successfully.", task });
  } catch (error) {
    next(error);
  }
};

//delete task
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // only team owner can delete
    const isOwner = await TeamMember.findOne({
      team: task.team,
      user: req.user._id,
      role: "Owner"
    });

    if (!isOwner) {
      return res.status(403).json({ message: "Only owner can delete tasks" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};


export const getTeamTasks = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { search, priority } = req.query;

    const member = await TeamMember.findOne({
      team: teamId,
      user: req.user._id
    });

    if (!member) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let filter = { team: teamId };

    // Owner sees all, member sees only assigned tasks
    if (member.role !== "Owner") {
      filter.assignedTo = req.user._id;
    }

    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: "i" };

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name");

    res.json({ message: "Tasks fetched", tasks });
  } catch (error) {
    next(error);
  }
};


//for logged in user
export const getAllTasks = async (req, res, next) => {
  try {
    // find all teams where user is member
    const memberships = await TeamMember.find({ user: req.user._id }).select("team");

    const teamIds = memberships.map((m) => m.team);

    // get all tasks from those teams
    const tasks = await Task.find({ team: { $in: teamIds } })
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("team", "name");

    res.status(200).json({ message: "All tasks", tasks });
  } catch (error) {
    next(error);
  }
};

export const searchTasks = async (req, res, next) => {
  try {
    const { search, priority } = req.query;

    // find teams where user is a member
    const memberships = await TeamMember.find({ user: req.user._id }).select("team");
    const teamIds = memberships.map((m) => m.team);

    const filter = { team: { $in: teamIds } };
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: "i" };
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("team", "name");

    res.status(200).json({ message: "Searched tasks", tasks });
  } catch (error) {
    next(error);
  }
};

