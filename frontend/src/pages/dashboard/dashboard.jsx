import React, { useContext, useState } from "react";
import "./dashboard.css";
import Calendar from "react-calendar";
import { ProjectContext } from "../../context/ProjectContext";
import "react-calendar/dist/Calendar.css";
import IndexPage from "../../component/calendar/calendar";

function Dashboard() {
  const [value, onChange] = useState(new Date());
  return (
    <div className="dashboard-section">
      <div className="dashboard-title">Dashboard</div>
      <div className="dashboard-container">
        <div className=" dashboard-card">
          <div className="tasks-card">
            <div className="card-title">Tasks</div>
            <div className="tasks-card-new-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none">
                <mask id="mask0_77_428" x="0" y="0" width="25" height="25">
                  <rect x="0.5" y="0.5" width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_77_428)">
                  <path
                    d="M13.5 14.5H15.5V11.5H18.5V9.5H15.5V6.5H13.5V9.5H10.5V11.5H13.5V14.5ZM8.5 18.5C7.95 18.5 7.47917 18.3042 7.0875 17.9125C6.69583 17.5208 6.5 17.05 6.5 16.5V4.5C6.5 3.95 6.69583 3.47917 7.0875 3.0875C7.47917 2.69583 7.95 2.5 8.5 2.5H20.5C21.05 2.5 21.5208 2.69583 21.9125 3.0875C22.3042 3.47917 22.5 3.95 22.5 4.5V16.5C22.5 17.05 22.3042 17.5208 21.9125 17.9125C21.5208 18.3042 21.05 18.5 20.5 18.5H8.5ZM8.5 16.5H20.5V4.5H8.5V16.5ZM4.5 22.5C3.95 22.5 3.47917 22.3042 3.0875 21.9125C2.69583 21.5208 2.5 21.05 2.5 20.5V6.5H4.5V20.5H18.5V22.5H4.5Z"
                    fill="#0F8EEA"
                  />
                </g>
              </svg>
              <div className="tasks-card-new">New Task</div>
            </div>
            <div className="tasks-card-list">
              <div className="task-item">
                <div className="left-side-task-item">
                  <div className="task-card-name">Check Floor 2</div>
                </div>
                <div className="right-side-task-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none">
                    <path
                      d="M6.89333 10.5666L11.9067 5.86665L10.9111 4.93331L6.89333 8.69998L4.86666 6.79998L3.8711 7.73331L6.89333 10.5666ZM7.88888 14.1666C6.90518 14.1666 5.98073 13.9916 5.11555 13.6416C4.25036 13.2916 3.49777 12.8166 2.85777 12.2166C2.21777 11.6166 1.7111 10.9111 1.33777 10.1C0.964438 9.28887 0.777771 8.4222 0.777771 7.49998C0.777771 6.57776 0.964438 5.71109 1.33777 4.89998C1.7111 4.08887 2.21777 3.38331 2.85777 2.78331C3.49777 2.18331 4.25036 1.70831 5.11555 1.35831C5.98073 1.00831 6.90518 0.833313 7.88888 0.833313C8.87259 0.833313 9.79703 1.00831 10.6622 1.35831C11.5274 1.70831 12.28 2.18331 12.92 2.78331C13.56 3.38331 14.0667 4.08887 14.44 4.89998C14.8133 5.71109 15 6.57776 15 7.49998C15 8.4222 14.8133 9.28887 14.44 10.1C14.0667 10.9111 13.56 11.6166 12.92 12.2166C12.28 12.8166 11.5274 13.2916 10.6622 13.6416C9.79703 13.9916 8.87259 14.1666 7.88888 14.1666ZM7.88888 12.8333C9.47703 12.8333 10.8222 12.3166 11.9244 11.2833C13.0267 10.25 13.5778 8.98887 13.5778 7.49998C13.5778 6.01109 13.0267 4.74998 11.9244 3.71665C10.8222 2.68331 9.47703 2.16665 7.88888 2.16665C6.30073 2.16665 4.95555 2.68331 3.85333 3.71665C2.7511 4.74998 2.19999 6.01109 2.19999 7.49998C2.19999 8.98887 2.7511 10.25 3.85333 11.2833C4.95555 12.3166 6.30073 12.8333 7.88888 12.8333Z"
                      fill="#42EB52"
                    />
                  </svg>
                  <div className="tasks-card-points">
                    <div className="point-task"></div>
                    <div className="point-task"></div>
                    <div className="point-task"></div>
                  </div>
                </div>
              </div>
              <div className="task-item">
                <div className="left-side-task-item">
                  <div className="task-card-name">Check Floor 2</div>
                </div>
                <div className="right-side-task-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none">
                    <path
                      d="M6.89333 10.5666L11.9067 5.86665L10.9111 4.93331L6.89333 8.69998L4.86666 6.79998L3.8711 7.73331L6.89333 10.5666ZM7.88888 14.1666C6.90518 14.1666 5.98073 13.9916 5.11555 13.6416C4.25036 13.2916 3.49777 12.8166 2.85777 12.2166C2.21777 11.6166 1.7111 10.9111 1.33777 10.1C0.964438 9.28887 0.777771 8.4222 0.777771 7.49998C0.777771 6.57776 0.964438 5.71109 1.33777 4.89998C1.7111 4.08887 2.21777 3.38331 2.85777 2.78331C3.49777 2.18331 4.25036 1.70831 5.11555 1.35831C5.98073 1.00831 6.90518 0.833313 7.88888 0.833313C8.87259 0.833313 9.79703 1.00831 10.6622 1.35831C11.5274 1.70831 12.28 2.18331 12.92 2.78331C13.56 3.38331 14.0667 4.08887 14.44 4.89998C14.8133 5.71109 15 6.57776 15 7.49998C15 8.4222 14.8133 9.28887 14.44 10.1C14.0667 10.9111 13.56 11.6166 12.92 12.2166C12.28 12.8166 11.5274 13.2916 10.6622 13.6416C9.79703 13.9916 8.87259 14.1666 7.88888 14.1666ZM7.88888 12.8333C9.47703 12.8333 10.8222 12.3166 11.9244 11.2833C13.0267 10.25 13.5778 8.98887 13.5778 7.49998C13.5778 6.01109 13.0267 4.74998 11.9244 3.71665C10.8222 2.68331 9.47703 2.16665 7.88888 2.16665C6.30073 2.16665 4.95555 2.68331 3.85333 3.71665C2.7511 4.74998 2.19999 6.01109 2.19999 7.49998C2.19999 8.98887 2.7511 10.25 3.85333 11.2833C4.95555 12.3166 6.30073 12.8333 7.88888 12.8333Z"
                      fill="#42EB52"
                    />
                  </svg>
                  <div className="tasks-card-points">
                    <div className="point-task"></div>
                    <div className="point-task"></div>
                    <div className="point-task"></div>
                  </div>
                </div>
              </div>
              <div className="task-item">
                <div className="left-side-task-item">
                  <div className="task-card-name">Check Floor 2</div>
                </div>
                <div className="right-side-task-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none">
                    <path
                      d="M6.89333 10.5666L11.9067 5.86665L10.9111 4.93331L6.89333 8.69998L4.86666 6.79998L3.8711 7.73331L6.89333 10.5666ZM7.88888 14.1666C6.90518 14.1666 5.98073 13.9916 5.11555 13.6416C4.25036 13.2916 3.49777 12.8166 2.85777 12.2166C2.21777 11.6166 1.7111 10.9111 1.33777 10.1C0.964438 9.28887 0.777771 8.4222 0.777771 7.49998C0.777771 6.57776 0.964438 5.71109 1.33777 4.89998C1.7111 4.08887 2.21777 3.38331 2.85777 2.78331C3.49777 2.18331 4.25036 1.70831 5.11555 1.35831C5.98073 1.00831 6.90518 0.833313 7.88888 0.833313C8.87259 0.833313 9.79703 1.00831 10.6622 1.35831C11.5274 1.70831 12.28 2.18331 12.92 2.78331C13.56 3.38331 14.0667 4.08887 14.44 4.89998C14.8133 5.71109 15 6.57776 15 7.49998C15 8.4222 14.8133 9.28887 14.44 10.1C14.0667 10.9111 13.56 11.6166 12.92 12.2166C12.28 12.8166 11.5274 13.2916 10.6622 13.6416C9.79703 13.9916 8.87259 14.1666 7.88888 14.1666ZM7.88888 12.8333C9.47703 12.8333 10.8222 12.3166 11.9244 11.2833C13.0267 10.25 13.5778 8.98887 13.5778 7.49998C13.5778 6.01109 13.0267 4.74998 11.9244 3.71665C10.8222 2.68331 9.47703 2.16665 7.88888 2.16665C6.30073 2.16665 4.95555 2.68331 3.85333 3.71665C2.7511 4.74998 2.19999 6.01109 2.19999 7.49998C2.19999 8.98887 2.7511 10.25 3.85333 11.2833C4.95555 12.3166 6.30073 12.8333 7.88888 12.8333Z"
                      fill="#42EB52"
                    />
                  </svg>
                  <div className="tasks-card-points">
                    <div className="point-task"></div>
                    <div className="point-task"></div>
                    <div className="point-task"></div>
                  </div>
                </div>
              </div>
              <div className="task-item">
                <div className="left-side-task-item">
                  <div className="task-card-name">Check Floor 2</div>
                </div>
                <div className="right-side-task-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none">
                    <path
                      d="M6.89333 10.5666L11.9067 5.86665L10.9111 4.93331L6.89333 8.69998L4.86666 6.79998L3.8711 7.73331L6.89333 10.5666ZM7.88888 14.1666C6.90518 14.1666 5.98073 13.9916 5.11555 13.6416C4.25036 13.2916 3.49777 12.8166 2.85777 12.2166C2.21777 11.6166 1.7111 10.9111 1.33777 10.1C0.964438 9.28887 0.777771 8.4222 0.777771 7.49998C0.777771 6.57776 0.964438 5.71109 1.33777 4.89998C1.7111 4.08887 2.21777 3.38331 2.85777 2.78331C3.49777 2.18331 4.25036 1.70831 5.11555 1.35831C5.98073 1.00831 6.90518 0.833313 7.88888 0.833313C8.87259 0.833313 9.79703 1.00831 10.6622 1.35831C11.5274 1.70831 12.28 2.18331 12.92 2.78331C13.56 3.38331 14.0667 4.08887 14.44 4.89998C14.8133 5.71109 15 6.57776 15 7.49998C15 8.4222 14.8133 9.28887 14.44 10.1C14.0667 10.9111 13.56 11.6166 12.92 12.2166C12.28 12.8166 11.5274 13.2916 10.6622 13.6416C9.79703 13.9916 8.87259 14.1666 7.88888 14.1666ZM7.88888 12.8333C9.47703 12.8333 10.8222 12.3166 11.9244 11.2833C13.0267 10.25 13.5778 8.98887 13.5778 7.49998C13.5778 6.01109 13.0267 4.74998 11.9244 3.71665C10.8222 2.68331 9.47703 2.16665 7.88888 2.16665C6.30073 2.16665 4.95555 2.68331 3.85333 3.71665C2.7511 4.74998 2.19999 6.01109 2.19999 7.49998C2.19999 8.98887 2.7511 10.25 3.85333 11.2833C4.95555 12.3166 6.30073 12.8333 7.88888 12.8333Z"
                      fill="#42EB52"
                    />
                  </svg>
                  <div className="tasks-card-points">
                    <div className="point-task"></div>
                    <div className="point-task"></div>
                    <div className="point-task"></div>
                  </div>
                </div>
              </div>
              <div className="task-item">
                <div className="left-side-task-item">
                  <div className="task-card-name">Check Floor 2</div>
                </div>
                <div className="right-side-task-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none">
                    <path
                      d="M6.89333 10.5666L11.9067 5.86665L10.9111 4.93331L6.89333 8.69998L4.86666 6.79998L3.8711 7.73331L6.89333 10.5666ZM7.88888 14.1666C6.90518 14.1666 5.98073 13.9916 5.11555 13.6416C4.25036 13.2916 3.49777 12.8166 2.85777 12.2166C2.21777 11.6166 1.7111 10.9111 1.33777 10.1C0.964438 9.28887 0.777771 8.4222 0.777771 7.49998C0.777771 6.57776 0.964438 5.71109 1.33777 4.89998C1.7111 4.08887 2.21777 3.38331 2.85777 2.78331C3.49777 2.18331 4.25036 1.70831 5.11555 1.35831C5.98073 1.00831 6.90518 0.833313 7.88888 0.833313C8.87259 0.833313 9.79703 1.00831 10.6622 1.35831C11.5274 1.70831 12.28 2.18331 12.92 2.78331C13.56 3.38331 14.0667 4.08887 14.44 4.89998C14.8133 5.71109 15 6.57776 15 7.49998C15 8.4222 14.8133 9.28887 14.44 10.1C14.0667 10.9111 13.56 11.6166 12.92 12.2166C12.28 12.8166 11.5274 13.2916 10.6622 13.6416C9.79703 13.9916 8.87259 14.1666 7.88888 14.1666ZM7.88888 12.8333C9.47703 12.8333 10.8222 12.3166 11.9244 11.2833C13.0267 10.25 13.5778 8.98887 13.5778 7.49998C13.5778 6.01109 13.0267 4.74998 11.9244 3.71665C10.8222 2.68331 9.47703 2.16665 7.88888 2.16665C6.30073 2.16665 4.95555 2.68331 3.85333 3.71665C2.7511 4.74998 2.19999 6.01109 2.19999 7.49998C2.19999 8.98887 2.7511 10.25 3.85333 11.2833C4.95555 12.3166 6.30073 12.8333 7.88888 12.8333Z"
                      fill="#42EB52"
                    />
                  </svg>
                  <div className="tasks-card-points">
                    <div className="point-task"></div>
                    <div className="point-task"></div>
                    <div className="point-task"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="file-recent-card">
            <div className="card-title">Recent Files</div>
            <div className="card-recent-file-list">
              <div className="card-file">
                <img src="" alt="" srcset="" />
                <div className="card-content-file">
                  <div className="user-name-file">mohamad</div>
                  <div className="middel">
                    <img src="" alt="" srcset="" />
                    <div className="file-recent-name">file</div>
                  </div>
                  <div className="uploaded_at">07/05/20033</div>
                </div>
              </div>
              <div className="card-file">
                <img src="" alt="" srcset="" />
                <div className="card-content-file">
                  <div className="user-name-file">mohamad</div>
                  <div className="middel">
                    <img src="" alt="" srcset="" />
                    <div className="file-recent-name">file</div>
                  </div>
                  <div className="uploaded_at">07/05/20033</div>
                </div>
              </div>
              <div className="card-file">
                <img src="" alt="" srcset="" />
                <div className="card-content-file">
                  <div className="user-name-file">mohamad</div>
                  <div className="middel">
                    <img src="" alt="" srcset="" />
                    <div className="file-recent-name">file</div>
                  </div>
                  <div className="uploaded_at">07/05/20033</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-card"></div>
      </div>
    </div>
  );
}

export default Dashboard;
