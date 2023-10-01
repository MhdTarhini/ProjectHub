import React, { Component } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "./Gantt.css";
import zoomConfig from "./zoom";

export default class Gantt extends Component {
  dataProcessor = null;

  initZoom() {
    gantt.ext.zoom.init({
      levels: [
        {
          name: "Hours",
          scale_height: 60,
          min_column_width: 30,
          scales: [
            { unit: "day", step: 1, format: "%d %M" },
            { unit: "hour", step: 1, format: "%H" },
          ],
        },
        {
          name: "Days",
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: "week", step: 1, format: "Week #%W" },
            { unit: "day", step: 1, format: "%d %M" },
          ],
        },
        {
          name: "Months",
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: "month", step: 1, format: "%F" },
            { unit: "week", step: 1, format: "#%W" },
          ],
        },
      ],
    });
  }

  setZoom(value) {
    if (!gantt.ext.zoom.getLevels()) {
      this.initZoom();
    }
    gantt.ext.zoom.setLevel(value);
  }

  initGanttDataProcessor() {
    const onDataUpdated = this.props.onDataUpdated;
    this.dataProcessor = gantt.createDataProcessor((type, action, item, id) => {
      if (type === "task" && (action === "create" || action === "update")) {
        console.log("Task date changed:", item.start_date, item.end_date);
      }
      return new Promise((resolve, reject) => {
        if (onDataUpdated) {
          onDataUpdated(type, action, item, id);
        }
        return resolve();
      });
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.props.zoom !== nextProps.zoom;
  }

  componentDidMount() {
    gantt.config.date_format = "%Y-%m-%d %H:%i:%s";
    const { tasks } = this.props;
    gantt.init(this.ganttContainer);
    this.initGanttDataProcessor();
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      const userId = userData.user.id;
      const projectId = userData.active;
      console.log(userData.user.id);
      gantt.load(`http://34.244.172.132/api/get_tasks/${userId}/${projectId}`);
    }
  }

  componentWillUnmount() {
    if (this.dataProcessor) {
      this.dataProcessor.destructor();
      this.dataProcessor = null;
    }
  }

  render() {
    const { zoom } = this.props;
    this.setZoom(zoom);
    return (
      <div
        ref={(input) => {
          this.ganttContainer = input;
        }}
        style={{
          width: "100%",
          height: "100%",
        }}></div>
    );
  }
}
