import React, { useContext, useState } from "react";
import "./dashboard.css";
import { ProjectContext } from "../../context/ProjectContext";
function Dashboard() {
  return (
    <div className="dashboard-section">
      <div className="dashboard-title">Dashboard</div>
      <div className="dashboard-container">
        <div className="dashboard-card"></div>
        <div className="dashboard-card"></div>
        <div className="dashboard-card"></div>
        <div className="dashboard-card"></div>
      </div>
    </div>
  );
}

export default Dashboard;
