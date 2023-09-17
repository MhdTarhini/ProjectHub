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

function App() {
  return (
    <AuthContextProvider>
      <ProjectContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<OutletPage />}>
              {/* <Route index element={<Dashboard />} /> */}
              <Route index element={<FilesSection />} />
            </Route>
            {/* <Route path="/register" element={<Register />} /> */}
            {/* <Route path="/" element={<Login />} /> */}
          </Routes>
        </BrowserRouter>
      </ProjectContextProvider>
    </AuthContextProvider>
  );
}

export default App;
