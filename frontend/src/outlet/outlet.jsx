import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/navbar/navbar";
import Sidebar from "../component/sidebar/sidebar";
import "./outlet.css";
import Logo from "../component/logo/Logo";

function OutletPage() {
  // const [showlogo, setShowlogo] = useState(false);
  // const handleSidebarClick = () => {
  //   setShowlogo(true);
  // };

  // const renderMainContent = () => {
  //   if (showlogo) {
  //     setTimeout(() => {
  //       setShowlogo(false);
  //     }, 3000);
  //     return <Logo />;
  //   } else {
  //     return ;
  //   }
  // };
  // useEffect(() => {
  //   renderMainContent();
  // }, [showlogo]);
  return (
    <div className="outlet-page">
      <Navbar />
      <div className="sidebar-page">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default OutletPage;
