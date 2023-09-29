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
import Message from "../common/Message/message";
import CheckConflict from "../CheckConflict/CheckConflict";
import LocalCommit from "../LocalCommit/LocalCommit";
import CommitHistory from "../commitsHistory/CommitHistory";
import CommitMain from "../commitMain/CommitMain";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function FilesContainer({
  branche,
  file,
  updateFile,
  pullData,
  openCheck,
  onData,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  axios.defaults.headers.common["Authorization"] = `Bearer ${user.user.token}`;
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
  const [goAI, setGoAI] = useState(false);
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
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorLocal, setLocalError] = useState(false);
  const [errorLocalMessage, setLocalErrorMessage] = useState("");
  const [errorMain, setMainError] = useState(false);
  const [errorMainMessage, setMainErrorMessage] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [isLocalFileLoading, setIsLocalFileLoading] = useState(false);
  const [isLocalCommitLoading, setIsLocalCommitLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [noMainMatch, setNoMainMatch] = useState(false);
  const [isCommited, setIsCommited] = useState(false);
  const [updateFiles, setUpdateFiles] = useState(false);
  const [isDoneCommitMain, setIsDoneCommitMain] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [doneGetFiles, setDoneGetFiles] = useState(false);
  const [isdeleted, setIsdeleted] = useState(false);
  const [isCheckingConlfectFile, SetCheckingConlfectFile] = useState(openCheck);
  const [showImage, setShowImage] = useState(true);
  const [detailsAI, setDetailsAI] = useState("");
  const [getDetails, setGetDetails] = useState(false);
  const [branchFiles, setBranchFiles] = useState([]);
  const [deletedFile, setDeletedFile] = useState([]);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [goCheckConflict, setGoCheckConflict] = useState(false);

  function openModal() {
    setIsloading(false);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setIsloading(false);
  }
  function openCommitModal() {
    setCheckCommitIsOpen(true);
    setIsloading(false);
    setIsCommited(false);
  }

  function closeCheckCommit() {
    setCheckCommitIsOpen(false);
    setIsloading(false);
  }
  function openFileModal() {
    setCheckFileIsOpen(true);
    setIsloading(false);
  }

  function closeCheckFile() {
    setCheckFileIsOpen(false);
    setIsloading(false);
  }
  function closeDeleteModal() {
    setModalDeleteOpen(false);
  }

  async function downloadFile(file_name) {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/file-section/download_file/${file_name}`
      );
      const content = response;
    } catch (error) {
      console.error(error);
    }
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
    data.append("file_id", noMainMatch ? null : mainDxfId);
    data.append("new_path_svg", new_path_svg);
    data.append("new_path_dxf", new_path_dxf);
    data.append("old_path_dxf", old_path_dxf);
    data.append("compare_path_svg", compare_Svg);
    data.append("version", version);
    data.append("status", status);
    data.append("team_id", user.team_active);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/file-section/main_commit`,
        data
      );
      const commitData = await response.data;
      setIsloading(false);
      setMainError(false);
      setIsDoneCommitMain(true);
    } catch (error) {
      setMainError(true);
      setMainErrorMessage(error.response.data.message);
    }
  }

  async function getAIResponse() {
    // try {
    //   const response = await axios.post(
    //     "http://127.0.0.1:8000/api/file-section/open_ai",
    //     {
    //       data: FileDetails,
    //     }
    //   );
    //   const reponseai = await response.data;
    //   if (reponseai.status === "success") {
    //     setDetailsAI(reponseai.data);
    //     setFileDetails("");
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  }

  async function getfileCommit(file_id) {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/file-section/get_commits/${file_id}`
      );
      const commitData = await response.data;
      setAllCommit(commitData.data);
    } catch (error) {
      setError(true);
      setErrorMessage(error.response.data.message);
    }
  }

  async function handleGetFiles() {
    const data = new FormData();
    data.append("branche_id", branche.id);
    data.append("project_id", user.active);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/get_files",
        data
      );
      const files = await response.data;
      setGetFiles(files.data);
      setDoneGetFiles(true);
    } catch (error) {
      setError(true);
      setErrorMessage(error.response.data.message);
    }
  }
  async function getMainFilePath(file_name) {
    const data = new FormData();
    data.append("project_id", user.active);
    data.append("team_id", user.team_active);
    data.append("file_name", file_name);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/file-section/get_dxf_path`,
        data
      );
      const dxf_path = await response.data;
      if (response.data.status === "success") {
        setMainDxfPath(dxf_path.dxf_path);
        setMainDxfVersion(dxf_path.version);
        setMainDxfId(dxf_path.id);
      } else {
        setNoMainMatch(true);
      }
    } catch (error) {
      setMainError(true);
      setMainErrorMessage(error.response.data.message);
    }
  }

  // function handleCommitMessage(e) {
  //   setCommitMessage(e.target.value);
  //   setLocalError(false);
  // }
  function handleMainCommitMessage(e) {
    setMainCommitMessage(e.target.value);
  }

  function handleCompare(e, old_version_path) {
    setCompareSuccess(false);
    const file_uploaded = e.target.files[0];
    if (file_uploaded) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const new_version_data = event.target.result;
        window.electron.send(channels.Compare_Data, {
          new_version_data,
          old_version_path,
        });
      };
      reader.readAsDataURL(file_uploaded);
    } else {
      console.log("No file uploaded");
    }
  }

  function CompareWithMain(main_file_path, local_file_path) {
    setCompareSuccess(false);
    window.electron.send(channels.Compare_Main_Data, {
      main_file_path,
      local_file_path,
    });
  }

  function getDxfData(file_dxf) {
    setDetailsSuccess(false);
    window.electron.send(channels.Get_Details, { file_dxf });
  }

  // async function submitCommit(old_path_dxf, file_version, file_id) {
  //   const data = new FormData();
  //   data.append("message", commitMessage);
  //   data.append("compare_path_svg", CompareResult);
  //   data.append("new_path_svg", getSvg);
  //   data.append("old_path_dxf", old_path_dxf);
  //   data.append("new_path_dxf", update);
  //   data.append("version", file_version);
  //   data.append("status", 1);
  //   data.append("user_id", user.user.id);
  //   data.append("file_id", file_id);
  //   try {
  //     const response = await axios.post(
  //       "http://127.0.0.1:8000/api/file-section/add_commit",
  //       data
  //     );
  //     const commitInfo = await response.data;
  //     setCommitInfo(commitInfo.data);
  //     setIsCommited(true);
  //     setIsLocalCommitLoading(false);
  //   } catch (error) {
  //     setIsLocalCommitLoading(false);
  //     setLocalError(true);
  //     setLocalErrorMessage(error.response.data.message);
  //   }
  // }
  async function displayConflict(svg_data) {
    setGoCheckConflict(false);
    const data = new FormData();
    data.append("svg_data", svg_data);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/check_conflict",
        data
      );
      const conflictSVG = await response.data;
      setConflitSvg(conflictSVG.data);
      setIsloading(false);
    } catch (error) {
      setMainError(true);
      setMainErrorMessage(error.response.data.message);
    }
  }
  // function handleUpload(e) {
  //   setSvgSuccess(false);
  //   const file_uploaded = e.target.files[0];
  //   if (file_uploaded) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const dxf_file = event.target.result;
  //       window.electron.send(channels.Covert_Data_to_svg, { dxf_file });
  //     };
  //     reader.readAsDataURL(file_uploaded);
  //   } else {
  //     setLocalError(true);
  //     setLocalErrorMessage("No file uploaded");
  //   }
  // }
  // async function handleLocalPush() {
  //   const data = new FormData();
  //   data.append("commit_id", commitInfo.id);
  //   try {
  //     const response = await axios.post(
  //       "http://127.0.0.1:8000/api/file-section/push_local_commit",
  //       data
  //     );
  //     const IsPushed = await response.data;
  //     if (IsPushed.status === "success") {
  //       setIsPushed(true);
  //       setIsloading(false);
  //       setIsDone(true);
  //       setBranchFiles.files?.push(IsPushed.data);
  //     }
  //   } catch (error) {
  //     setLocalError(true);
  //     setLocalErrorMessage(error.response.data.message);
  //   }
  // }
  const handleDataFromChild = () => {
    SetCheckingConlfectFile(false);
    onData();
  };

  useEffect(() => {
    getFiles.map((branch) => {
      if (branch.id === branche.id) {
        setBranchFiles(branch);
      }
    });
  }, [branche]);

  useEffect(() => {
    branchFiles.files?.push(updateFile);
  }, [updateFile]);

  useEffect(() => {
    handleGetFiles();
  }, [pullData]);

  useEffect(() => {
    window.electron.on(channels.Compare_Data_IsDone, (data) => {
      const decodedData = base64.decode(data);
      setCompareResult(decodedData);
      setCompareSuccess(true);
      setIsloading(false);
    });
    window.electron.on(channels.Compare_Main_Data_IsDone, (data) => {
      const decodedData = base64.decode(data);
      setMainCompareResult(decodedData);
      displayConflict(decodedData);
      setMainCompareSuccess(true);
      setGoCheckConflict(true);
      setIsloading(false);
    });
    window.electron.on(channels.Get_Details_IsDone, (data) => {
      setFileDetails(data);
      setDetailsSuccess(true);
      setIsloading(false);
      getAIResponse();
    });
    window.electron.on(channels.Covert_Data_to_svg_IsDone, (data) => {
      const decodedData = base64.decode(data);
      setGetSvg(decodedData);
      setSvgSuccess(true);
      setIsLocalFileLoading(false);
    });
    if (user.team_active == 0) {
      setIsManager(true);
    }
  }, []);

  async function deletefile(file_id) {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/file-section/delete_file/${file_id}`
      );
      const deltedfile = await response.data;
      if (deltedfile.status === "success") {
        setIsdeleted(true);
        setDeletedFile(deltedfile.data);
        branchFiles = branchFiles.filter(
          (file) => file.id !== deletedFile.data.id
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    setTimeout(() => {
      setShowImage(false);
    }, 2000);
  }, []);

  function handleData() {
    closeModal();
    closeCheckFile();
  }
  function close() {
    setOpen(false);
    closeCheckFile();
  }
  function closeCheckFileModel() {
    closeCheckFile();
  }

  return (
    <>
      {openCheck ? (
        <CheckConflict
          onData={handleDataFromChild}
          Pulldata={pullData}
          BranchData={getFiles}
          branch={branche}
        />
      ) : (
        <div>
          {branche.name === null ? (
            <div>
              <div className="Files-empty">
                <div className="empty-title">Collaborate and Share</div>
                <div className="empty-text">
                  Looks like there are no Branches or Files yet. Upload your
                  Work and share it with other.
                </div>
                <button className="btn empty-button">Upload New Files</button>
              </div>
            </div>
          ) : (
            <div className="files-controller">
              {isDone && <Message text={"File Is Pushed To Branch"} />}

              {isDoneCommitMain && (
                <Message text={"File Is Commited To Main Branch"} />
              )}
              {isdeleted && <Message text={"delete successful"} />}
              {branche.name === "main" ? (
                doneGetFiles ? (
                  <div className="branches-in-main">
                    {getFiles?.map((branch) => {
                      if (branch.name !== "main") {
                        if (branch.team !== null) {
                          return (
                            <div className="teams-branches">
                              <div className="team-branch-main">
                                {branch?.name}
                              </div>
                              <div className="files-card">
                                {branch.files.length > 0 ? (
                                  branch.files?.map((file) => {
                                    return (
                                      <div
                                        className="card"
                                        key={file.id}
                                        onClick={() => {
                                          setFileDetails("");
                                          setOpenedFileDetails(file);
                                          setSeletedFile(file.path_svg);
                                          openFileModal();
                                          getDxfData(file.path_dxf);
                                          getfileCommit(file.id);
                                          getMainFilePath(file.name);
                                          setIsDoneCommitMain(false);
                                        }}>
                                        {showImage ? (
                                          <img
                                            src="https://forums.synfig.org/uploads/default/original/2X/3/320a629e5c20a8f67d6378c5273cda8a9e2ff0bc.gif"
                                            alt=""
                                            srcset=""
                                            className="image-loading-card"
                                          />
                                        ) : (
                                          <img
                                            src={file.path_svg}
                                            className="file-section-card-img"
                                            alt={file.name}
                                          />
                                        )}

                                        <div className="file-name">
                                          {file.name}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div>
                                    <div className="issue-post-empty">
                                      <div className="empty-title">
                                        No files
                                      </div>
                                      <div className="empty-text">
                                        Alwats keep your branches organized and
                                        usefull.
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                      }
                    })}
                  </div>
                ) : (
                  <img
                    src="https://forums.synfig.org/uploads/default/original/2X/3/320a629e5c20a8f67d6378c5273cda8a9e2ff0bc.gif"
                    alt=""
                    srcset=""
                  />
                )
              ) : (
                <div className="card-container">
                  {branchFiles?.files?.map((file) => {
                    return (
                      <div
                        className="card"
                        key={file.id}
                        onClick={() => {
                          setOpenedFileDetails(file);
                          setSeletedFile(file.path_svg);
                          openFileModal();
                          setOpen(true);
                          // setGetDetails(true);
                          getDxfData(file.path_dxf);
                          getfileCommit(file.id);
                          getMainFilePath(file.name);
                          setIsDoneCommitMain(false);
                        }}>
                        <img
                          src={file.path_svg}
                          className="file-section-card-img"
                          alt={file.name}
                        />
                        <div className="middle-card">
                          <div className="file-name">{file.name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <Transition.Root show={open} as={Fragment}>
                <Dialog
                  as="div"
                  className="relative z-10"
                  onClose={() => {
                    setOpen(false);
                    closeCheckFile();
                    setUpdate([]);
                    setCompareResult([]);
                    closeCheckCommit();
                    closeModal();
                    setNoMainMatch(false);
                    setIsCommited(false);
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
                                      setSelected([
                                        "commit message </> version",
                                      ]);
                                    }}
                                  />
                                  <span className="sr-only">Close panel</span>
                                  <XMarkIcon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                  />
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
                                  <div className="file-name-details">
                                    <div className="file-name-top">
                                      {openedfileDetails.name}
                                    </div>
                                  </div>
                                </div>
                                <div className="download-dxf">
                                  <div>
                                    <div className="file-dxf">
                                      <img
                                        src="dxf-icon.png"
                                        alt="dxf icon"
                                        className="dxf-icon"
                                      />
                                      <div className="file-dxf-details">
                                        <div className="name-file-dxf">
                                          {openedfileDetails.name}
                                        </div>
                                        <div className="type-file-dxf">
                                          DXF File
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="download-icon">
                                    <div className="share-button">
                                      <svg
                                        width="30px"
                                        height="30px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z"
                                          fill="#000000"
                                        />
                                      </svg>
                                    </div>
                                    <div
                                      className="view-svg"
                                      onClick={openFileModal}>
                                      <svg
                                        width="30px"
                                        height="30px"
                                        viewBox="0 -4 20 20"
                                        version="1.1"
                                        className="view_svg">
                                        <defs></defs>
                                        <g
                                          id="Page-1"
                                          stroke="none"
                                          stroke-width="1"
                                          fill="none"
                                          fill-rule="evenodd">
                                          <g
                                            id="Dribbble-Light-Preview"
                                            transform="translate(-260.000000, -4563.000000)"
                                            fill="#000000">
                                            <g
                                              id="icons"
                                              transform="translate(56.000000, 160.000000)">
                                              <path
                                                d="M216,4409.00052 C216,4410.14768 215.105,4411.07682 214,4411.07682 C212.895,4411.07682 212,4410.14768 212,4409.00052 C212,4407.85336 212.895,4406.92421 214,4406.92421 C215.105,4406.92421 216,4407.85336 216,4409.00052 M214,4412.9237 C211.011,4412.9237 208.195,4411.44744 206.399,4409.00052 C208.195,4406.55359 211.011,4405.0763 214,4405.0763 C216.989,4405.0763 219.805,4406.55359 221.601,4409.00052 C219.805,4411.44744 216.989,4412.9237 214,4412.9237 M214,4403 C209.724,4403 205.999,4405.41682 204,4409.00052 C205.999,4412.58422 209.724,4415 214,4415 C218.276,4415 222.001,4412.58422 224,4409.00052 C222.001,4405.41682 218.276,4403 214,4403"
                                                id="view_simple-[#815]"></path>
                                            </g>
                                          </g>
                                        </g>
                                      </svg>
                                    </div>
                                    <div className="download-dxf-file">
                                      <svg
                                        width="30px"
                                        height="30px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="download-dxf-file">
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
                                          openedfileDetails.created_at.split(
                                            "T"
                                          )[0]
                                        }`}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="hr-details"></div>
                                  <div className="show-file-details">
                                    {detailsAI}
                                  </div>
                                  <div className="hr-details"></div>
                                  {!isManager && (
                                    <div className="commit-field">
                                      <div className="commit-field-title">
                                        Local Commit
                                      </div>
                                      <LocalCommit
                                        openedfileDetails={openedfileDetails}
                                        closeCheckFile={closeCheckFile}
                                        closeModal={closeModal}
                                        close={close}
                                      />
                                      {/* <Input
                                        label={"Commit message"}
                                        name={"Commit-message"}
                                        type={"text"}
                                        onchange={handleCommitMessage}
                                      /> */}
                                      {/* <div className="number-of-letter">
                                        {commitMessage.length}/50
                                      </div> */}

                                      {/* <div className="input-upload-file">
                                        <label
                                          className={`btn updated-file ${
                                            isLocalFileLoading
                                              ? "loading-green"
                                              : "n"
                                          }`}
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
                                          {isLocalFileLoading ? (
                                            <Loading />
                                          ) : (
                                            <div>File</div>
                                          )}
                                        </label>
                                        <input
                                          type="file"
                                          name="update file"
                                          id="updated-file"
                                          onChange={(e) => {
                                            setIsLocalFileLoading(true);
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
                                            compareSuccess
                                              ? "btn color-btn-check"
                                              : "on-procress"
                                          }`}
                                          onClick={() => {
                                            setGoCheckConflict(true);
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
                                            compareSuccess
                                              ? "btn"
                                              : "on-procress"
                                          } ${
                                            isLocalCommitLoading
                                              ? "loading-green"
                                              : "n"
                                          }`}
                                          onClick={() => {
                                            setIsLocalCommitLoading(true);
                                            submitCommit(
                                              openedfileDetails.path_dxf,
                                              openedfileDetails.version,
                                              openedfileDetails.id
                                            );
                                          }}>
                                          {isLocalCommitLoading ? (
                                            <Loading />
                                          ) : (
                                            <div>Commit</div>
                                          )}
                                        </button>
                                        <button
                                          className={` btn-commit ${
                                            compareSuccess && isCommited
                                              ? "btn"
                                              : "on-procress"
                                          }`}
                                          onClick={() => {
                                            setOpen(false);
                                            handleLocalPush();
                                            setCompareSuccess(false);
                                            setCommitMessage("");
                                            closeModal();
                                          }}>
                                          Push
                                        </button>
                                      </div>
                                      {errorLocal && (
                                        <div className="error">
                                          {errorLocalMessage}
                                        </div>
                                      )}
                                      {isCommited && (
                                        <div className="success">
                                          Commit Successfully !
                                        </div>
                                      )} */}
                                      <div className="hr-details"></div>
                                    </div>
                                  )}
                                </div>

                                <div className="commit-tracker">
                                  <CommitHistory allCommit={allCommit} />

                                  {/* <Listbox
                                    value={selected}
                                    onChange={setSelected}>
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
                                                    commit.message + " </> "
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
                                                            " </> "}
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
                                  className="btn btn-commit-check"
                                  onClick={() => {
                                    setSelected(["commit message </> version"]);
                                    closeCheckFile();
                                    openCommitModal();
                                  }}>
                                  Check Commit
                                </button> */}
                                </div>
                                <div className="hr-details"></div>
                                {!isManager && branche.team_id == null && (
                                  <>
                                    <div className="commit-field-title">
                                      Main commit
                                    </div>
                                    <CommitMain
                                      noMainMatch={noMainMatch}
                                      openedfileDetails={openedfileDetails}
                                      mainDxfPath={mainDxfPath}
                                      mainDxfVersion={mainDxfVersion}
                                      close={close}
                                      mainDxfId={mainDxfId}
                                      closeCheckFile={closeCheckFile}
                                    />
                                    {/* <Input
                                      label={"Commit message"}
                                      name={"Commit-message"}
                                      type={"text"}
                                      onchange={handleMainCommitMessage}
                                    />
                                    <div className="btn-main-commit">
                                      <button
                                        className={`commit-main ${
                                          mainCompareSuccess || noMainMatch
                                            ? "btn"
                                            : "on-procress"
                                        }`}
                                        onClick={() => {
                                          if (noMainMatch) {
                                            handleCommitMain(
                                              null,
                                              openedfileDetails.path_svg,
                                              null,
                                              openedfileDetails.path_dxf,
                                              "-1",
                                              0
                                            );
                                          } else {
                                            handleCommitMain(
                                              mainCompareResult,
                                              openedfileDetails.path_svg,
                                              mainDxfPath,
                                              openedfileDetails.path_dxf,
                                              mainDxfVersion,
                                              0
                                            );
                                          }
                                          setOpen(false);
                                          closeCheckFile();
                                        }}>
                                        Commit To Main
                                      </button>
                                      <div
                                        className={`check-main ${
                                          noMainMatch ? "on-procress" : "btn"
                                        }`}
                                        onClick={() => {
                                          CompareWithMain(
                                            mainDxfPath,
                                            openedfileDetails.path_dxf
                                          );
                                          closeCheckFile();
                                          openModal();
                                        }}>
                                        Check
                                      </div>
                                    </div>
                                    {errorMain && (
                                      <div className="error">
                                        {errorMainMessage}
                                      </div>
                                    )} */}
                                  </>
                                )}
                              </div>
                              <button
                                className="btn delete btn-delete-file"
                                onClick={() => {
                                  setModalDeleteOpen(true);
                                  deletefile(openedfileDetails.id);
                                }}>
                                delete file
                              </button>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </div>
                </Dialog>
              </Transition.Root>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        className="check-conflict-model">
        {/* <div className="btns close">
          <button className="btn" onClick={closeModal}>
            X
          </button>
        </div> */}
        {conflictSvg ? (
          <img
            src={conflictSvg}
            style={{ height: 700 }}
            alt="SVG"
            srcSet=""
            className="svg-image"
          />
        ) : (
          <Loading />
        )}
      </Modal>
      {/* <Modal
        isOpen={CheckCommitIsOpen}
        onRequestClose={closeCheckCommit}
        ariaHideApp={false}
        className="check-conflict-model zindex">
        {seletedCommitSVG ? (
          <img
            src={seletedCommitSVG}
            style={{ height: 700 }}
            alt="SVG"
            srcSet=""
            className="svg-image"
          />
        ) : (
          <Loading />
        )}
      </Modal> */}
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
      <Modal
        isOpen={modalDeleteOpen}
        onRequestClose={closeDeleteModal}
        ariaHideApp={false}
        className="new-file-model branche-model"
        style={{ overlay: { background: "rgb(0 0 0 / 15%)" } }}>
        <h2 className="model-title">Add New Branche</h2>
        <div className="btns-new-file">
          <button className="btn close-btn" onClick={closeDeleteModal}>
            Cancel
          </button>
          <button
            className="btn"
            onClick={() => {
              deletefile(openedfileDetails.id);
              setModalDeleteOpen(false);
              setOpen(false);
              closeCheckFile();
            }}>
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}

export default FilesContainer;
