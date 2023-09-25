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
// import firebase from "firebase/app";
// import "firebase/auth";
// import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

initializeApp({
  apiKey: "AIzaSyDsB1iitOEJl9_95lfdpU4jHNi4eS4VCvs",
  authDomain: "projecthub-28b52.firebaseapp.com",
  projectId: "projecthub-28b52",
  storageBucket: "projecthub-28b52.appspot.com",
  messagingSenderId: "810956090127",
  appId: "1:810956090127:web:c42e239ee518b89f1bec7a",
  measurementId: "G-BF9LZW2GDY",
});
function App() {
  // const userData = localStorage.getItem("user");
  // const isAuthenticated = !!userData;

  return (
    <AuthContextProvider>
      {/* <ProjectContextProvider> */}
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
      {/* </ProjectContextProvider> */}
    </AuthContextProvider>
  );
}

export default App;
