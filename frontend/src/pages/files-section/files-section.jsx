import React, { useContext, useEffect, useRef, useState } from "react";
import { channels } from "../../shared/constants";
import "./files-section.css";
import Modal from "react-modal";
import Input from "../../component/input/input";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import FilesContainer from "../../component/FilesContainer/filesContainer";
import base64 from "base-64";
import { ProjectContext } from "../../context/ProjectContext";
import Loading from "../../component/common/loading";
import CheckConflict from "../../component/CheckConflict/CheckConflict";
import { Fragment } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import Logo from "../../component/logo/Logo";
import Message from "../../component/common/Message/message";
import { Alert } from "@mui/material";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function FilesSection() {
  const user = JSON.parse(localStorage.getItem("user"));
  axios.defaults.headers.common["Authorization"] = `Bearer ${user.user.token}`;
  const cancelButtonRef = useRef(null);
  const [file, setfile] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [getSvg, setGetSvg] = useState("");
  const [brancheName, setBrancheName] = useState("");
  const [SvgSuccess, setSvgSuccess] = useState(false);
  const [dxfFile, setDxfFile] = useState(null);
  const [branche, setBranche] = useState("main");
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedBranche, setSelectedBranche] = useState({
    id: user.main_branch ? user.main_branch : 0,
    name: user.main_branch !== 0 ? "main" : null,
  });
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [updateFile, setUpdateFile] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [modalBrancheOpen, setModalBrancheOpen] = React.useState(false);
  const [selected, setSelected] = useState([]);
  const [pullData, setPullData] = useState([]);
  const [open, setOpen] = useState(false);
  const [CheckingConlfectFile, SetCheckingConlfectFile] = useState(false);
  const [pullFilesIsDone, setPullFilesIsDone] = useState(false);
  const [pullMessage, setPullMessage] = useState([]);
  const [isdeleted, setIsdeleted] = useState(false);
  const [newBranchDone, setNewbranchDone] = useState(false);
  const [teamMember, setTeamMember] = useState([]);
  const [showlogo, setShowlogo] = useState(true);
  const [transformedData, setTransformedData] = useState([]);
  const [noBranchMessage, setNoBranchMessage] = useState(false);
  const [newBranchError, setNewBranchError] = useState("");
  const [checkConflictMode, setCheckConflictMode] = useState(false);
  const [isNewFile, setIsnewFile] = useState(false);

  async function getTeamMember() {
    try {
      const project_id = user.active;
      const response = await axios.get(
        `http://127.0.0.1:8000/api/common/get_project_Member/${project_id}`
      );
      const teamData = await response.data.data;
      setTeamMember(teamData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setTransformedData(
      teamMember.map((member) => ({
        label: `${member.user.first_name} ${member.user.last_name} - ${member.user.email}`,
        value: member.user.id,
      }))
    );
  }, [modalBrancheOpen]);

  function openModal() {
    setIsOpen(true);
    setIsloading(false);
  }
  function closeModal() {
    setIsOpen(false);
    setfile([]);
    setSvgSuccess(false);
    setIsloading(false);
  }
  function openBrancheModal() {
    setModalBrancheOpen(true);
    setIsloading(false);
  }
  function closeBrancheModal() {
    setModalBrancheOpen(false);
    setIsloading(false);
    setNewBranchError("");
  }
  function handleUpload(e) {
    const file_uploaded = e.target.files[0];
    if (file_uploaded) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dxf_file = event.target.result;
        setDxfFile(dxf_file);
        window.electron.send(channels.Covert_Data_to_svg, { dxf_file });
      };
      reader.readAsDataURL(file_uploaded);
    } else {
      console.log("No file uploaded");
    }
  }

  function handleFileName(e) {
    setError(false);
    setFileName(e.target.value);
  }

  let selected_users_id = [];

  async function newBranch() {
    setNewbranchDone(false);
    const data = new FormData();
    selected.map((select) => {
      selected_users_id.push(select.value);
    });
    data.append("members", selected_users_id);
    data.append("project_id", user.active);
    data.append("name", brancheName);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/new_branch",
        data
      );
      const new_branche = await response.data;
      if (new_branche.status === "success") {
        setNewbranchDone(true);
        closeBrancheModal();
        setIsloading(false);
        setBranches((branches) => [...branches, new_branche.data]);
      }
    } catch (error) {
      setIsloading(false);
      console.error(error);
      setNewBranchError(error.response.data.message);
    }
  }

  const handleDataFromChild = () => {
    SetCheckingConlfectFile(false);
    setCheckConflictMode(false);
  };

  async function handleSubmitUpload() {
    const data = new FormData();
    data.append("name", fileName);
    data.append("path_svg", getSvg);
    data.append("path_dxf", file);
    data.append("version", 1);
    data.append("project_id", user.active);
    data.append("user_id", user.user.id);
    data.append("branche_id", selectedBranche.id);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/upload_file",
        data
      );
      const get_files = await response.data;
      if (get_files.status === "success") {
        setUpdateFile(get_files.data);
        closeModal();
        setfile([]);
        setIsloading(false);
        setIsnewFile(true);
      } else {
        setError(true);
        setErrorMessage("name is not valid");
      }
    } catch (error) {
      setError(true);
      setErrorMessage(error.response.data.message);
    }
  }

  async function PullFromMain() {
    const data = new FormData();
    data.append("team_id", user.team_active);
    data.append("branch_id", selectedBranche.id);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/pull_main",
        data
      );
      const pull_files = await response.data;
      if (pull_files.status === "success") {
        setPullData(response.data.data);
        setPullMessage(response.data);
        setOpen(true);
        setPullFilesIsDone(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteBranch() {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/file-section/delete_branch/${selectedBranche.id}`
      );
      const deleteBranch = await response.data;
      if (deleteBranch.status === "success") {
        setIsdeleted(true);
      } else {
        setNoBranchMessage(true);
      }
    } catch (error) {
      setNoBranchMessage(true);
      console.error(error);
    }
  }

  function handleBrancheName(e) {
    setBrancheName(e.target.value);
  }

  async function getBranches() {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/file-section/get_branches/${user.active}`
      );
      const branchesData = await response.data;
      setBranches(branchesData.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    window.electron.on(channels.Extract_Data_IsDone, (data) => {
      setUploadSuccess(true);
    });

    window.electron.on(channels.Covert_Data_to_svg_IsDone, (data) => {
      setSvgSuccess(true);
      const decodedData = base64.decode(data);
      setGetSvg(decodedData);
    });
    if (user.projects_Manager_id.includes(user.active)) {
      setIsManager(true);
    }
  }, []);

  useEffect(() => {
    getTeamMember();
    getBranches();
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
        <div className="files-section">
          <div className="top-file-section">
            <div className="file-section-title">Files Section</div>
            {selectedBranche.name === "main" || user.active === 0 ? (
              <div></div>
            ) : (
              <div onClick={openModal} className="btn">
                New File
              </div>
            )}
          </div>
          <div className="hr"></div>
          {/* {noBranchMessage && <Message text={"No Branch Founded"} />} */}
          {newBranchDone && (
            <Alert severity="success">
              This is a success alert — check it out!
            </Alert>
          )}
          <div className="branches-filter">
            <div className="branches">
              <Menu
                as="div"
                className=" menu relative inline-block text-left w-100">
                {checkConflictMode ? (
                  <div className="conlfict-mode">
                    <svg
                      width="30px"
                      height="30px"
                      viewBox="0 0 1024 1024"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        setPullData([]);
                        setCheckConflictMode(false);
                        handleDataFromChild();
                      }}
                      style={{ cursor: "pointer" }}>
                      <path
                        fill="#000000"
                        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                      />
                      <path
                        fill="#000000"
                        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                      />
                    </svg>
                    <div className="title-check-consflict">Check Conflict</div>
                  </div>
                ) : (
                  <>
                    <div>
                      <Menu.Button
                        style={{
                          justifyContent: "space-between",
                          width: "200px",
                          padding: "10px 15px",
                        }}
                        className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md bg-white px-20 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <div className="branch-naming">
                          {selectedBranche.name ? (
                            <div>{selectedBranche.name}</div>
                          ) : (
                            <div>Branches</div>
                          )}
                        </div>
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as="div"
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95">
                      <Menu.Items className=" absolute left-0 mt-2 w-60 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {branches.map((branche) => (
                          <div className="py-1 m" key={branche.id}>
                            <Menu.Item
                              onClick={() => setSelectedBranche(branche)}>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-2 text-sm flex items-center justify-center"
                                  )}>
                                  {branche.name}
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        ))}
                        {!isManager && (
                          <div className="py-1">
                            <Menu.Item onClick={openBrancheModal}>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-2 text-sm flex items-center justify-center"
                                  )}>
                                  add Branche
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        )}
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
            <div className="right-side-file-section">
              <div className="branch-option">
                {selectedBranche.name !== "main" && (
                  <Menu as="div" className=" text-left w-100 option-menu">
                    <div>
                      <Menu.Button>
                        <svg
                          fill="#000000"
                          version="1.1"
                          id="Capa_1"
                          width="30px"
                          height="30px"
                          viewBox="0 0 24.75 24.75">
                          <g>
                            <path
                              d="M0,3.875c0-1.104,0.896-2,2-2h20.75c1.104,0,2,0.896,2,2s-0.896,2-2,2H2C0.896,5.875,0,4.979,0,3.875z M22.75,10.375H2
		c-1.104,0-2,0.896-2,2c0,1.104,0.896,2,2,2h20.75c1.104,0,2-0.896,2-2C24.75,11.271,23.855,10.375,22.75,10.375z M22.75,18.875H2
		c-1.104,0-2,0.896-2,2s0.896,2,2,2h20.75c1.104,0,2-0.896,2-2S23.855,18.875,22.75,18.875z"
                            />
                          </g>
                        </svg>
                      </Menu.Button>
                    </div>
                    <Transition
                      as="div"
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95">
                      <Menu.Items className=" absolute right-0 z-10 mt-2 w-60 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {!isManager && user.projects_Member_id.length > 0 && (
                            <Menu.Item onClick={PullFromMain}>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-2 text-sm flex items-center justify-center"
                                  )}>
                                  Pull From Main
                                </a>
                              )}
                            </Menu.Item>
                          )}
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm flex items-center justify-center"
                                )}
                                onClick={() => {
                                  deleteBranch();
                                }}>
                                Delete Branch
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
            </div>
          </div>
          <div className="hr"></div>

          <div className="file-section-card">
            <FilesContainer
              branche={selectedBranche}
              file={file}
              updateFile={updateFile}
              isNewFile={isNewFile}
              pullData={pullData}
              onData={handleDataFromChild}
              openCheck={CheckingConlfectFile}
            />
          </div>
        </div>
      )}
      <div className="model-container">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
          className="new-file-model"
          style={{ overlay: { background: "rgb(0 0 0 / 15%)" } }}>
          <h2 className="model-title">Upload New File</h2>
          <div className="upload-file-form">
            <div className="file-name-conatainer">
              <Input
                label={"File Name"}
                name={"file-name"}
                type={"text"}
                onchange={handleFileName}
              />
            </div>
            <div className="input-upload-file">
              <label className="btn" htmlFor="new-file">
                <div className="download-icon">
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="fffff"
                    xmlns="http://www.w3.org/2000/svg">
                    <g id="Interface / Download">
                      <path
                        id="Vector"
                        d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        stroke-linejoin="round"
                        fill="fffff"
                      />
                    </g>
                  </svg>
                </div>
                Upload File
              </label>
              <input
                type="file"
                id="new-file"
                name="new-file"
                onChange={(e) => {
                  setfile(e.target.files[0]);
                  handleUpload(e);
                  setIsloading(true);
                }}
                className="none"
              />
              <div>{file.name}</div>
              {isLoading && !SvgSuccess ? <Loading /> : null}
            </div>
            {error && <div className="error ">{errorMessage}</div>}
            <div className="btns-new-file">
              <button className="btn close-btn" onClick={closeModal}>
                close
              </button>
              <button
                className={`${SvgSuccess && fileName ? "btn" : "on-procress"}`}
                onClick={handleSubmitUpload}>
                submit
              </button>
            </div>
          </div>
        </Modal>
      </div>
      <div className="model-container">
        <Modal
          isOpen={modalBrancheOpen}
          onRequestClose={closeBrancheModal}
          ariaHideApp={false}
          className="new-file-model branche-model"
          style={{ overlay: { background: "rgb(0 0 0 / 15%)" } }}>
          <h2 className="model-title">Create New Branche</h2>
          <Input
            label={"Branch Name"}
            name={"branch-name"}
            type={"text"}
            onchange={handleBrancheName}
          />
          {newBranchError && (
            <div className="error">{newBranchError.split("(")[0]}</div>
          )}
          <div>
            <MultiSelect
              options={transformedData}
              value={selected}
              onChange={setSelected}
              labelledBy="Select"
            />
          </div>
          <div className="btns-new-file">
            {isLoading && <Loading />}
            <button className="btn close-btn" onClick={closeBrancheModal}>
              Close
            </button>
            <button
              className={` ${selected.length === 0 ? "on-procress" : "btn"}`}
              onClick={() => {
                newBranch();
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
                          {pullMessage.added > 0 &&
                          pullMessage.conflict === 0 ? (
                            <svg
                              width="20px"
                              height="25px"
                              viewBox="0 0 117 117"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg">
                              <title />
                              <desc />
                              <defs />
                              <g
                                fill="none"
                                fill-rule="evenodd"
                                id="Page-1"
                                stroke="none"
                                stroke-width="1">
                                <g fill-rule="nonzero" id="correct">
                                  <path
                                    d="M34.5,55.1 C32.9,53.5 30.3,53.5 28.7,55.1 C27.1,56.7 27.1,59.3 28.7,60.9 L47.6,79.8 C48.4,80.6 49.4,81 50.5,81 C50.6,81 50.6,81 50.7,81 C51.8,80.9 52.9,80.4 53.7,79.5 L101,22.8 C102.4,21.1 102.2,18.5 100.5,17 C98.8,15.6 96.2,15.8 94.7,17.5 L50.2,70.8 L34.5,55.1 Z"
                                    fill="#17AB13"
                                    id="Shape"
                                  />
                                  <path
                                    d="M89.1,9.3 C66.1,-5.1 36.6,-1.7 17.4,17.5 C-5.2,40.1 -5.2,77 17.4,99.6 C28.7,110.9 43.6,116.6 58.4,116.6 C73.2,116.6 88.1,110.9 99.4,99.6 C118.7,80.3 122,50.7 107.5,27.7 C106.3,25.8 103.8,25.2 101.9,26.4 C100,27.6 99.4,30.1 100.6,32 C113.1,51.8 110.2,77.2 93.6,93.8 C74.2,113.2 42.5,113.2 23.1,93.8 C3.7,74.4 3.7,42.7 23.1,23.3 C39.7,6.8 65,3.9 84.8,16.2 C86.7,17.4 89.2,16.8 90.4,14.9 C91.6,13 91,10.5 89.1,9.3 Z"
                                    fill="#4A4A4A"
                                    id="Shape"
                                  />
                                </g>
                              </g>
                            </svg>
                          ) : (
                            <ExclamationTriangleIcon
                              className="h-6 w-6 text-red-600"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900">
                            Pull Result !
                          </Dialog.Title>
                          {pullMessage && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                {pullMessage.added} Were Added
                              </p>
                              <p className="text-sm text-gray-500">
                                There are conflicts in {pullMessage.conflict}{" "}
                                files
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      {pullData.length > 0 && (
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                          onClick={() => {
                            SetCheckingConlfectFile(true);
                            setOpen(false);
                            setCheckConflictMode(true);
                          }}>
                          check
                        </button>
                      )}
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}>
                        close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </>
  );
}

export default FilesSection;
