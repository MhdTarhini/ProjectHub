import React, { useEffect, useRef, useState } from "react";
import "./FilesContainer.css";
import axios from "axios";
import { channels } from "../../shared/constants";
import Input from "../input/input";
import Modal from "react-modal";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import base64 from "base-64";
import Loading from "../common/loading";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function FilesContainer({ branche, file, updateFile }) {
  const project_id = 1;
  const team_id = 1;
  const [open, setOpen] = useState(false);
  const [getFiles, setGetFiles] = useState([]);
  const [openedfileDetails, setOpenedFileDetails] = useState([]);
  const [update, setUpdate] = useState([]);
  const [compareSuccess, setCompareSuccess] = useState(false);
  const [CompareResult, setCompareResult] = useState("");
  const [mainCompareSuccess, setMainCompareSuccess] = useState(false);
  const [mainCompareResult, setMainCompareResult] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [FileDetails, setFileDetails] = useState("");
  const [detailsSuccess, setDetailsSuccess] = useState(false);
  const [conflictSvg, setConflitSvg] = useState("");
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [CheckCommitIsOpen, setCheckCommitIsOpen] = React.useState(false);
  const [selected, setSelected] = useState(["commit message </> version"]);
  const [allCommit, setAllCommit] = useState([]);
  const [seletedCommitSVG, setSeletedCommitSVG] = useState("");
  const [mainDxfPath, setMainDxfPath] = useState("");
  const [mainDxfVersion, setMainDxfVersion] = useState("");
  const [getSvg, setGetSvg] = useState("");
  const [svgSuccess, setSvgSuccess] = useState(false);
  const [isPushed, setIsPushed] = useState(false);
  const [commitInfo, setCommitInfo] = useState([]);
  const [mainCommitMessage, setMainCommitMessage] = useState("");
  const [mainDxfId, setMainDxfId] = useState("");
  const [CheckFileIsOpen, setCheckFileIsOpen] = useState(false);
  const [seletedFile, setSeletedFile] = useState("");

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  function openCommitModal() {
    setCheckCommitIsOpen(true);
  }

  function closeCheckCommit() {
    setCheckCommitIsOpen(false);
  }
  function openFileModal() {
    setCheckFileIsOpen(true);
  }

  function closeCheckFile() {
    setCheckFileIsOpen(false);
  }

  async function handleCommitMain(
    compare_Svg,
    new_path_svg,
    old_path_dxf,
    new_path_dxf,
    version,
    status
  ) {
    const data = new FormData();
    data.append("message", mainCommitMessage);
    data.append("file_id", mainDxfId);
    data.append("new_path_svg", new_path_svg);
    data.append("new_path_dxf", new_path_dxf);
    data.append("old_path_dxf", old_path_dxf);
    data.append("compare_path_svg", compare_Svg);
    data.append("version", version);
    data.append("status", status);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/file-section/main_commit`,
        data
      );
      const commitData = await response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function getfileCommit(file_id) {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/file-section/get_commits/${file_id}`
      );
      const commitData = await response.data;
      setAllCommit(commitData.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleGetFiles() {
    const data = new FormData();
    data.append("branche_id", branche.id);
    data.append("project_id", 1);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/get_files",
        data
      );
      const files = await response.data;
      setGetFiles(files.data);
    } catch (error) {
      console.error(error);
    }
  }
  function handleCompare(e, old_version_path) {
    const file_update = e.target.files[0];
    if (file_update) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const new_version_data = event.target.result;
        window.electron.send(channels.Compare_Data, {
          new_version_data,
          old_version_path,
        });
      };
      reader.readAsDataURL(file_update);
    } else {
      console.log("No file uploaded");
    }
  }

  async function getMainFilePath(file_name) {
    const data = new FormData();
    data.append("project_id", project_id);
    data.append("team_id", team_id);
    data.append("file_name", file_name);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/file-section/get_dxf_path`,
        data
      );
      const dxf_path = await response.data;
      setMainDxfPath(dxf_path.dxf_path);
      setMainDxfVersion(dxf_path.version);
      setMainDxfId(dxf_path.id);
    } catch (error) {
      console.error(error);
    }
  }

  function handleCommitMessage(e) {
    setCommitMessage(e.target.value);
  }
  function handleMainCommitMessage(e) {
    setMainCommitMessage(e.target.value);
  }

  function CompareWithMain(main_file_path, local_file_path) {
    window.electron.send(channels.Compare_Main_Data, {
      main_file_path,
      local_file_path,
    });
  }

  function getDxfData(file_dxf) {
    window.electron.send(channels.Get_Details, { file_dxf });
  }

  async function submitCommit(old_path_dxf, file_version, file_id) {
    const data = new FormData();
    data.append("message", commitMessage);
    data.append("compare_path_svg", CompareResult);
    data.append("new_path_svg", getSvg);
    data.append("old_path_dxf", old_path_dxf);
    data.append("new_path_dxf", update);
    data.append("version", file_version);
    data.append("status", 1);
    data.append("user_id", 3);
    data.append("file_id", file_id);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/add_commit",
        data
      );
      const commitInfo = await response.data;
      setCommitInfo(commitInfo.data);
    } catch (error) {
      console.error(error);
    }
  }
  async function displayConflict(svg_data) {
    const data = new FormData();
    data.append("svg_data", svg_data);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/check_conflict",
        data
      );
      const conflictSVG = await response.data;
      setConflitSvg(conflictSVG.data);
    } catch (error) {
      console.error(error);
    }
  }
  function handleUpload(e) {
    const file_uploaded = e.target.files[0];
    if (file_uploaded) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dxf_file = event.target.result;
        // setDxfFile(dxf_file);
        window.electron.send(channels.Covert_Data_to_svg, { dxf_file });
      };
      reader.readAsDataURL(file_uploaded);
    } else {
      console.log("No file uploaded");
    }
  }
  async function handleLocalPush() {
    const data = new FormData();
    data.append("commit_id", commitInfo.id);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/push_local_commit",
        data
      );
      const IsPushed = await response.data;
      if (IsPushed.status === "success") {
        setIsPushed(true);
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    handleGetFiles();
  }, [branche, updateFile]);

  useEffect(() => {
    window.electron.on(channels.Compare_Data_IsDone, (data) => {
      const decodedData = base64.decode(data);
      setCompareResult(decodedData);
      setCompareSuccess(true);
    });
    window.electron.on(channels.Compare_Main_Data_IsDone, (data) => {
      const decodedData = base64.decode(data);
      setMainCompareResult(decodedData);
      displayConflict(decodedData);
      setMainCompareSuccess(true);
    });
    window.electron.on(channels.Get_Details_IsDone, (data) => {
      setFileDetails(data);
      setDetailsSuccess(true);
    });
    window.electron.on(channels.Covert_Data_to_svg_IsDone, (data) => {
      const decodedData = base64.decode(data);
      setGetSvg(decodedData);
      setSvgSuccess(true);
    });
  }, []);
  return (
    <>
      <div className="files-controller">
        <div className="card-container">
          {getFiles.map((file) => {
            return (
              <div
                className="card"
                key={file.id}
                onClick={() => {
                  setOpenedFileDetails(file);
                  setSeletedFile(file.path_svg);
                  openFileModal();
                  setOpen(true);
                  getDxfData(file.path_dxf);
                  getfileCommit(file.id);
                  getMainFilePath(file.name);
                }}>
                <img
                  src={file.path_svg}
                  className="file-section-card-img"
                  alt={file.name}
                />
                <div className="middle-card">
                  <div className="file-name">{file.name}</div>
                  <div className="card-option" onClick={() => {}}>
                    <div className="point"></div>
                    <div className="point"></div>
                    <div className="point"></div>
                  </div>
                </div>
                <div className="uploaded-by">{`${file.user.first_name} ${file.user.last_name}`}</div>
              </div>
            );
          })}
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => {
              setOpen(false);
              closeCheckFile();
            }}>
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full">
                    <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                          <button
                            type="button"
                            className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                            <span
                              className="absolute -inset-2.5"
                              onClick={() => {
                                setSelected(["commit message </> version"]);
                              }}
                            />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </Transition.Child>
                      <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                        <div className="px-4 sm:px-6 top-side-details">
                          Details
                        </div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                          <div className="file-details-title">
                            <div className="square"></div>
                            <div>
                              {openedfileDetails.name.charAt(0).toUpperCase() +
                                openedfileDetails.name.slice(1)}
                            </div>
                          </div>
                          <div className="download-dxf">
                            <div>
                              <div className="file-dxf">
                                <img
                                  src="dxf-icon.png"
                                  alt=""
                                  className="dxf-icon"
                                />
                                <div className="file-dxf-details">
                                  <div className="name-file-dxf">
                                    {openedfileDetails.name}
                                  </div>
                                  <div className="type-file-dxf">DXF File</div>
                                </div>
                              </div>
                            </div>
                            <div className="download-icon">
                              <svg
                                width="30px"
                                height="30px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <g id="Interface / Download">
                                  <path
                                    id="Vector"
                                    d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                                    stroke="#000000"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </g>
                              </svg>
                            </div>
                          </div>
                          <div className="side-details-file">
                            <div className="property">Property</div>
                            <div className="details-of-file">
                              <div className="file-details-version">
                                <div>Version</div>
                                <div>{openedfileDetails.version}</div>
                              </div>
                            </div>
                            <div className="details-of-file">
                              <div className="file-details-version">
                                <div>Created by</div>
                                {openedfileDetails.user && (
                                  <div className="file-details-user">{`${openedfileDetails.user.first_name} ${openedfileDetails.user.last_name}`}</div>
                                )}
                              </div>
                            </div>
                            <div className="details-of-file">
                              <div className="file-details-version">
                                <div>Created Date</div>
                                {openedfileDetails.user && (
                                  <div className="file-details-user">{`${
                                    openedfileDetails.created_at.split("T")[0]
                                  }`}</div>
                                )}
                              </div>
                            </div>
                            <div className="hr-details"></div>
                            <div className="commit-field">
                              <div className="commit-field-title">
                                Local Commit
                              </div>
                              <Input
                                label={"Commit message"}
                                name={"Commit-message"}
                                type={"text"}
                                onchange={handleCommitMessage}
                              />
                              <div className="number-of-letter">
                                {commitMessage.length}/50
                              </div>
                              <div className="input-upload-file">
                                <label
                                  className="btn updated-file"
                                  htmlFor="updated-file">
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
                                          troke-width="2"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          fill="fffff"
                                        />
                                      </g>
                                    </svg>
                                  </div>
                                  File
                                </label>
                                <input
                                  type="file"
                                  s
                                  name="update file"
                                  id="updated-file"
                                  onChange={(e) => {
                                    setUpdate(e.target.files[0]);
                                    handleCompare(
                                      e,
                                      openedfileDetails.path_dxf
                                    );
                                    handleUpload(e);
                                  }}
                                  className="none"
                                />
                                <div
                                  className={` btn-check ${
                                    compareSuccess ? "btn" : "on-procress"
                                  }`}
                                  onClick={() => {
                                    displayConflict(CompareResult);
                                    closeCheckFile();
                                    openModal();
                                  }}>
                                  Check
                                </div>
                              </div>
                              <div className="check-commit">
                                <button
                                  className={` btn-commit ${
                                    compareSuccess ? "btn" : "on-procress"
                                  }`}
                                  onClick={() =>
                                    submitCommit(
                                      openedfileDetails.path_dxf,
                                      openedfileDetails.version,
                                      openedfileDetails.id
                                    )
                                  }>
                                  Commit
                                </button>
                                <button
                                  className="btn btn-commit"
                                  onClick={handleLocalPush}>
                                  Push
                                </button>
                              </div>
                              <div className="hr-details"></div>
                            </div>
                          </div>
                          <div className="show-file-details">FileDetails</div>
                          <div className="commit-tracker">
                            <Listbox value={selected} onChange={setSelected}>
                              {({ open }) => (
                                <>
                                  <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                                    Commit History
                                  </Listbox.Label>
                                  <div className="relative mt-2">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                      <span className="flex items-center">
                                        <span className="ml-3 block truncate">
                                          {selected}
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
                                        {allCommit.map((commit) => (
                                          <Listbox.Option
                                            key={commit.id}
                                            className={({ active }) =>
                                              classNames(
                                                active
                                                  ? "bg-indigo-600 text-white"
                                                  : "text-gray-900",
                                                "relative cursor-default select-none py-2 pl-3 pr-9"
                                              )
                                            }
                                            value={
                                              commit.message +
                                              " </> " +
                                              commit.version
                                            }>
                                            {({ selected, active }) => (
                                              <>
                                                <div className="flex items-center">
                                                  <span
                                                    className={classNames(
                                                      selected
                                                        ? "font-semibold"
                                                        : "font-normal",
                                                      "ml-3 block truncate"
                                                    )}>
                                                    {commit.message +
                                                      " </> " +
                                                      commit.version}
                                                  </span>
                                                </div>

                                                {setSeletedCommitSVG(
                                                  commit.compare_path_svg
                                                )}
                                                {selected ? (
                                                  <span
                                                    className={classNames(
                                                      active
                                                        ? "text-white"
                                                        : "text-indigo-600",
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
                          </div>
                          <button
                            className="btn"
                            onClick={() => {
                              setSelected(["commit message </> version"]);
                              openCommitModal();
                            }}>
                            Check Commit
                          </button>
                          {branche.team_id == null && (
                            <>
                              <Input
                                label={"Commit message"}
                                name={"Commit-message"}
                                type={"text"}
                                onchange={handleMainCommitMessage}
                              />
                              <button
                                className="btn"
                                onClick={() => {
                                  handleCommitMain(
                                    conflictSvg,
                                    openedfileDetails.path_svg,
                                    mainDxfPath,
                                    openedfileDetails.path_dxf,
                                    mainDxfVersion,
                                    0,
                                    openedfileDetails.id,
                                    openedfileDetails.name
                                  );
                                }}>
                                commit to main
                              </button>
                              <div
                                className="check-conflict btn"
                                onClick={() => {
                                  CompareWithMain(
                                    mainDxfPath,
                                    openedfileDetails.path_dxf
                                  );
                                  openModal();
                                }}>
                                check-conflict
                              </div>
                            </>
                          )}

                          <button className="btn delete">delete file</button>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        className="check-conflict-model">
        <div className="btns close">
          <button className="btn" onClick={closeModal}>
            X
          </button>
        </div>
        <img
          src={conflictSvg}
          style={{ height: 700 }}
          alt="SVG"
          srcset=""
          className="svg-image"
        />
      </Modal>
      <Modal
        isOpen={CheckCommitIsOpen}
        onRequestClose={closeCheckCommit}
        ariaHideApp={false}
        className="check-conflict-model zindex">
        <div className="btns close">
          <button className="btn" onClick={closeCheckCommit}>
            X
          </button>
        </div>
        <img
          src={seletedCommitSVG}
          style={{ height: 700 }}
          alt="SVG"
          srcset=""
          className="svg-image"
        />
      </Modal>
      <Modal
        isOpen={CheckFileIsOpen}
        onRequestClose={closeCheckFile}
        ariaHideApp={false}
        className="check-conflict-model">
        {/* <div className="btns close">
          <button className="btn" onClick={closeCheckFile}>
            X
          </button>
        </div> */}
        <img
          src={seletedFile}
          style={{ height: 700 }}
          alt="SVG"
          srcset=""
          className="svg-image"
        />
      </Modal>
    </>
  );
}

export default FilesContainer;
