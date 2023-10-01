import React, { useContext, useEffect, useState } from "react";
import "./dashboard.css";
import WeatherWidget from "../../component/weather/weather";
import Logo from "../../component/logo/Logo";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Message from "../../component/common/Message/message";
import Loading from "../../component/common/loading/loading";
import Modal from "react-modal";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  axios.defaults.headers.common["Authorization"] = `Bearer ${user.user.token}`;
  const [value, onChange] = useState(new Date());
  const [showlogo, setShowlogo] = useState(true);
  const [recentFiles, setRecentFiles] = useState([]);
  const [recentRooms, setRecentRoom] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const [mainCommit, setMainCommit] = useState([]);
  const [donePush, setDonePush] = useState(false);
  const [tasksTitle, setTasksTitle] = useState([]);
  const [noTasks, setNoTasks] = useState(false);
  const [CheckFileIsOpen, setCheckFileIsOpen] = useState(false);
  const [seletedFile, setSeletedFile] = useState("");
  const navigate = useNavigate();

  function closeCheckFile() {
    setCheckFileIsOpen(false);
  }

  async function getRecentFiles() {
    let role = "user";
    if (user.projects_Manager_id.includes(user.active)) {
      role = "manager";
    }
    const data = new FormData();
    data.append("project_id", user.active);
    data.append("role", role);
    data.append("team_id", user.team_active);
    try {
      const response = await axios.post(
        `http://34.244.172.132/api/file-section/recent_files`,
        data
      );
      const recentFiles = await response.data;
      setRecentFiles(recentFiles.data);
    } catch (error) {
      console.log(error);
    }
  }
  async function getTasksTitle() {
    try {
      const response = await axios.get(
        `http://34.244.172.132/api/task-section/tasks_title/${user.active}`
      );
      const tasksTitle = await response.data;
      if (tasksTitle.status === "success") {
        setTasksTitle(tasksTitle.data);
      } else {
        setNoTasks(true);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function handleAcceptPushToMain() {
    try {
      const response = await axios.get(
        `http://34.244.172.132/api/file-section/get_main_commit/${user.active}`
      );
      const mainCommitData = await response.data;
      setMainCommit(mainCommitData.data);
      console.log(mainCommitData);
    } catch (error) {
      console.log(error);
    }
  }

  async function getRecentRooms() {
    try {
      const response = await axios.get(
        `http://34.244.172.132/api/chat-section/get_rooms`
      );
      const recentRooms = await response.data;
      setRecentRoom(recentRooms.data);
    } catch (error) {
      console.log(error);
    }
  }
  async function AcceptePush(commit_id) {
    const data = new FormData();
    data.append("commit_id", commit_id);

    try {
      const response = await axios.post(
        `http://34.244.172.132/api/file-section/accepte_push`,
        data
      );
      const commitPushed = await response.data;
      console.log(commitPushed.data);
      if (commitPushed.status === "success") {
        setDonePush(true);
        mainCommit = mainCommit.filter(
          (commit) => commit.id !== commitPushed.data.id
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getRecentFiles();
    getRecentRooms();
    handleAcceptPushToMain();
    getTasksTitle();
    if (user.projects_Manager_id.includes(user.active)) {
      setIsManager(true);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowlogo(false);
    }, 3000);
  }, []);

  return (
    <>
      {showlogo ? (
        <Logo />
      ) : (
        <div className="dashboard-section">
          {donePush && <Message text="File is pushed" />}
          <div className="dashboard-title">Dashboard</div>
          <div className="dashboard-container">
            <div className=" dashboard-card">
              <div className="tasks-card">
                <div className="card-title">Tasks</div>
                <div
                  className="tasks-card-new-btn"
                  onClick={() => {
                    navigate("/v1/tasks-section");
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none">
                    <mask id="mask0_77_428" x="0" y="0" width="25" height="25">
                      <rect
                        x="0.5"
                        y="0.5"
                        width="24"
                        height="24"
                        fill="#D9D9D9"
                      />
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
                  {noTasks ? (
                    <div className="no-recent-tastks">No Tasks</div>
                  ) : (
                    tasksTitle.map((task) => {
                      return (
                        <div className="task-item">
                          <div className="left-side-task-item">
                            <div className="task-card-name">{task.text}</div>
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
                      );
                    })
                  )}
                </div>
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-title-files">Recent Files</div>
              <div className="file-recent-card">
                {recentFiles.length > 0 ? (
                  <div className="file-dash-card">
                    {recentFiles.map((branch) => {
                      return branch.files.map((file) => {
                        return (
                          <>
                            <div
                              class="card-dash"
                              onClick={() => {
                                setSeletedFile(
                                  `http://34.244.172.132/storage/${
                                    file.path_svg.split("/")[4]
                                  }`
                                );
                                setCheckFileIsOpen(true);
                              }}>
                              <div className="top-card-file-recent">
                                <img
                                  src={file.user?.profile_img}
                                  alt=""
                                  srcset=""
                                  className="image-user"
                                />
                                <div className="h11">{file.name}</div>
                              </div>
                              <img
                                src={`http://34.244.172.132/storage/${
                                  file.path_svg.split("/")[4]
                                }`}
                                alt=""
                                srcset=""
                              />
                            </div>
                          </>
                        );
                      });
                    })}
                  </div>
                ) : (
                  <div className="no-recent-files">No Recent Files</div>
                )}
              </div>
            </div>
            <div className="dashboard-card">
              <WeatherWidget />
            </div>
            <div className="dashboard-card">
              <div className="chat-card">
                <div className="top-chat-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none">
                    <mask
                      id="mask0_86_677"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="24"
                      height="24">
                      <rect width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_86_677)">
                      <path
                        d="M0 18V16.425C0 15.7083 0.366667 15.125 1.1 14.675C1.83333 14.225 2.8 14 4 14C4.21667 14 4.425 14.0042 4.625 14.0125C4.825 14.0208 5.01667 14.0417 5.2 14.075C4.96667 14.425 4.79167 14.7917 4.675 15.175C4.55833 15.5583 4.5 15.9583 4.5 16.375V18H0ZM6 18V16.375C6 15.8417 6.14583 15.3542 6.4375 14.9125C6.72917 14.4708 7.14167 14.0833 7.675 13.75C8.20833 13.4167 8.84583 13.1667 9.5875 13C10.3292 12.8333 11.1333 12.75 12 12.75C12.8833 12.75 13.6958 12.8333 14.4375 13C15.1792 13.1667 15.8167 13.4167 16.35 13.75C16.8833 14.0833 17.2917 14.4708 17.575 14.9125C17.8583 15.3542 18 15.8417 18 16.375V18H6ZM19.5 18V16.375C19.5 15.9417 19.4458 15.5333 19.3375 15.15C19.2292 14.7667 19.0667 14.4083 18.85 14.075C19.0333 14.0417 19.2208 14.0208 19.4125 14.0125C19.6042 14.0042 19.8 14 20 14C21.2 14 22.1667 14.2208 22.9 14.6625C23.6333 15.1042 24 15.6917 24 16.425V18H19.5ZM8.125 16H15.9C15.7333 15.6667 15.2708 15.375 14.5125 15.125C13.7542 14.875 12.9167 14.75 12 14.75C11.0833 14.75 10.2458 14.875 9.4875 15.125C8.72917 15.375 8.275 15.6667 8.125 16ZM4 13C3.45 13 2.97917 12.8042 2.5875 12.4125C2.19583 12.0208 2 11.55 2 11C2 10.4333 2.19583 9.95833 2.5875 9.575C2.97917 9.19167 3.45 9 4 9C4.56667 9 5.04167 9.19167 5.425 9.575C5.80833 9.95833 6 10.4333 6 11C6 11.55 5.80833 12.0208 5.425 12.4125C5.04167 12.8042 4.56667 13 4 13ZM20 13C19.45 13 18.9792 12.8042 18.5875 12.4125C18.1958 12.0208 18 11.55 18 11C18 10.4333 18.1958 9.95833 18.5875 9.575C18.9792 9.19167 19.45 9 20 9C20.5667 9 21.0417 9.19167 21.425 9.575C21.8083 9.95833 22 10.4333 22 11C22 11.55 21.8083 12.0208 21.425 12.4125C21.0417 12.8042 20.5667 13 20 13ZM12 12C11.1667 12 10.4583 11.7083 9.875 11.125C9.29167 10.5417 9 9.83333 9 9C9 8.15 9.29167 7.4375 9.875 6.8625C10.4583 6.2875 11.1667 6 12 6C12.85 6 13.5625 6.2875 14.1375 6.8625C14.7125 7.4375 15 8.15 15 9C15 9.83333 14.7125 10.5417 14.1375 11.125C13.5625 11.7083 12.85 12 12 12ZM12 10C12.2833 10 12.5208 9.90417 12.7125 9.7125C12.9042 9.52083 13 9.28333 13 9C13 8.71667 12.9042 8.47917 12.7125 8.2875C12.5208 8.09583 12.2833 8 12 8C11.7167 8 11.4792 8.09583 11.2875 8.2875C11.0958 8.47917 11 8.71667 11 9C11 9.28333 11.0958 9.52083 11.2875 9.7125C11.4792 9.90417 11.7167 10 12 10Z"
                        fill="#888888"
                      />
                    </g>
                  </svg>
                </div>
                {recentRooms.length > 0 ? (
                  <div className="chat-list-card-container">
                    {recentRooms.map((room) => {
                      return (
                        <Link to={"/v1/chats-section"}>
                          <div className="chat-list-card-item">
                            <img
                              src={room.room_image}
                              alt=""
                              srcset=""
                              className="room-image-card"
                            />
                            <div className="room-info-card">
                              <div className="room-title-card">{room.name}</div>
                              <div className="room-content-card">
                                Hello sir , today we have to many tasks..
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-recent-files">No Rooms</div>
                )}
              </div>
            </div>
            {isManager && (
              <div className="notification-card-conatainer">
                <div className="notification-card">
                  <div className="top-notoication-card">
                    <div className="notification-title">Notification</div>
                    <svg
                      width="26px"
                      height="26px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <circle
                        cx="19"
                        cy="5"
                        r="3"
                        stroke="#1C274C"
                        stroke-width="1.5"
                      />
                      <path
                        d="M7 14H16"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M7 17.5H13"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M2 12C2 16.714 2 19.0711 3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12V10.5M13.5 2H12C7.28595 2 4.92893 2 3.46447 3.46447C2.49073 4.43821 2.16444 5.80655 2.0551 8"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>
                  <div className="list-not">
                    {mainCommit.length > 0 ? (
                      mainCommit.map((commit) => {
                        return (
                          <div className="notification-list-item">
                            <div className="card-content-file">
                              <div className="middel">
                                <img
                                  src={`http://34.244.172.132/storage/thid%20file.svg
                              `}
                                  alt=""
                                  srcset=""
                                  className="img-commit-not"
                                />
                              </div>
                              <div className="right-not-side">
                                <div className="file-notification-name">
                                  {commit.message}
                                </div>
                                <div className="btns-not">
                                  <button
                                    className="button-accpt"
                                    onClick={() => AcceptePush(commit.id)}>
                                    Accepte
                                  </button>
                                  <button className="button-refuse">
                                    Ignore
                                  </button>
                                </div>
                                <div className="user-info-card-not">
                                  <img
                                    src={commit.user?.profile_img}
                                    alt=""
                                    srcset=""
                                    className="image-user"
                                  />
                                  <div className="user-name-file">
                                    {`${commit.user?.first_name} ${commit.user?.last_name}`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-recent-files">No notification</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <Modal
        isOpen={CheckFileIsOpen}
        onRequestClose={closeCheckFile}
        ariaHideApp={false}
        className="check-conflict-model"
        style={{ overlay: { background: "rgb(0 0 0 / 15%)" } }}>
        {seletedFile ? (
          <img
            src={seletedFile}
            style={{ height: 700 }}
            alt="SVG"
            srcSet=""
            className="svg-image"
          />
        ) : (
          <Loading />
        )}
      </Modal>
    </>
  );
}

export default Dashboard;
