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
const people = [
  {
    id: 1,
    name: "Wade Cooper",
    avatar:
      "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 2,
    name: "Arlene Mccoy",
    avatar:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

function FilesContainer({ branche, file }) {
  const [open, setOpen] = useState(false);
  const [getFiles, setGetFiles] = useState([]);
  const [openedfileDetails, setOpenedFileDetails] = useState([]);
  const [openOption, setOpenOption] = useState(false);
  const [update, setUpdate] = useState([]);
  const [compareSuccess, setCompareSuccess] = useState(false);
  const [CompareResult, setCompareResult] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [FileDetails, setFileDetails] = useState("");
  const [detailsSuccess, setDetailsSuccess] = useState(false);
  const [dxfData, setDxfData] = useState("");
  const [conflictSvg, setConflitSvg] = useState("");
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = useState(people[3]);
  const [allCommit, setAllCommit] = useState(people[3]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
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
    data.append("branche_id", branche);
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

  function handleCommitMessage(e) {
    setCommitMessage(e.target.value);
  }

  function getDxfData(file_dxf) {
    window.electron.send(channels.Get_Details, { file_dxf });
  }
  async function submitCommit(old_path_dxf) {
    console.log(update);
    const data = new FormData();
    data.append("message", commitMessage);
    data.append("compare_path_svg", CompareResult);
    data.append("old_path_dxf", old_path_dxf);
    data.append("new_path_dxf", update);
    data.append("version", 1);
    data.append("status", 1);
    data.append("user_id", 3);
    data.append("file_id", 1);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/add_commit",
        data
      );
    } catch (error) {
      console.error(error);
    }
  }
  async function displayConflict() {
    const data = new FormData();
    data.append("svg_data", CompareResult);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/check_conflict",
        data
      );
      const conflictSVG = response.data;
      setConflitSvg(conflictSVG.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    handleGetFiles();
  }, [branche]);

  let accumulatedData = [];
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
    window.electron.on(channels.Get_Details_IsDone, (data) => {
      setDetailsSuccess(true);
      setFileDetails(data);
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
                            <span className="absolute -inset-2.5" />
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
                            <div className="file-details-user">{`${openedfileDetails.user.first_name} ${openedfileDetails.user.last_name}`}</div>
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
                                displayConflict();
                                openModal();
                              }}>
                              check-conflict
                            </div>

                            <button
                              className="btn"
                              onClick={() =>
                                submitCommit(openedfileDetails.path_dxf)
                              }>
                              update file
                            </button>
                          </div>
                          <div className="show-file-details">FileDetails</div>
                          <div className="commit-tracker">
                            {" "}
                            <Listbox value={selected} onChange={setSelected}>
                              {({ open }) => (
                                <>
                                  <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                                    Assigned to
                                  </Listbox.Label>
                                  <div className="relative mt-2">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                      <span className="flex items-center">
                                        <img
                                          src={selected.avatar}
                                          alt=""
                                          className="h-5 w-5 flex-shrink-0 rounded-full"
                                        />
                                        <span className="ml-3 block truncate">
                                          {selected.name}
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
                                            value={commit.id}>
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
                                                    {commit.message}
                                                  </span>
                                                </div>

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

        {/* {openOption && (
         
        )} */}
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
    </>
  );
}

export default FilesContainer;
