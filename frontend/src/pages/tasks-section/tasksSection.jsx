import React, { useState, useEffect } from "react";
import MessageArea from "../../component/MessageArea/MessageArea";
import Toolbar from "../../component/Toolbar";
import Gantt from "../../component/gantt-calendar/gant";
import "./tasksSection.css";
import axios from "axios";

const data = {
  data: [
    {
      id: 1,
      text: "Task #1",
      start_date: "2023-10-12",
      end_date: "2023-09-14",
    },

    {
      id: 2,
      text: "Task #2",
      start_date: "2023-09-16",
      end_date: "2023-09-18",
    },
    {
      id: 3,
      text: "Task #44",
      start_date: "2023-09-14",
      end_date: "2023-09-15",
    },
    {
      id: 4,
      text: "Task #44",
      start_date: "2023-09-11",
      end_date: "2023-09-14",
    },
    {
      id: 4,
      text: "Task #44",
      start_date: "2023-09-21",
      end_date: "2023-09-22",
    },
  ],
  links: [
    { source: 1, target: 2, type: "0" },
    { source: 2, target: 3, type: "1" },
    { source: 1, target: 4, type: "2" },
  ],
};

const TasksSection = () => {
  const [TasksData, setTasksData] = useState([]);
  const [UpdateTasks, setUpdateTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [deletedLinks, setDeletedLink] = useState([]);
  const [createdLinks, setCreatedLinks] = useState([]);
  const [currentZoom, setCurrentZoom] = useState("Days");
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    const maxLogLength = 5;
    const newMessages = [{ message }, ...messages];
    if (newMessages.length > maxLogLength) {
      newMessages.length = maxLogLength;
    }
    setMessages(newMessages);
  };

  // const logDataUpdate = (type, action, item, id) => {
  //   let text =
  //     item && item.text
  //       ? ` (${item.id} ${item.start_date}${item.end_date})`
  //       : "";
  //   let message = `${type} ${action}: ${text}`;
  //   if (type === "link" && action !== "delete") {
  //     message += ` ( source: ${item.source}, target: ${item.target}, type: ${item.type})`;
  //   }
  //   addMessage(message);
  // };
  console.log(TasksData);
  console.log(UpdateTasks);
  console.log(deletedTasks);
  console.log(createdLinks);
  console.log(deletedLinks);

  const logDataUpdate = (type, action, item, id) => {
    if (type === "task") {
      if (action === "create") {
        const data = {
          id: item.id,
          name: item.text,
          start_date: item.start_date,
          end_date: item.end_date,
        };
        setTasksData((TasksData) => [...TasksData, data]);
      }
      if (action === "update") {
        const data = {
          id: item.id,
          name: item.text,
          start_date: item.start_date,
          end_date: item.end_date,
        };
        setUpdateTasks((UpdateTasks) => [...UpdateTasks, data]);
      }
      if (action === "delete") {
        const data = {
          id: item.id,
        };
        setDeletedTasks((deletedLinks) => [...deletedLinks, data]);
      }
    }
    // let text =
    //   item && item.text
    //     ? ` (${item.id} ${item.start_date}${item.end_date})`
    //     : "";
    // let message = `${type} ${action}: ${text}`;
    // if (type === "link" && action !== "delete") {
    //   ` ( source: ${item.source}, target: ${item.target}, type: ${item.type})`;
    // }
    if (type === "link") {
      if (action === "create") {
        const data = {
          source: item.source,
          target: item.target,
          type: item.type,
        };
        setCreatedLinks((createdLinks) => [...createdLinks, data]);
      }
      if (action === "delete") {
        const data = {
          source: item.source,
          target: item.target,
          type: item.type,
        };
        setDeletedLink((deletedLinks) => [...deletedLinks, data]);
      }
    }
  };

  async function handleUpdateTasks() {
    try {
      const response = await axios.post("");
    } catch (error) {}
  }

  const handleZoomChange = (zoom) => {
    setCurrentZoom(zoom);
  };

  return (
    <div className="task-section">
      <div className="btn" onClick={handleUpdateTasks}>
        Save
      </div>
      <div className="zoom-bar">
        <Toolbar zoom={currentZoom} onZoomChange={handleZoomChange} />
      </div>
      <div className="gantt-container">
        <Gantt tasks={data} zoom={currentZoom} onDataUpdated={logDataUpdate} />
      </div>
      <MessageArea messages={messages} />
    </div>
  );
};

export default TasksSection;
