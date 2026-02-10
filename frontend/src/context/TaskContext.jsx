import { createContext, useContext, useState } from "react";
import {getTeamTasks} from "../api/taskApi";

const TaskContext = createContext();
export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeamTasks = async (teamId) => {
    setLoading(true);
    const res = await getTeamTasks(teamId);
    setTasks(res.data.tasks);
    setLoading(false);
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, fetchTeamTasks, loading }}>
      {children}
    </TaskContext.Provider>
  );
};
