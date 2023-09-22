import React, { useContext, useEffect, useState } from "react";
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
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function FilesSection() {
  const user = JSON.parse(localStorage.getItem("user"));
  axios.defaults.headers.common["Authorization"] = `Bearer ${user.user.token}`;
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
    id: "1",
  });
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [updateFile, setUpdateFile] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [modalBrancheOpen, setModalBrancheOpen] = React.useState(false);
  const [selected, setSelected] = useState([]);
  const { teamMember } = useContext(ProjectContext);

  const transformedData = teamMember.map((member) => ({
    label: `${member.user.first_name} ${member.user.last_name} - ${member.user.email}`,
    value: member.user.id,
  }));

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
  function newBranch() {
    const data = new FormData();
    selected.map((select) => {
      console.log(select);
      selected_users_id.push(select.value);
    });
    data.append("members", selected_users_id);
    data.append("project_id", user.active);
    data.append("name", brancheName);

    try {
      const response = axios.post(
        "http://127.0.0.1:8000/api/file-section/new_branch",
        data
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmitUpload() {
    const data = new FormData();
    data.append("name", fileName);
    data.append("path_svg", getSvg);
    data.append("path_dxf", file);
    data.append("version", 1);
    data.append("project_id", user.active);
    data.append("user_id", 3);
    data.append("branche_id", selectedBranche.id);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/upload_file",
        data
      );
      const get_files = await response.data;
      if (get_files.status === "success") {
        setUpdateFile(!updateFile);
        closeModal();
        setfile([]);
        setIsloading(false);
      }
    } catch (error) {
      console.error(error);
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
      }
    } catch (error) {
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
    getBranches();
    window.electron.on(channels.Extract_Data_IsDone, (data) => {
      setUploadSuccess(true);
    });

    window.electron.on(channels.Covert_Data_to_svg_IsDone, (data) => {
      setSvgSuccess(true);
      const decodedData = base64.decode(data);
      setGetSvg(decodedData);
    });
    if (user.team_active == 0) {
      setIsManager(true);
    }
  }, []);

  return (
    <>
      <div className="files-section">
        <div className="top-file-section">
          <div className="file-section-title">Files Section</div>
          {!isManager && (
            <div onClick={openModal} className="btn">
              New File
            </div>
          )}
        </div>
        <div className="hr"></div>
        <div className="branches-filter">
          <div className="branches">
            <Menu
              as="div"
              className="relative inline-block text-left w-100 menu">
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
                <Menu.Items className="menu-items absolute left-0 mt-2 w-60 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {branches.map((branche) => (
                    <div className="py-1 menu-items" key={branche.id}>
                      <Menu.Item onClick={() => setSelectedBranche(branche)}>
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
            </Menu>
          </div>
          <div className="right-side-file-section">
            <div className="branch-option">
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
                  <Menu.Items className="menu-items absolute right-0 z-10 mt-2 w-60 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {!isManager && (
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
                            Delete Branch
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <div className="filter-file">
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="hr"></div>

        <div className="file-section-card">
          <FilesContainer
            branche={selectedBranche}
            file={file}
            updateFile={updateFile}
          />
        </div>
      </div>
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
          <h2 className="model-title">Add New Branche</h2>
          <Input
            label={"Branch Name"}
            name={"branch-name"}
            type={"text"}
            onchange={handleBrancheName}
          />
          <div>
            <MultiSelect
              options={transformedData}
              value={selected}
              onChange={setSelected}
              labelledBy="Select"
            />
          </div>
          <div className="btns-new-file">
            <button className="btn close-btn" onClick={closeBrancheModal}>
              close
            </button>
            <button className="btn" onClick={newBranch}>
              Create
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default FilesSection;
