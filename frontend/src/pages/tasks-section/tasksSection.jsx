import React, { useState, useEffect } from "react";
import Toolbar from "../../component/Toolbar";
import Gantt from "../../component/gantt-calendar/gant";
import "./tasksSection.css";
import axios from "axios";
import Logo from "../../component/logo/Logo";

const TasksSection = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  axios.defaults.headers.common["Authorization"] = `Bearer ${user.user.token}`;
  const [TasksData, setTasksData] = useState([]);
  const [createdLinks, setCreatedLinks] = useState([]);
  const [currentZoom, setCurrentZoom] = useState("Days");
  const [data, setdata] = useState({ data: [], links: [] });
  const [showlogo, setShowlogo] = useState(true);

  const logDataUpdate = (type, action, item, id) => {
    if (type === "task") {
      const data = {
        id: item.id,
        text: item.text,
        start_date: item.start_date,
        duration: item.duration,
        progress: item.progress,
        parent: item.parent,
        action: action,
      };
      setTasksData((TasksData) => [...TasksData, data]);
    }
    if (type === "link") {
      const data = {
        source: item.source,
        target: item.target,
        type: item.type,
        action: action,
      };
      setCreatedLinks((createdLinks) => [...createdLinks, data]);
    }
  };

  async function handleUpdateTasks() {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/task-section/uplaod_tasks",
        {
          created_tasks: TasksData,
          created_links: createdLinks,
        }
      );
      const tasks = await response.data;
    } catch (error) {
      console.log(error);
    }
  }

  const handleZoomChange = (zoom) => {
    setCurrentZoom(zoom);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowlogo(false);
    }, 3000);
  }, []);

  return (
    <>
      {showlogo ? (
        <Logo />
      ) : (
        <div className="task-section">
          <div className="top-side-tasks">
            <div className="zoom-bar">
              <Toolbar zoom={currentZoom} onZoomChange={handleZoomChange} />
            </div>
            <div className="btn save-tasks" onClick={handleUpdateTasks}>
              Save Changes
            </div>
          </div>
          <div className="gantt-container">
            <Gantt
              tasks={data}
              zoom={currentZoom}
              onDataUpdated={logDataUpdate}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TasksSection;
