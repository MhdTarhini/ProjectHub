import React from "react";
import "./navbar.css";

function Navbar() {
  const userData = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="navbar">
      <div className="logo">
        <img
          src="./logo.svg"
          alt="logo"
          srcSet=""
          className="logo-navbar-icon"
        />
        <div className="">
          <span className="logo-name-navbar">Project</span>
          <span className="hub-navbar">Hub</span>
        </div>
      </div>
      <div className="navbar-element">
        <div className="project-navabr">
          <div className="project-name-navbar">Project #806</div>
          <div className="team-name-navbar">Site team section</div>
        </div>
        <div className="search-input-lebel">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="22"
            viewBox="0 0 21 22"
            fill="none">
            <path
              d="M15.0086 13.7358H14.06L13.7238 13.3987C14.9005 11.9752 15.6089 10.1271 15.6089 8.11664C15.6089 3.63376 12.1149 0 7.80446 0C3.494 0 0 3.63376 0 8.11664C0 12.5995 3.494 16.2333 7.80446 16.2333C9.73756 16.2333 11.5146 15.4965 12.8834 14.2728L13.2075 14.6224V15.6089L19.211 21.84L21 19.9794L15.0086 13.7358ZM7.80446 13.7358C4.81475 13.7358 2.40137 11.2259 2.40137 8.11664C2.40137 5.00734 4.81475 2.49743 7.80446 2.49743C10.7942 2.49743 13.2075 5.00734 13.2075 8.11664C13.2075 11.2259 10.7942 13.7358 7.80446 13.7358Z"
              fill="#888888"
            />
          </svg>
          <input type="search" name="search" id="search" placeholder="search" />
        </div>
        <div className="user-info">
          <div className="user-name-job">
            <div className="user-name">{`${userData.user.first_name} ${userData.user.last_name}`}</div>
            <div className="user-job">Civil engineer</div>
          </div>
          <img
            src="http://34.244.172.132/uploads/assets/default.png"
            alt="profile-image"
            className="profile-img-navbar"
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
