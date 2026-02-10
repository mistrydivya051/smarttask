import { createContext, useContext, useState, useEffect } from "react";
import { getTeamMembers } from "../api/teamApi";

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchTeamMembers = async (teamId) => {
    try {
      const res = await getTeamMembers(teamId);
      setMembers((prev) => ({ ...prev, [teamId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TeamContext.Provider value={{ teams, setTeams, members, fetchTeamMembers }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
