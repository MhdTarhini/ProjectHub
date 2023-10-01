import React, { useEffect, useRef, useState } from "react";
import "./projectsSection.css";
import Modal from "react-modal";
import Input from "../../component/input/input";
import axios from "axios";
import Loading from "../../component/common/loading/loading";
import Message from "../../component/common/Message/message";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import ProjectsTable from "../../component/projectsTable/ProjectsTable";
import { Dialog } from "@headlessui/react";
import Logo from "../../component/logo/Logo";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ProjectsSection() {
  const user = JSON.parse(localStorage.getItem("user"));
  axios.defaults.headers.common["Authorization"] = `Bearer ${user.user.token}`;
  const cancelButtonRef = useRef(null);
  const [modalProjectOpen, setModalProjectOpen] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [newProjectError, setNewProjectError] = useState(false);
  const [isUpdatedStatus, setIsUpdatedStatus] = useState(false);
  const [newProjectErrorMessage, setNewProjectErrorMessage] = useState({
    name: "",
    description: "",
    location: "",
  });
  const [createdProjectname, setCreatedProjectname] = useState("");
  const [projectstatusID, setprojectstatusID] = useState("");
  const [createdProjectIsDone, setCreatedProjectIsDone] = useState(false);
  const [userMemberProjects, setUserMemberProjects] = useState([]);
  const [userManagerProjects, setUserManagerProjects] = useState([]);
  const [openProjectdetails, setOpenProjectdetails] = useState(false);
  const [openedProject, setOpenedProject] = useState([]);
  const [userProjects, setUserProject] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const [open, setOpen] = useState(false);
  const [projectSavedStatus, setProjectSavedStatus] = useState("");
  const [showlogo, setShowlogo] = useState(true);
  const [status, setStatus] = useState([
    {
      status: "Active",
      value: 1,
    },
    {
      status: "Pending",
      value: 2,
    },
    {
      status: "Done",
      value: 3,
    },
  ]);

  function openProjectModal() {
    setModalProjectOpen(true);
    setIsloading(false);
    setCreatedProjectIsDone(false);
  }
  function closeProjectModal() {
    setModalProjectOpen(false);
    setIsloading(false);
    setNewProjectErrorMessage({
      name: "",
      description: "",
      location: "",
    });
  }
  function handleProjectName(e) {
    setProjectName(e.target.value);
    setNewProjectErrorMessage({
      name: "",
    });
  }
  function handleProjectLocation(e) {
    setProjectLocation(e.target.value);
    setNewProjectErrorMessage({
      location: "",
    });
  }
  function handleProjectDescription(e) {
    setProjectDescription(e.target.value);
    setNewProjectErrorMessage({
      description: "",
    });
  }
  async function newProject() {
    let userDataRaw = localStorage.getItem("user");
    const userData = JSON.parse(userDataRaw);
    const data = new FormData();
    data.append("name", projectName);
    data.append("description", projectDescription);
    data.append("location", projectLocation);
    data.append("status", 2);
    data.append("finished-at", null);
    try {
      const response = await axios.post(
        "http://34.244.172.132/api/project-section/new_project",
        data
      );
      const new_project = await response.data;
      if ((new_project.status = "success")) {
        setIsloading(false);
        closeProjectModal();
        setCreatedProjectname(new_project.data.name);
        setCreatedProjectIsDone(true);
        userData.projects_Manager_id = [
          ...userData.projects_Manager_id,
          new_project.data.id,
        ];
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      setIsloading(false);
      setNewProjectError(true);
      setNewProjectErrorMessage({
        name: error.response.data.errors.name || "",
        description: error.response.data.errors.description || "",
        location: error.response.data.errors.location || "",
      });
    }
    setProjectDescription("");
    setProjectName("");
    setProjectLocation("");
  }

  async function updateStatus(project_id, status) {
    let userDataRaw = localStorage.getItem("user");

    const userData = JSON.parse(userDataRaw);

    let flag = false;
    if (
      userData.active !== project_id &&
      status === 1 &&
      userData.active !== 0
    ) {
      setIsloading(false);
      setOpen(true);
      flag = true;
    }

    if (!flag) {
      const data = new FormData();
      data.append("project_id", project_id);
      data.append("status", status);
      try {
        const response = await axios.post(
          "http://34.244.172.132/api/project-section/update_status",
          data
        );
        const get_status = await response.data;
        setProjectSavedStatus(get_status.data);
        if (get_status.data.status == 1) {
          userData.active = get_status.data.id;
        } else if (userData.active == get_status.data.id) {
          userData.active = 0;
        }
        localStorage.setItem("user", JSON.stringify(userData));
        setIsloading(false);
        setIsUpdatedStatus(!isUpdatedStatus);
      } catch (error) {
        setIsloading(false);
        console.error(error);
      }
    }
  }

  async function getProject() {
    try {
      const response = await axios.post(
        "http://34.244.172.132/api/project-section/get_projects",
        {
          member_projects: user.projects_Manager_id,
          manager_projects: user.projects_Member_id,
        }
      );
      const get_projects = await response.data;
      setUserMemberProjects(get_projects.member);
      setUserManagerProjects(get_projects.manager);
      setUserProject([...get_projects.member, ...get_projects.manager]);
    } catch (error) {
      console.error(error);
    }
  }
  const statusColors = {
    1: "#0F8EEA",
    2: "yellow",
    3: "#42EB52",
  };

  useEffect(() => {
    getProject();
  }, [createdProjectIsDone, isUpdatedStatus]);

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
        <div className="project-section">
          {createdProjectIsDone && (
            <Message
              text={`${createdProjectname} Project Is Created`}
              type={"success"}
            />
          )}
          <div className="projects-file-section">
            <div className="top-file-section">
              <div className="file-section-title">Projects Section</div>
              <div className="btn" onClick={openProjectModal}>
                + new project
              </div>
            </div>
          </div>
          <div className="hr"></div>

          <div className="project-section-table">
            {openProjectdetails ? (
              <>
                <div
                  onClick={() => {
                    setOpenProjectdetails(false);
                  }}>
                  <svg
                    style={{ marginLeft: "40px", cursor: "pointer" }}
                    width="40px"
                    height="40px"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="#0f8eea"
                      d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                    />
                    <path
                      fill="#0f8eea"
                      d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                    />
                  </svg>
                </div>
                <ProjectsTable openedProject={openedProject} />
              </>
            ) : (
              <div>
                {userProjects.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Projects</th>
                        <th>Location</th>
                        <th>Members</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userProjects.map((item, index) => (
                        <React.Fragment key={index + "a"}>
                          <tr className="row-project">
                            <td>{item.name}</td>
                            <td>{item.location}</td>
                            <td className="members-images">
                              {item.teams.map((team, teamIndex) => {
                                return team.members.map((user, userIndex) => (
                                  <img
                                    src={user.user.profile_img}
                                    className={`members-img img-${
                                      userIndex + 1
                                    }`}
                                    alt={`${user.user.name}`}
                                    key={userIndex + "b"}
                                  />
                                ));
                              })}
                            </td>
                            <td style={{ width: "200px", margin: "0" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}>
                                {isloading && projectstatusID === item.id && (
                                  <div className="project-status-loading">
                                    <Loading />
                                  </div>
                                )}
                                <Menu
                                  as="div"
                                  style={{ width: "200px", margin: "0" }}>
                                  <div>
                                    <Menu.Button
                                      style={{
                                        justifyContent: "space-between",
                                        width: "200px",
                                        padding: "10px 15px",
                                        color: `black`,
                                        border: `1px solid ${
                                          statusColors[item.status]
                                        }`,
                                        cursor: `${
                                          item.created_by === user.user.id
                                            ? "pointer"
                                            : "default"
                                        }  `,
                                      }}
                                      className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md bg-white px-20 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                      <div className="branch-naming">
                                        {status.map((state) => {
                                          if (state.value == item.status) {
                                            return <div>{state.status}</div>;
                                          }
                                        })}
                                      </div>
                                      {item.created_by === user.user.id && (
                                        <ChevronDownIcon
                                          className="-mr-1 h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                      )}
                                    </Menu.Button>
                                  </div>
                                  {item.created_by === user.user.id && (
                                    <Transition
                                      as="div"
                                      enter="transition ease-out duration-100"
                                      enterFrom="transform opacity-0 scale-95"
                                      enterTo="transform opacity-100 scale-100"
                                      leave="transition ease-in duration-75"
                                      leaveFrom="transform opacity-100 scale-100"
                                      leaveTo="transform opacity-0 scale-95">
                                      <Menu.Items className="menu-items absolute top-0 mt-2 w-60 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none focus:bg-grey">
                                        {status.map((state) => (
                                          <div
                                            className="py-1 menu-items"
                                            key={state.status}
                                            onClick={() => {
                                              updateStatus(
                                                item.id,
                                                state.value
                                              );
                                              setIsloading(true);
                                              setprojectstatusID(item.id);
                                            }}>
                                            <Menu.Item>
                                              {({ active }) => (
                                                <a
                                                  href="#"
                                                  className={classNames(
                                                    active
                                                      ? `bg-grey-100 text-gray-900`
                                                      : "text-gray-700",
                                                    "block px-4 py-2 text-sm flex items-center justify-center"
                                                  )}>
                                                  {state.status}
                                                </a>
                                              )}
                                            </Menu.Item>
                                          </div>
                                        ))}
                                      </Menu.Items>
                                    </Transition>
                                  )}
                                </Menu>
                              </div>
                            </td>
                            <td>{item.created_at.split("T")[0]}</td>
                            <svg
                              style={{
                                marginTop: "10px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setOpenProjectdetails(true);
                                setOpenedProject(item);
                              }}
                              fill="#000000"
                              width="30px"
                              height="30px"
                              viewBox="0 0 32 32"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg">
                              <title>go</title>
                              <path d="M27.728 16.024l-8.485 8.482-2.828-2.835 3.656-3.671h-14.071v-4h14.071l-3.657-3.644 2.828-2.816 8.486 8.484z"></path>
                            </svg>
                          </tr>
                          <div className="line-table"></div>
                        </React.Fragment>
                      ))}
                      <div className="line-table"></div>
                    </tbody>
                  </table>
                ) : (
                  <div>
                    <>
                      <div className="project-post-empty">
                        <div className="empty-title">
                          Create Your Own Journery
                        </div>
                        <div className="empty-text">
                          Looks like there are no Project yet. Start your own
                          Projects and get insights from the community.
                        </div>
                        <button className="btn empty-button">
                          Create New Project
                        </button>
                      </div>
                    </>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <Modal
        isOpen={modalProjectOpen}
        onRequestClose={closeProjectModal}
        ariaHideApp={false}
        className="new-file-model branche-model project-model"
        style={{ overlay: { background: "rgb(0 0 0 / 30%)" } }}>
        <h2 className="model-title new-project-model-title">
          Create New Project
        </h2>
        <Input
          label={"Project Name"}
          name={"project-name"}
          type={"text"}
          onchange={handleProjectName}
        />
        {newProjectError && (
          <div className="error">{newProjectErrorMessage.name}</div>
        )}
        <Input
          label={"Project Description"}
          name={"project-description"}
          type={"text"}
          onchange={handleProjectDescription}
        />
        {newProjectError && (
          <div className="error">{newProjectErrorMessage.description}</div>
        )}

        <Input
          label={"Project Location"}
          name={"project-location"}
          type={"text"}
          onchange={handleProjectLocation}
        />
        {newProjectError && (
          <div className="error">{newProjectErrorMessage.location}</div>
        )}
        <div className="btns-new-file btns-new-project">
          {isloading && (
            <div className="loading-new-project">
              Creating new project
              <Loading />
            </div>
          )}
          <button className="btn close-btn" onClick={closeProjectModal}>
            close
          </button>
          <button
            className="btn"
            onClick={() => {
              newProject();
              setIsloading(true);
            }}>
            Create
          </button>
        </div>
      </Modal>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900">
                          Time Management Warning
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            There Another Active Project At This Moment
                          </p>
                          <p className="text-sm text-gray-500">
                            You Must Handle || Finishe it First !!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        setOpen(false);
                        setIsloading(false);
                      }}>
                      close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default ProjectsSection;
