import React, { Component } from "react";
import MessageArea from "../../component/MessageArea/MessageArea";
import Toolbar from "../../component/Toolbar";
import Gantt from "../../component/gantt-calendar/gant";

const data = {
  data: [
    {
      id: 1,
      text: "Task #1",
      start_date: "2020-02-12",
      duration: 3,
      progress: 0.6,
    },

    {
      id: 2,
      text: "Task #2",
      start_date: "2020-02-16",
      duration: 3,
      progress: 0.4,
    },
    {
      id: 3,
      text: "Task #3",
      start_date: "2020-02-13",
      duration: 3,
      progress: 0.4,
    },
    {
      id: 4,
      text: "Task #4",
      start_date: "2020-02-12",
      end_date: "2020-02-15",
      duration: 3,
      progress: 0.4,
    },
  ],
  links: [
    { id: 1, source: 1, target: 2, type: "0" },
    { id: 2, source: 2, target: 3, type: "0" },
    { id: 3, source: 1, target: 4, type: "0" },
  ],
};
class TasksSection extends Component {
  state = {
    currentZoom: "Days",
    messages: [],
  };

  addMessage(message) {
    const maxLogLength = 5;
    const newMessage = { message };
    const messages = [newMessage, ...this.state.messages];

    if (messages.length > maxLogLength) {
      messages.length = maxLogLength;
    }
    this.setState({ messages });
  }

  logDataUpdate = (type, action, item, id) => {
    let text =
      item && item.text
        ? ` (${item.id} ${item.start_date}${item.end_date})`
        : "";
    let message = `${type} ${action}: ${text}`;
    if (type === "link" && action !== "delete") {
      message += ` ( source: ${item.source}, target: ${item.target} )`;
    }
    this.addMessage(message);
  };

  handleZoomChange = (zoom) => {
    this.setState({
      currentZoom: zoom,
    });
  };

  render() {
    const { currentZoom, messages } = this.state;
    return (
      <div>
        <div className="zoom-bar">
          <Toolbar zoom={currentZoom} onZoomChange={this.handleZoomChange} />
        </div>
        <div className="gantt-container">
          <Gantt
            tasks={data}
            zoom={currentZoom}
            onDataUpdated={this.logDataUpdate}
          />
        </div>
        <MessageArea messages={messages} />
      </div>
    );
  }
}

export default TasksSection;
