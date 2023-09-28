import React, { useContext, useEffect, useState } from "react";
import "./sidebar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

function Sidebar({ onSidebarClick }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const location = useLocation();

  const [isSidebarMinimized, setSidebarMinimized] = useState(
    location.pathname !== "/v1"
  );

  useEffect(() => {
    setSidebarMinimized(location.pathname !== "/v1");
  }, [location.pathname]);

  const handleSidebarToggle = () => {
    if (location.pathname !== "/v1") {
      setSidebarMinimized(!isSidebarMinimized);
    }
  };

  return (
    <div className={`sidebar-side ${isSidebarMinimized ? "minimized" : ""}`}>
      <div className="sidebar-options">
        <Link to={"/v1"}>
          <div
            className={`item ${isSidebarMinimized ? "minimized" : ""}`}
            onClick={() => {
              setSidebarMinimized(!isSidebarMinimized);
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <mask
                id="mask0_72_296"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24">
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_72_296)">
                <path
                  d="M13 9V3H21V9H13ZM3 13V3H11V13H3ZM13 21V11H21V21H13ZM3 21V15H11V21H3ZM5 11H9V5H5V11ZM15 19H19V13H15V19ZM15 7H19V5H15V7ZM5 19H9V17H5V19Z"
                  fill="#888888"
                />
              </g>
            </svg>
            <div
              className={`name-item ${isSidebarMinimized ? "minimized" : ""}`}>
              Dashboard
            </div>
            <div className={`name-item-tooltip`}>Dashboard</div>
          </div>
        </Link>
        <Link to={"/v1/projects-section"}>
          <div
            className={`item ${isSidebarMinimized ? "minimized" : ""}`}
            onClick={() => {
              // setSidebarMinimized(true);
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <mask
                id="mask0_77_307"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24">
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_77_307)">
                <path
                  d="M15 21V18H11V8H9V11H2V3H9V6H15V3H22V11H15V8H13V16H15V13H22V21H15ZM17 9H20V5H17V9ZM17 19H20V15H17V19ZM4 9H7V5H4V9Z"
                  fill="#888888"
                />
              </g>
            </svg>
            <div
              className={`name-item ${isSidebarMinimized ? "minimized" : ""}`}
              onClick={handleSidebarToggle}>
              Projects
            </div>
            <div className={`name-item-tooltip`}>Projects</div>
          </div>
        </Link>
        <Link to={"/v1/tasks-section"}>
          <div
            className={`item ${isSidebarMinimized ? "minimized" : ""}`}
            onClick={() => {
              setSidebarMinimized(true);
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <mask
                id="mask0_77_295"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24">
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_77_295)">
                <path
                  d="M15.5 19.925L11.25 15.675L12.65 14.275L15.5 17.125L21.15 11.475L22.55 12.875L15.5 19.925ZM21 10H19V5H17V8H7V5H5V19H11V21H5C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H9.175C9.35833 2.41667 9.71667 1.9375 10.25 1.5625C10.7833 1.1875 11.3667 1 12 1C12.6667 1 13.2625 1.1875 13.7875 1.5625C14.3125 1.9375 14.6667 2.41667 14.85 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V10ZM12 5C12.2833 5 12.5208 4.90417 12.7125 4.7125C12.9042 4.52083 13 4.28333 13 4C13 3.71667 12.9042 3.47917 12.7125 3.2875C12.5208 3.09583 12.2833 3 12 3C11.7167 3 11.4792 3.09583 11.2875 3.2875C11.0958 3.47917 11 3.71667 11 4C11 4.28333 11.0958 4.52083 11.2875 4.7125C11.4792 4.90417 11.7167 5 12 5Z"
                  fill="#888888"
                />
              </g>
            </svg>
            <div
              className={`name-item ${isSidebarMinimized ? "minimized" : ""}`}>
              Tasks
            </div>
            <div className={`name-item-tooltip`}>Tasks</div>
          </div>
        </Link>
        <Link to={"/v1/files-section"}>
          <div
            className={`item ${isSidebarMinimized ? "minimized" : ""}`}
            onClick={() => {
              setSidebarMinimized(true);
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <mask
                id="mask0_72_308"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24">
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_72_308)">
                <path
                  d="M11.5 22C9.96667 22 8.66667 21.4667 7.6 20.4C6.53333 19.3333 6 18.0333 6 16.5V6C6 4.9 6.39167 3.95833 7.175 3.175C7.95833 2.39167 8.9 2 10 2C11.1 2 12.0417 2.39167 12.825 3.175C13.6083 3.95833 14 4.9 14 6V15.5C14 16.2 13.7583 16.7917 13.275 17.275C12.7917 17.7583 12.2 18 11.5 18C10.8 18 10.2083 17.7583 9.725 17.275C9.24167 16.7917 9 16.2 9 15.5V6H10.5V15.5C10.5 15.7833 10.5958 16.0208 10.7875 16.2125C10.9792 16.4042 11.2167 16.5 11.5 16.5C11.7833 16.5 12.0208 16.4042 12.2125 16.2125C12.4042 16.0208 12.5 15.7833 12.5 15.5V6C12.5 5.3 12.2583 4.70833 11.775 4.225C11.2917 3.74167 10.7 3.5 10 3.5C9.3 3.5 8.70833 3.74167 8.225 4.225C7.74167 4.70833 7.5 5.3 7.5 6V16.5C7.5 17.6 7.89167 18.5417 8.675 19.325C9.45833 20.1083 10.4 20.5 11.5 20.5C12.6 20.5 13.5417 20.1083 14.325 19.325C15.1083 18.5417 15.5 17.6 15.5 16.5V6H17V16.5C17 18.0333 16.4667 19.3333 15.4 20.4C14.3333 21.4667 13.0333 22 11.5 22Z"
                  fill="#888888"
                />
              </g>
            </svg>
            <div
              className={`name-item ${isSidebarMinimized ? "minimized" : ""}`}>
              Files
            </div>
            <div className={`name-item-tooltip`}>Files</div>
          </div>
        </Link>
        <div
          className={`line-space ${
            isSidebarMinimized ? "minimized" : ""
          }`}></div>
        <div className="item-images">
          <div className={`name-item ${isSidebarMinimized ? "minimized" : ""}`}>
            Team Members
          </div>
          <div className="team-member-images">
            <img
              src="http://127.0.0.1:8000/uploads/assets/download.jpg"
              alt=""
              srcSet=""
              className={`member-image image-1 ${
                isSidebarMinimized ? "minimized" : ""
              }`}
            />
            <img
              src="http://127.0.0.1:8000/uploads/assets/FjU2lkcWYAgNG6d.jpg"
              alt=""
              srcSet=""
              className={`member-image image-2 ${
                isSidebarMinimized ? "minimized" : ""
              }`}
            />
            <img
              src="http://127.0.0.1:8000/uploads/assets/istockphoto-1399788030-170667a.jpg"
              alt=""
              srcSet=""
              className={`member-image image-3 ${
                isSidebarMinimized ? "minimized" : ""
              }`}
            />
            <img
              src="http://127.0.0.1:8000/uploads/assets/profile.jpg"
              alt=""
              srcSet=""
              className={`member-image image-4 ${
                isSidebarMinimized ? "minimized" : ""
              }`}
            />
            <img
              src="http://127.0.0.1:8000/uploads/assets/UNJ05AV8_400x400.jpg "
              alt=""
              srcSet=""
              className={`member-image image-5 ${
                isSidebarMinimized ? "minimized" : ""
              }`}
            />
          </div>
        </div>
        <div
          className={`line-space ${
            isSidebarMinimized ? "minimized" : ""
          }`}></div>
        <Link to={"/v1/issues-section"}>
          <div
            className={`item ${isSidebarMinimized ? "minimized" : ""}`}
            onClick={() => {
              setSidebarMinimized(true);
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none">
              <mask
                id="mask0_77_313"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="25">
                <rect y="0.852295" width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_77_313)">
                <path
                  d="M12 22.8773C11.7333 22.8773 11.4791 22.8273 11.2375 22.7273C10.9958 22.6273 10.775 22.4856 10.575 22.3023L2.54998 14.2773C2.36664 14.0773 2.22498 13.8564 2.12498 13.6148C2.02498 13.3731 1.97498 13.1189 1.97498 12.8523C1.97498 12.5856 2.02498 12.3273 2.12498 12.0773C2.22498 11.8273 2.36664 11.6106 2.54998 11.4273L10.575 3.40227C10.775 3.20227 10.9958 3.05644 11.2375 2.96477C11.4791 2.8731 11.7333 2.82727 12 2.82727C12.2666 2.82727 12.525 2.8731 12.775 2.96477C13.025 3.05644 13.2416 3.20227 13.425 3.40227L21.45 11.4273C21.65 11.6106 21.7958 11.8273 21.8875 12.0773C21.9791 12.3273 22.025 12.5856 22.025 12.8523C22.025 13.1189 21.9791 13.3731 21.8875 13.6148C21.7958 13.8564 21.65 14.0773 21.45 14.2773L13.425 22.3023C13.2416 22.4856 13.025 22.6273 12.775 22.7273C12.525 22.8273 12.2666 22.8773 12 22.8773ZM12 20.8773L20.025 12.8523L12 4.82727L3.97498 12.8523L12 20.8773ZM11 13.8523H13V7.85227H11V13.8523ZM12 16.8523C12.2833 16.8523 12.5208 16.7564 12.7125 16.5648C12.9041 16.3731 13 16.1356 13 15.8523C13 15.5689 12.9041 15.3314 12.7125 15.1398C12.5208 14.9481 12.2833 14.8523 12 14.8523C11.7166 14.8523 11.4791 14.9481 11.2875 15.1398C11.0958 15.3314 11 15.5689 11 15.8523C11 16.1356 11.0958 16.3731 11.2875 16.5648C11.4791 16.7564 11.7166 16.8523 12 16.8523Z"
                  fill="#888888"
                />
              </g>
            </svg>
            <div
              className={`name-item ${isSidebarMinimized ? "minimized" : ""}`}>
              Issues
            </div>
            <div className={`name-item-tooltip`}>Issues</div>
          </div>
        </Link>
        <Link to={"/v1/chats-section"}>
          <div
            className={`item ${isSidebarMinimized ? "minimized" : ""}`}
            onClick={() => {
              setSidebarMinimized(true);
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none">
              <mask
                id="mask0_77_325"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="25">
                <rect y="0.852295" width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_77_325)">
                <path
                  d="M2 22.8523V4.85229C2 4.30229 2.19583 3.83146 2.5875 3.43979C2.97917 3.04813 3.45 2.85229 4 2.85229H20C20.55 2.85229 21.0208 3.04813 21.4125 3.43979C21.8042 3.83146 22 4.30229 22 4.85229V16.8523C22 17.4023 21.8042 17.8731 21.4125 18.2648C21.0208 18.6565 20.55 18.8523 20 18.8523H6L2 22.8523ZM5.15 16.8523H20V4.85229H4V17.9773L5.15 16.8523Z"
                  fill="#888888"
                />
              </g>
            </svg>
            <div
              className={`name-item ${isSidebarMinimized ? "minimized" : ""}`}>
              Chats
            </div>
            <div className={`name-item-tooltip`}>Chats</div>
          </div>
        </Link>
        <div
          className={`line-space ${
            isSidebarMinimized ? "minimized" : ""
          }`}></div>
        <Link to={"/v1/settings"}>
          <div
            className={`item ${isSidebarMinimized ? "minimized" : ""}`}
            onClick={() => {
              setSidebarMinimized(true);
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none">
              <mask
                id="mask0_77_342"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="25">
                <rect y="0.852295" width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_77_342)">
                <path
                  d="M9.25001 22.8523L8.85001 19.6523C8.63335 19.569 8.42918 19.469 8.23751 19.3523C8.04585 19.2356 7.85835 19.1106 7.67501 18.9773L4.70001 20.2273L1.95001 15.4773L4.52501 13.5273C4.50835 13.4106 4.50001 13.2981 4.50001 13.1898V12.5148C4.50001 12.4065 4.50835 12.294 4.52501 12.1773L1.95001 10.2273L4.70001 5.47729L7.67501 6.72729C7.85835 6.59396 8.05001 6.46896 8.25001 6.35229C8.45001 6.23563 8.65001 6.13563 8.85001 6.05229L9.25001 2.85229H14.75L15.15 6.05229C15.3667 6.13563 15.5708 6.23563 15.7625 6.35229C15.9542 6.46896 16.1417 6.59396 16.325 6.72729L19.3 5.47729L22.05 10.2273L19.475 12.1773C19.4917 12.294 19.5 12.4065 19.5 12.5148V13.1898C19.5 13.2981 19.4833 13.4106 19.45 13.5273L22.025 15.4773L19.275 20.2273L16.325 18.9773C16.1417 19.1106 15.95 19.2356 15.75 19.3523C15.55 19.469 15.35 19.569 15.15 19.6523L14.75 22.8523H9.25001ZM12.05 16.3523C13.0167 16.3523 13.8417 16.0106 14.525 15.3273C15.2083 14.644 15.55 13.819 15.55 12.8523C15.55 11.8856 15.2083 11.0606 14.525 10.3773C13.8417 9.69396 13.0167 9.35229 12.05 9.35229C11.0667 9.35229 10.2375 9.69396 9.56251 10.3773C8.88751 11.0606 8.55001 11.8856 8.55001 12.8523C8.55001 13.819 8.88751 14.644 9.56251 15.3273C10.2375 16.0106 11.0667 16.3523 12.05 16.3523ZM12.05 14.3523C11.6333 14.3523 11.2792 14.2065 10.9875 13.9148C10.6958 13.6231 10.55 13.269 10.55 12.8523C10.55 12.4356 10.6958 12.0815 10.9875 11.7898C11.2792 11.4981 11.6333 11.3523 12.05 11.3523C12.4667 11.3523 12.8208 11.4981 13.1125 11.7898C13.4042 12.0815 13.55 12.4356 13.55 12.8523C13.55 13.269 13.4042 13.6231 13.1125 13.9148C12.8208 14.2065 12.4667 14.3523 12.05 14.3523ZM11 20.8523H12.975L13.325 18.2023C13.8417 18.069 14.3208 17.8731 14.7625 17.6148C15.2042 17.3565 15.6083 17.044 15.975 16.6773L18.45 17.7023L19.425 16.0023L17.275 14.3773C17.3583 14.144 17.4167 13.8981 17.45 13.6398C17.4833 13.3815 17.5 13.119 17.5 12.8523C17.5 12.5856 17.4833 12.3231 17.45 12.0648C17.4167 11.8065 17.3583 11.5606 17.275 11.3273L19.425 9.70229L18.45 8.0023L15.975 9.0523C15.6083 8.66896 15.2042 8.34813 14.7625 8.0898C14.3208 7.83146 13.8417 7.63563 13.325 7.5023L13 4.85229H11.025L10.675 7.5023C10.1583 7.63563 9.67918 7.83146 9.23751 8.0898C8.79585 8.34813 8.39168 8.66063 8.02501 9.0273L5.55001 8.0023L4.57501 9.70229L6.72501 11.3023C6.64168 11.5523 6.58335 11.8023 6.55001 12.0523C6.51668 12.3023 6.50001 12.569 6.50001 12.8523C6.50001 13.119 6.51668 13.3773 6.55001 13.6273C6.58335 13.8773 6.64168 14.1273 6.72501 14.3773L4.57501 16.0023L5.55001 17.7023L8.02501 16.6523C8.39168 17.0356 8.79585 17.3565 9.23751 17.6148C9.67918 17.8731 10.1583 18.069 10.675 18.2023L11 20.8523Z"
                  fill="#888888"
                />
              </g>
            </svg>
            <div
              className={`name-item ${isSidebarMinimized ? "minimized" : ""}`}>
              Setting
            </div>
            <div className={`name-item-tooltip`}>Setting</div>
          </div>
        </Link>
        <div
          className={`item ${isSidebarMinimized ? "minimized" : ""}`}
          onClick={() => {
            logout();

            navigate("/");
          }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none">
            <mask
              id="mask0_77_333"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="25">
              <rect y="0.852295" width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_77_333)">
              <path
                d="M3 21.8523V3.85229H12V5.85229H5V19.8523H12V21.8523H3ZM16 17.8523L14.625 16.4023L17.175 13.8523H9V11.8523H17.175L14.625 9.3023L16 7.85229L21 12.8523L16 17.8523Z"
                fill="#888888"
              />
            </g>
          </svg>
          <div className={`name-item ${isSidebarMinimized ? "minimized" : ""}`}>
            Logout
          </div>
          <div className={`name-item-tooltip`}>Logout</div>
        </div>
        <div
          className={`line-space ${
            isSidebarMinimized ? "minimized" : ""
          }`}></div>
      </div>
    </div>
  );
}

export default Sidebar;
