import React, { useContext, useEffect } from "react";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import "./ProjectsTable.css";
import Input from "../input/input";
import Loading from "../common/loading";
import { MultiSelect } from "react-multi-select-component";
import { ProjectContext } from "../../context/ProjectContext";
import Message from "../common/Message/message";
import Modal from "react-modal";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ProjectsTable({ openedProject }) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [allusers, setallusers] = useState([]);
  // const { allusers } = useContext(ProjectContext);
  const [isloading, setIsloading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [newProjectError, setNewProjectError] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamNameErrorMessage, setNewTeamNameErrorMessage] = useState("");
  const [UpdateProjectErrorMessage, setUpdateProjectErrorMessage] = useState({
    name: "",
    description: "",
    location: "",
  });
  const [updateProjectIsDone, setUpdateProjectIsDone] = useState(false);
  const [updateProjectError, setUpdateProjectError] = useState(false);
  const [updatedProjectName, setUpdatedProjectname] = useState("");
  const [open, setOpen] = useState(false);
  const [openProjectSetting, setOpenProjectSetting] = useState(false);
  const [openAddMemberModel, setOpenAddMemberModel] = useState(false);
  const [isRemovedId, setIsRemovedId] = useState("");
  const [editingProject, setEditingProject] = useState([]);
  const [projectMemberId, setProjectMemberId] = useState([]);
  const [removedMember, setRemovedMember] = useState({
    member_id: "",
    team_member_id: "",
    name: "",
  });
  const [selected, setSelected] = useState([]);
  const [creatingTeamIsDone, setCreatingTeamIsDone] = useState(false);
  const [createdTeamName, setCreatedTeamName] = useState("");
  const [createTeamError, setCreateTeamError] = useState("");
  const [creatingTeamLoading, setCreatingTeamLoading] = useState(false);
  const [newMember, setNewMember] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedMember, setSelectedMember] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedTeamOption, setSelectedTeamOption] = useState([]);
  const cancelButtonRef = useRef(null);
  function closeAddMemberModel() {
    setOpenAddMemberModel(false);
    setSelectedTeam([]);
    setSelectedMember([]);
  }

  let selected_users_id = [];
  async function addMember() {
    selectedMember.map((select) => {
      selected_users_id.push(select.value);
    });
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/project-section/add_members`,
        {
          members: selected_users_id,
          team: selectedTeam.id,
        }
      );
      const add_member = await response.data;
      if (add_member.status == "success") {
        setNewMember(true);
        setIsloading(false);
        setOpenAddMemberModel(false);
        openedProject.teams.map((team, index) => {
          if (team.id === selectedTeam.id) {
            openedProject.teams[index] = add_member.data[0];
            console.log(openedProject);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllUser() {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/common/get_all_users_not_active`
      );
      const users = await response.data.data;
      setallusers(users);
    } catch (error) {
      console.log(error);
    }
  }

  function handleProjectName(e) {
    setProjectName(e.target.value);
    setUpdateProjectErrorMessage({
      name: "",
    });
  }
  function handleProjectLocation(e) {
    setProjectLocation(e.target.value);
    setUpdateProjectErrorMessage({
      location: "",
    });
  }
  function handleProjectDescription(e) {
    setProjectDescription(e.target.value);
    setUpdateProjectErrorMessage({
      description: "",
    });
  }
  function handleTeamName(e) {
    setNewTeamName(e.target.value);
    setNewTeamNameErrorMessage("");
    setCreateTeamError("");
  }
  const transformedData = allusers
    .filter(
      (user) =>
        user.id !== userData.user.id && !projectMemberId.includes(user.id)
    )
    .map((user) => ({
      label: `${user.first_name} ${user.last_name} - ${user.email}`,
      value: user.id,
    }));

  async function handleRemoveMember() {
    const data = new FormData();
    data.append("member_id", removedMember.member_id);
    data.append("member_team_id", removedMember.team_member_id);
    data.append("project_id", userData.active);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/project-section/remove_member",
        data
      );
      const removed = await response.data;
      if (removed.status == "success") {
        setIsRemovedId(removed.data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function handleEditProject(
    projectName,
    projectDescription,
    projectLocation,
    projectStatus,
    id
  ) {
    const data = new FormData();
    data.append("name", projectName);
    data.append("description", projectDescription);
    data.append("location", projectLocation);
    data.append("status", projectStatus);
    data.append("finished-at", null);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/project-section/new_project/${id}`,
        data
      );
      const removed = await response.data;
      if ((removed.status = "success")) {
        setIsloading(false);
        setUpdatedProjectname(removed.data.name);
        setUpdateProjectIsDone(true);
        setIsRemovedId(removed.data);
      }
    } catch (error) {
      setIsloading(false);
      setUpdateProjectError(true);
    }
    setProjectDescription("");
    setProjectName("");
    setProjectLocation("");
  }

  async function createTeam() {
    setCreatingTeamIsDone(false);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/project-section/add_team",
        {
          team_name: newTeamName,
          project_id: editingProject.id,
          team_members: selectedUser,
        }
      );
      const added_team = await response.data;
      setCreatingTeamIsDone(true);
      setCreatedTeamName(added_team.data.name);
      openedProject.teams.push(added_team.data);
      setCreatingTeamLoading(false);
      setTimeout(() => {
        setUpdateProjectIsDone(false);
      }, 3000);
    } catch (error) {
      setCreatingTeamLoading(false);
      setCreateTeamError(error.response.data.message);
    }
    setNewTeamName("");
    setSelected([]);
  }
  useEffect(() => {
    const matchedUsers = allusers
      .filter((user) => selected?.some((member) => member.value === user.id))
      .map((user) => user.id);

    setSelectedUser(matchedUsers);
  }, [selected]);

  useEffect(() => {
    const memberIds = [];
    openedProject.teams.forEach((team) => {
      team.members.forEach((person) => {
        if (person.user.id !== isRemovedId) {
          memberIds.push(person.user.id);
        }
      });
    });

    setProjectMemberId(memberIds);
  }, [openedProject, isRemovedId]);

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <>
      {/* {updateProjectIsDone && <Message text={`Project Is Updated`} />} */}
      <div className="py-14 sm:py-32 memebers-details">
        <div className="mx-auto grid max-w-7xl gap-x-8 px-6 lg:px-8 xl:grid-auto-columns">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              <div className="name-edit">
                <div>{openedProject.name} </div>
                {openedProject.created_by === userData.user.id && (
                  <div className="icon-project-add">
                    <svg
                      width="40px"
                      height="40px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="edit-btn"
                      onClick={() => {
                        setOpenProjectSetting(!openProjectSetting);
                        setEditingProject(openedProject);
                      }}>
                      <path
                        d="M10.4 5.6C10.4 4.84575 10.4 4.46863 10.6343 4.23431C10.8686 4 11.2458 4 12 4C12.7542 4 13.1314 4 13.3657 4.23431C13.6 4.46863 13.6 4.84575 13.6 5.6V6.6319C13.9725 6.74275 14.3287 6.8913 14.6642 7.07314L15.3942 6.34315C15.9275 5.80982 16.1942 5.54315 16.5256 5.54315C16.8569 5.54315 17.1236 5.80982 17.6569 6.34315C18.1903 6.87649 18.4569 7.14315 18.4569 7.47452C18.4569 7.80589 18.1903 8.07256 17.6569 8.60589L16.9269 9.33591C17.1087 9.67142 17.2573 10.0276 17.3681 10.4H18.4C19.1542 10.4 19.5314 10.4 19.7657 10.6343C20 10.8686 20 11.2458 20 12C20 12.7542 20 13.1314 19.7657 13.3657C19.5314 13.6 19.1542 13.6 18.4 13.6H17.3681C17.2573 13.9724 17.1087 14.3286 16.9269 14.6641L17.6569 15.3941C18.1902 15.9275 18.4569 16.1941 18.4569 16.5255C18.4569 16.8569 18.1902 17.1235 17.6569 17.6569C17.1236 18.1902 16.8569 18.4569 16.5255 18.4569C16.1942 18.4569 15.9275 18.1902 15.3942 17.6569L14.6642 16.9269C14.3286 17.1087 13.9724 17.2573 13.6 17.3681V18.4C13.6 19.1542 13.6 19.5314 13.3657 19.7657C13.1314 20 12.7542 20 12 20C11.2458 20 10.8686 20 10.6343 19.7657C10.4 19.5314 10.4 19.1542 10.4 18.4V17.3681C10.0276 17.2573 9.67142 17.1087 9.33591 16.9269L8.60598 17.6569C8.07265 18.1902 7.80598 18.4569 7.47461 18.4569C7.14324 18.4569 6.87657 18.1902 6.34324 17.6569C5.80991 17.1235 5.54324 16.8569 5.54324 16.5255C5.54324 16.1941 5.80991 15.9275 6.34324 15.3941L7.07314 14.6642C6.8913 14.3287 6.74275 13.9725 6.6319 13.6H5.6C4.84575 13.6 4.46863 13.6 4.23431 13.3657C4 13.1314 4 12.7542 4 12C4 11.2458 4 10.8686 4.23431 10.6343C4.46863 10.4 4.84575 10.4 5.6 10.4H6.6319C6.74275 10.0276 6.8913 9.67135 7.07312 9.33581L6.3432 8.60589C5.80987 8.07256 5.5432 7.80589 5.5432 7.47452C5.5432 7.14315 5.80987 6.87648 6.3432 6.34315C6.87654 5.80982 7.1432 5.54315 7.47457 5.54315C7.80594 5.54315 8.07261 5.80982 8.60594 6.34315L9.33588 7.07308C9.6714 6.89128 10.0276 6.74274 10.4 6.6319V5.6Z"
                        stroke="#464455"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14.4 12C14.4 13.3255 13.3255 14.4 12 14.4C10.6745 14.4 9.6 13.3255 9.6 12C9.6 10.6745 10.6745 9.6 12 9.6C13.3255 9.6 14.4 10.6745 14.4 12Z"
                        stroke="#464455"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <svg
                      fill="#9393ff"
                      version="1.1"
                      id="Capa_1"
                      width="40px"
                      height="40px"
                      viewBox="0 0 27.021 27.022"
                      onClick={() => {
                        setOpenAddMemberModel(true);
                      }}>
                      <g>
                        <g>
                          <path
                            d="M17.855,21.223c0-1.902,1.049-3.55,2.588-4.44c-0.963-0.308-2-0.552-3.09-0.722c2.342-1.299,3.929-3.794,3.929-6.663
			c0-4.207-3.41-7.617-7.617-7.617s-7.617,3.41-7.617,7.617c0,2.868,1.587,5.364,3.929,6.663C4.223,16.958,0,19.897,0,23.389h18.35
			C18.041,22.727,17.855,22,17.855,21.223z"
                          />
                        </g>
                        <path
                          d="M23.004,17.206c-2.218,0-4.018,1.797-4.018,4.018c0,2.219,1.8,4.017,4.018,4.017c2.219,0,4.018-1.798,4.018-4.017
		C27.02,19.002,25.223,17.206,23.004,17.206z M25.627,21.936h-1.909v1.91h-1.427v-1.91h-1.91v-1.429h1.91v-1.911h1.427v1.911h1.909
		V21.936z"
                        />
                      </g>
                    </svg>
                  </div>
                )}
              </div>
              <p className="team-name-member">{openedProject.location}</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {openedProject.description}
              </p>
            </h2>
          </div>
          {openProjectSetting ? (
            <div className="edit-project-model">
              {/* <h2 className="model-title new-project-model-title">
                Edit Project
              </h2> */}
              <div className="edit-project-coonatiner">
                <div className="first-inputs">
                  <Input
                    label={"Project Name"}
                    name={"project-name"}
                    type={"text"}
                    value={editingProject.name}
                    onchange={handleProjectName}
                  />
                  {newProjectError && (
                    <div className="error">
                      {UpdateProjectErrorMessage.name}
                    </div>
                  )}
                  <Input
                    label={"Project Location"}
                    name={"project-location"}
                    type={"text"}
                    value={editingProject.location}
                    onchange={handleProjectLocation}
                  />
                  {newProjectError && (
                    <div className="error">
                      {UpdateProjectErrorMessage.location}
                    </div>
                  )}
                </div>
                <div className="second-inputs">
                  <textarea
                    name=""
                    id="description"
                    cols="30"
                    rows="5"
                    placeholder={editingProject.description}
                    onChange={(e) => {
                      handleProjectDescription(e);
                    }}></textarea>
                  <div className="create-team-loading">
                    <div
                      className={`update-project-btn ${
                        projectName || projectDescription || projectLocation
                          ? "btn"
                          : "on-procress"
                      } `}
                      onClick={() => {
                        handleEditProject(
                          projectName ? projectName : openedProject.name,
                          projectDescription
                            ? projectDescription
                            : openedProject.description,
                          projectLocation
                            ? projectLocation
                            : openedProject.location,
                          openedProject.status,
                          openedProject.id
                        );
                        setIsloading(true);
                      document.getElementById("project-name").value = "";
                      document.getElementById("project-location").value = "";
                      document.getElementById("description").value = "";
                      }}>
                      Update Project
                    </div>
                    {isloading && (
                      <div className="loading-new-project">
                        <Loading />
                        Updating Project Info
                      </div>
                    )}
                  </div>
                </div>
                <div className="line-edit"></div>
                {creatingTeamIsDone && (
                  <Message text={`${createdTeamName} Team Is Created`} />
                )}
              </div>
              <h2 className="model-title new-project-model-title">Add Team</h2>
              <div>
                <Input
                  label={"Team Name"}
                  name={"team_name"}
                  type={"text"}
                  onchange={handleTeamName}
                />
                {newProjectError && (
                  <div className="error">{newTeamNameErrorMessage}</div>
                )}
                <div className="add-team-member">
                  <div className="add-team-member-title"> Team Members</div>
                  <MultiSelect
                    options={transformedData}
                    value={selected}
                    onChange={setSelected}
                    labelledBy="Select"
                  />
                </div>
                <div className="seleted-add-members">
                  <>
                    {allusers.map((user) => {
                      return (
                        <>
                          {selected.map((member) => {
                            if (member.value == user.id) {
                              return (
                                <div key={user.id}>
                                  <div className="flex items-center gap-x-2">
                                    <img
                                      className="h-16 w-16 rounded-full"
                                      src={user.profile_img}
                                      alt=""
                                    />
                                    <div>
                                      <p className="team-name-member"></p>
                                      <p className="text-sm font-semibold leading-6 text-indigo-600">
                                        {`${user.first_name} ${user.last_name}`}
                                      </p>
                                      <p className="team-name-member">
                                        {user.email}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </>
                      );
                    })}
                  </>
                </div>
                <div className="create-team-loading">
                  <div
                    className="btn btn-create-team"
                    onClick={() => {
                      document.getElementById("team_name").value = "";
                      createTeam();
                      setCreatingTeamLoading(true);
                    }}>
                    Create Team
                  </div>
                  <div className="btns-new-file btns-new-project">
                    <div>{createTeamError}</div>
                    {creatingTeamLoading && (
                      <div className="loading-new-project">
                        <Loading />
                        Creating new team
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {openedProject.teams.length > 0 ? (
                <ul
                  role="list"
                  className="grid mt-px gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
                  style={{
                    marginTop: "30px",
                  }}>
                  {openedProject.teams.map((team) => {
                    return (
                      <>
                        {team.members.map((person) => {
                          //   setProjectMemberId([...projectMemberId, person.user.id]);
                          if (person.user.id !== isRemovedId) {
                            return (
                              <li key={person.user.id}>
                                <div className="flex items-center gap-x-6">
                                  <img
                                    className="h-16 w-16 rounded-full"
                                    src={person.user.profile_img}
                                    alt=""
                                  />
                                  <div>
                                    <div className="member-remove">
                                      <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
                                        {`${person.user.first_name} ${person.user.last_name}`}
                                      </h3>
                                      {openedProject.created_by ===
                                        userData.user.id && (
                                        <div
                                          className="remove-member"
                                          onClick={() => {
                                            setOpen(true);
                                            setRemovedMember({
                                              member_id: person.user.id,
                                              team_member_id: team.id,
                                              name: person.user.first_name,
                                            });
                                          }}>
                                          <svg
                                            width="20px"
                                            height="20px"
                                            viewBox="0 0 24 24"
                                            fill="#ff4747"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                              fill-rule="evenodd"
                                              clip-rule="evenodd"
                                              d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z"
                                              fill="#ff4747"
                                            />
                                            <path
                                              d="M16 11C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H16Z"
                                              fill="#ff4747"
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </div>

                                    <p className="text-sm font-semibold leading-6 text-indigo-600">
                                      {team.name}
                                    </p>
                                    <p className="team-name-member">
                                      {person.user.email}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            );
                          }
                        })}
                      </>
                    );
                  })}
                </ul>
              ) : (
                <div>
                  <>
                    <div className="project-post-empty">
                      <div className="empty-title">
                        Team Work Is The best Start
                      </div>
                      <div className="empty-text">
                        Looks like there are no Team && Members yet. Start
                        building you team
                      </div>
                      <button
                        className="btn empty-button"
                        onClick={() => {
                          setOpenProjectSetting(true);
                          setEditingProject(openedProject);
                        }}>
                        Create New Team
                      </button>
                    </div>
                  </>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
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
                          Remove Member
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to remove {removedMember.name}
                            ? All this data will be permanently removed. This
                            action cannot be undone.
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
                        handleRemoveMember();
                        setOpen(false);
                      }}>
                      Remove
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}>
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Modal
        isOpen={openAddMemberModel}
        onRequestClose={closeAddMemberModel}
        ariaHideApp={false}
        className="new-file-model branche-model project-model">
        <h2 className="model-title new-project-model-title">
          Create New Project
        </h2>
        <Listbox value={selectedTeamOption} onChange={setSelectedTeamOption}>
          {({ open }) => (
            <>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                  <span className="flex items-center">
                    <span className="ml-3 block truncate">
                      {selectedTeam.name ? (
                        <div>{selectedTeam.name}</div>
                      ) : (
                        <div>Select Team</div>
                      )}
                    </span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0">
                  <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {openedProject.teams.map((team) => (
                      <Listbox.Option
                        key={team.id}
                        className={({ active }) =>
                          classNames(
                            active
                              ? "bg-indigo-600 text-white"
                              : "text-gray-900",
                            "relative cursor-default select-none py-2 pl-3 pr-9"
                          )
                        }
                        value={team.name}
                        onClick={() => {
                          setSelectedTeam(team);
                        }}>
                        {({ selectedTeamOption, active }) => (
                          <>
                            <div className="flex items-center">
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "ml-3 block truncate"
                                )}>
                                {team.name}
                              </span>
                            </div>

                            {selectedTeamOption ? (
                              <span
                                className={classNames(
                                  active ? "text-white" : "text-indigo-600",
                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                )}>
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
        <MultiSelect
          options={transformedData}
          value={selectedMember}
          onChange={setSelectedMember}
          labelledBy="Select"
        />
        <div className="btns-new-file btns-new-project">
          {isloading && (
            <div className="loading-new-project">Adding New Memebrs</div>
          )}
          <button className="btn close-btn" onClick={closeAddMemberModel}>
            Close
          </button>
          <button
            className="btn"
            onClick={() => {
              addMember();
              setIsloading(true);
            }}>
            Add
          </button>
        </div>
      </Modal>
    </>
  );
}

export default ProjectsTable;
