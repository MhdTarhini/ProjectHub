import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/dashboard";
import OutletPage from "./outlet/outlet";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import FilesSection from "./pages/files-section/files-section";
import "./utilities.css";
import { AuthContextProvider } from "./context/authContext";
import { ProjectContextProvider } from "./context/ProjectContext";
import ProjectsSection from "./pages/project-section/projectsSection";
import TasksSection from "./pages/tasks-section/tasksSection";
import IssuesSection from "./pages/issues-section/issuesSection";
import ChatsSection from "./pages/chats-section/chatsSection";
import SettingsPage from "./pages/settings-page/settingsPage";
import { useEffect } from "react";

function App() {

  return (
    <AuthContextProvider>
      <ProjectContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/v1" element={<OutletPage />}>
              <Route index element={<Dashboard />} />
              <Route path="projects-section" element={<ProjectsSection />} />
              <Route path="tasks-section" element={<TasksSection />} />
              <Route path="files-section" element={<FilesSection />} />
              <Route path="issues-section" element={<IssuesSection />} />
              <Route path="chats-section" element={<ChatsSection />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </ProjectContextProvider>
    </AuthContextProvider>
  );
}

export default App;
