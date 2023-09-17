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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function FilesContainer({ branche, file }) {
  const project_id = 1;
  const team_id = 1;
  const [open, setOpen] = useState(false);
  const [getFiles, setGetFiles] = useState([]);
  const [openedfileDetails, setOpenedFileDetails] = useState([]);
  const [openOption, setOpenOption] = useState(false);
  const [update, setUpdate] = useState([]);
  const [compareSuccess, setCompareSuccess] = useState(false);
  const [CompareResult, setCompareResult] = useState("");
  const [mainCompareSuccess, setMainCompareSuccess] = useState(false);
  const [mainCompareResult, setMainCompareResult] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [FileDetails, setFileDetails] = useState("");
  const [detailsSuccess, setDetailsSuccess] = useState(false);
  const [dxfData, setDxfData] = useState("");
  const [conflictSvg, setConflitSvg] = useState("");
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [CheckCommitIsOpen, setCheckCommitIsOpen] = React.useState(false);
  const [selected, setSelected] = useState(["commit message </> version"]);
  const [allCommit, setAllCommit] = useState([]);
  const [seletedCommitSVG, setSeletedCommitSVG] = useState("");
  const [mainDxfPath, setMainDxfPath] = useState("");
  const [getSvg, setGetSvg] = useState("");
  const [svgSuccess, setSvgSuccess] = useState(false);

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
      setMainDxfPath(dxf_path.data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleCommitMessage(e) {
    setCommitMessage(e.target.value);
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

  async function submitCommit(old_path_dxf, file_id) {
    const data = new FormData();
    data.append("message", commitMessage);
    data.append("compare_path_svg", CompareResult);
    data.append("old_path_dxf", old_path_dxf);
    data.append("new_path_dxf", update);
    data.append("version", 1);
    data.append("status", 1);
    data.append("user_id", 3);
    data.append("file_id", file_id);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/add_commit",
        data
      );
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
  useEffect(() => {
    handleGetFiles();
  }, [branche]);

  let accumulatedData = [];
  let accumulatedMainData = [];
  let isDuplicate = false;
  useEffect(() => {
    window.electron.on(channels.Compare_Data_IsDone, (data) => {
      setCompareSuccess(true);
      if (!isDuplicate) {
        accumulatedData.push(data);
        if (data.includes(">")) {
          accumulatedData.push("\n");
        }
      }
      isDuplicate = !isDuplicate;
      if (data.includes("</svg>")) {
        const fullSvgData = accumulatedData.join("");
        setCompareResult(fullSvgData);
      }
    });
    window.electron.on(channels.Compare_Main_Data_IsDone, (data) => {
      setMainCompareSuccess(true);
      accumulatedMainData.push(data);
      if (data.includes("</svg>")) {
        const fullSvgData = accumulatedMainData.join("");
        setMainCompareResult(fullSvgData);
        displayConflict(fullSvgData);
      }
    });
    window.electron.on(channels.Get_Details_IsDone, (data) => {
      setDetailsSuccess(true);
      setFileDetails(data);
    });
    window.electron.on(channels.Covert_Data_to_svg_IsDone, (data) => {
      setSvgSuccess(true);
      if (!isDuplicate) {
        accumulatedData.push(data);
        if (data.includes(">")) {
          accumulatedData.push("\n");
        }
      }

      isDuplicate = !isDuplicate;

      if (data.includes("</svg>")) {
        const fullSvgData = accumulatedData.join("");
        setGetSvg(fullSvgData);
      }
    });
  }, []);
  return (
    <>
      <div className="files-controller">
        <div className="card-container">
          {getFiles.map((file) => {
            return (
              <div className="card" key={file.id}>
                <img
                  src={file.path_svg}
                  className="file-section-card-img"
                  alt={file.name}
                />
                <div className="middle-card">
                  <div className="file-name">{file.name}</div>
                  <div
                    className="card-option"
                    onClick={() => {
                      setOpen(!open);
                      setOpenedFileDetails(file);
                      getDxfData(file.path_dxf);
                      getfileCommit(file.id);
                      getMainFilePath(file.name);
                    }}>
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
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                            className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => setOpen(false)}>
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
                        <div className="px-4 sm:px-6"></div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                          <div className="side-details-file">
                            <div className="file-details-title">
                              {openedfileDetails.name}
                            </div>
                            <div className="file-details-version">
                              version {openedfileDetails.version}
                            </div>
                            {/* <div className="file-details-user">{`${openedfileDetails.user.first_name} ${openedfileDetails.user.last_name}`}</div> */}
                            <div className="hr-details"></div>
                          </div>
                          <div className="commit-field">
                            <Input
                              label={"Commit message"}
                              name={"Commit-message"}
                              type={"text"}
                              onchange={handleCommitMessage}
                            />
                            <div className="input-upload-file">
                              <label className="btn" htmlFor="updated-file">
                                Updated File
                              </label>
                              <input
                                type="file"
                                name="update file"
                                id="updated-file"
                                onChange={(e) => {
                                  setUpdate(e.target.files[0]);
                                  handleCompare(e, openedfileDetails.path_dxf);
                                }}
                                className="none"
                              />
                              <div>{update.name}</div>
                            </div>

                            <div
                              className="check-conflict btn"
                              onClick={() => {
                                displayConflict(CompareResult);
                                openModal();
                              }}>
                              check-conflict
                            </div>

                            <button
                              className="btn"
                              onClick={() =>
                                submitCommit(
                                  openedfileDetails.path_dxf,
                                  openedfileDetails.id
                                )
                              }>
                              Commit update
                            </button>
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
                              setOpen(!open);
                              setSelected(["commit message </> version"]);
                              openCommitModal();
                            }}>
                            Check Commit
                          </button>
                          {branche.team_id == null && (
                            <>
                              <button className="btn">commit to main </button>
                              <div
                                className="check-conflict btn"
                                onClick={() => {
                                  CompareWithMain(
                                    mainDxfPath,
                                    openedfileDetails.path_dxf
                                  );
                                  openModal();
                                  setOpen(!open);
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
        <img src={conflictSvg} alt="SVG" srcset="" />
        <div className="btns">
          <button className="btn" onClick={closeModal}>
            close
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={CheckCommitIsOpen}
        onRequestClose={closeCheckCommit}
        ariaHideApp={false}
        className="check-conflict-model">
        <img src={seletedCommitSVG} alt="SVG" srcset="" />
        <div className="btns">
          <button className="btn" onClick={closeCheckCommit}>
            close
          </button>
        </div>
      </Modal>
    </>
  );
}

export default FilesContainer;
