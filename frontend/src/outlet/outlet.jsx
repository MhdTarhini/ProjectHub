import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/navbar/navbar";
import Sidebar from "../component/sidebar/sidebar";
import "./outlet.css";

function OutletPage() {
  return (
    <div className="outlet-page">
      <Navbar />
      <div className="sidebar">
        <Sidebar />
        <div className="main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default OutletPage;
