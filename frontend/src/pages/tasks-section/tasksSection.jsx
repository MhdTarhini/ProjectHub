import React, { useState, useEffect } from "react";
import Toolbar from "../../component/Toolbar";
import Gantt from "../../component/gantt-calendar/gant";
import "./tasksSection.css";
import axios from "axios";
import Logo from "../../component/logo/Logo";
import Loading from "../../component/common/loading/loading";

const TasksSection = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  axios.defaults.headers.common["Authorization"] = `Bearer ${user.user.token}`;
  const [TasksData, setTasksData] = useState([]);
  const [createdLinks, setCreatedLinks] = useState([]);
  const [currentZoom, setCurrentZoom] = useState("Days");
  const [data, setdata] = useState({ data: [], links: [] });
  const [showlogo, setShowlogo] = useState(true);
  const [isExists, setIsExists] = useState(true);
  const [isAnimation, setIsAnimation] = useState(false);
  const [isloading, setIsloading] = useState(false);

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
        "http://34.244.172.132/api/task-section/uplaod_tasks",
        {
          created_tasks: TasksData,
          created_links: createdLinks,
          project_id: user.active,
        }
      );
      const tasks = await response.data;
      setIsloading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function checkCalender() {
    try {
      const response = await axios.get(
        `http://34.244.172.132/api/task-section/checkCalender/${user.active}`
      );
      const ExistsCalender = await response.data;
      if (ExistsCalender.status === "success") {
        setIsExists(true);
        setShowlogo(false);
      } else {
        setIsExists(false);
        setShowlogo(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function CreateGantt() {
    try {
      const response = await axios.get(
        `http://34.244.172.132/api/task-section/create_calender/${user.active}`
      );
      const CreateCalender = await response.data;
      if (CreateCalender.status === "success") {
        setIsloading(false);
        setIsExists(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleZoomChange = (zoom) => {
    setCurrentZoom(zoom);
  };

  useEffect(() => {
    checkCalender();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsAnimation(true);
    }, 800);
  }, []);

  return (
    <>
      {showlogo ? (
        <Logo />
      ) : (
        <>
          {isExists ? (
            <div>
              <div className="task-section">
                <div className="top-side-tasks">
                  <div className="zoom-bar">
                    <Toolbar
                      zoom={currentZoom}
                      onZoomChange={handleZoomChange}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {isloading && <Loading />}
                    <div
                      className="btn save-tasks"
                      onClick={() => {
                        handleUpdateTasks();
                        setIsloading(true);
                      }}>
                      Save Changes
                    </div>
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
            </div>
          ) : (
            <>
              <img
                src="http://34.244.172.132/uploads/assets/logo.svg"
                alt="logo"
                srcSet=""
                className={`logo-tasks ${isAnimation ? " animate-logo" : ""}`}
              />
              <div
                className={`create-task-calendar ${
                  isAnimation ? " animate-calendar" : ""
                }`}>
                <div className="calendar-title">Gantt Charts </div>
                <div className="calendar-text">
                  "Keep organized and start managing your daily work schedule.
                  and reduce stress, and ensure that you're making the most of
                  your time"
                </div>

                {user.active === 0 ? (
                  <div className="error">
                    you must be member in a project before using gantt
                  </div>
                ) : (
                  <button
                    className={`btn calendar-button ${
                      isAnimation ? " animate-media" : ""
                    }`}
                    onClick={CreateGantt}>
                    Start
                  </button>
                )}
              </div>
              <div className={`calendar-media`}>{isloading && <Loading />}</div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default TasksSection;
