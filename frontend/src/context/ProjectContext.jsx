import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const ProjectContext = createContext();

export const ProjectContextProvider = ({ children }) => {
  const [teamMember, setTeamMember] = useState([]);

  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2d1ZXN0L2xvZ2luIiwiaWF0IjoxNjk1MDQzODAyLCJleHAiOjE2OTUwNDc0MDIsIm5iZiI6MTY5NTA0MzgwMiwianRpIjoiU084SlNrUXhJOWZ1SlF2diIsInN1YiI6IjMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.b5e_UQEMGkVfg77Nt63Zv3vgbCLocShHzb5ldXoYaDs`;

  const getTeamMember = async (data) => {
    const project_id = 1;
    const response = await axios.get(
      `http://127.0.0.1:8000/api/common/get_project_Member/${project_id}`
    );
    const teamData = await response.data.data;
    setTeamMember(teamData);
  };

  useEffect(() => {
    getTeamMember();
  }, []);

  return (
    <ProjectContext.Provider value={{ teamMember }}>
      {children}
    </ProjectContext.Provider>
  );
};
