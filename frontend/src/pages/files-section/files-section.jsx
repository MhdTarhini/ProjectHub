import React, {useEffect, useState } from "react";
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
import Loading from "../../component/common/loading/loading";
import Logo from "../../component/logo/Logo";
import Message from "../../component/common/Message/message";
import PopupMessage from "../../component/common/Message/popup-message/popupMessage";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function FilesSection() {
  const user = JSON.parse(localStorage.getItem("user"));
  axios.defaults.headers.common["Authorization"] = `Bearer ${user.user.token}`;
  const [file, setfile] = useState([]);
  const [fileName, setFileName] = useState("");
  const [getSvg, setGetSvg] = useState("");
  const [brancheName, setBrancheName] = useState("");
  const [SvgSuccess, setSvgSuccess] = useState(false);
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
  const [CheckingConlfectFile, SetCheckingConlfectFile] = useState(false);
  const [pullMessage, setPullMessage] = useState([]);
  const [isdeleted, setIsdeleted] = useState(false);
  const [teamMember, setTeamMember] = useState([]);
  const [showlogo, setShowlogo] = useState(true);
  const [transformedData, setTransformedData] = useState([]);
  const [noBranchMessage, setNoBranchMessage] = useState(false);
  const [newBranchError, setNewBranchError] = useState("");
  const [checkConflictMode, setCheckConflictMode] = useState(false);
  const [isNewFile, setIsnewFile] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
        handleTogglePopup();
      }
    } catch (error) {
      console.error(error);
    }
  }

  function ConflictMode() {
    SetCheckingConlfectFile(true);
    setCheckConflictMode(true);
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
    window.electron.on(channels.Covert_Data_to_svg_IsDone, (data) => {
      setSvgSuccess(true);
      const decodedData = base64.decode(data);
      setGetSvg(decodedData);
    });
    if (user.projects_Manager_id.includes(user.active)) {
      setIsManager(true);
    }
  }, []);

  const handleTogglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    getTeamMember();
    getBranches();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowlogo(false);
    }, 3000);
  }, []);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

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
          {noBranchMessage && <Message text={"No Branch Founded"} />}
          {isdeleted && <Message text={"File Is Deleted"} type={"success"} />}
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
                        {!isManager && user.active !== 0 && (
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
        <PopupMessage
          pullMessage={pullMessage}
          ConflictMode={ConflictMode}
          pullData={pullData}
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
        />
      </div>
    </>
  );
}

export default FilesSection;
