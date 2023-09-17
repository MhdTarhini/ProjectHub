import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const ProjectContext = createContext();

export const ProjectContextProvider = ({ children }) => {
  const [teamMember, setTeamMember] = useState([]);

  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2d1ZXN0L2xvZ2luIiwiaWF0IjoxNjk0OTY0NDQ0LCJleHAiOjE2OTQ5NjgwNDQsIm5iZiI6MTY5NDk2NDQ0NCwianRpIjoiOVJiaVVQOG1GUzFLVnRjNCIsInN1YiI6IjMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.fumZ5ytsfc0hZx4WBxt5WVVSnVeJgLkyZrJcQokCVHE`;

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
