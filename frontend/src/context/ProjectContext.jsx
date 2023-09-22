import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const ProjectContext = createContext();

export const ProjectContextProvider = ({ children }) => {
  const [teamMember, setTeamMember] = useState([]);
  const [allusers, setallusers] = useState([]);
  const [userMemberProjects, setUserMemberProjects] = useState([]);
  const [userManagerProjects, setUserManagerProjects] = useState([]);
  const [userProjects, setUserProject] = useState([]);
  const [activeProject, setActiveProject] = useState("");

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  if (userData) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${userData.user.token}`;
  }
  async function getTeamMember(data) {
    try {
      const project_id = userData.active;
      const response = await axios.get(
        `http://127.0.0.1:8000/api/common/get_project_Member/${project_id}`
      );
      const teamData = await response.data.data;
      setTeamMember(teamData);
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllUser() {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/common/get_all_users_not_active`
      );
      const users = await response.data.data;
      setallusers(users);
    } catch (error) {
      console.log(error);
    }
  }
  async function getProject() {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/project-section/get_projects",
        {
          member_projects: userData.projects_Manager_id,
          manager_projects: userData.projects_Member_id,
        }
      );
      const get_projects = await response.data;
      setUserMemberProjects(get_projects.member);
      setUserManagerProjects(get_projects.manager);
      setUserProject([...get_projects.member, ...get_projects.manager]);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (userData) {
      getTeamMember();
      getAllUser();
      getProject();
      setUserData(JSON.parse(localStorage.getItem("user")) || null);
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        teamMember,
        allusers,
        userMemberProjects,
        userManagerProjects,
        userProjects,
      }}>
      {children}
    </ProjectContext.Provider>
  );
};
