import React, { useEffect, useState } from "react";
import Input from "../input/input";
import axios from "axios";
import { channels } from "../../shared/constants";
import Modal from "react-modal";
import base64 from "base-64";
import Message from "../common/Message/message";
import Loading from "../common/loading/loading";

function LocalCommit({
  openedfileDetails,
  closeModal,
  closeCheckFile,
  close,
  donePush,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  axios.defaults.headers.common["Authorization"] = `Bearer ${user.user.token}`;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [isLocalFileLoading, setIsLocalFileLoading] = useState(false);
  const [CheckCommitIsOpen, setCheckCommitIsOpen] = React.useState(false);
  const [errorMain, setMainError] = useState(false);
  const [errorMainMessage, setMainErrorMessage] = useState("");
  const [isPushed, setIsPushed] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const [update, setUpdate] = useState([]);
  const [goCheckConflict, setGoCheckConflict] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [isLocalCommitLoading, setIsLocalCommitLoading] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [CompareResult, setCompareResult] = useState("");
  const [commitInfo, setCommitInfo] = useState([]);
  const [isCommited, setIsCommited] = useState(false);
  const [getSvg, setGetSvg] = useState("");
  const [errorLocal, setLocalError] = useState(false);
  const [errorLocalMessage, setLocalErrorMessage] = useState("");
  const [conflictSvg, setConflitSvg] = useState("");
  const [compareSuccess, setCompareSuccess] = useState(false);
  const [svgSuccess, setSvgSuccess] = useState(false);
  const [branchFiles, setBranchFiles] = useState([]);
  const [open, setOpen] = useState(false);

  function openCommitModal() {
    setCheckCommitIsOpen(true);
  }
  function closeCheckCommit() {
    setCheckCommitIsOpen(false);
    setIsloading(false);
  }

  function openModal() {
    setIsloading(false);
    setIsOpen(true);
    setIsloading(false);
    setIsCommited(false);
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
    data.append("user_id", user.user.id);
    data.append("file_id", file_id);

    try {
      const response = await axios.post(
        "http://34.244.172.132/api/file-section/add_commit",
        data
      );
      const commitInfo = await response.data;
      setCommitInfo(commitInfo.data);
      setIsCommited(true);
      setIsLocalCommitLoading(false);
    } catch (error) {
      setIsLocalCommitLoading(false);
      setLocalError(true);
      setLocalErrorMessage(error.response.data.message);
    }
  }

  function handleCommitMessage(e) {
    setCommitMessage(e.target.value);
    setLocalError(false);
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
  function handleUpload(e) {
    setSvgSuccess(false);
    const file_uploaded = e.target.files[0];
    if (file_uploaded) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dxf_file = event.target.result;
        window.electron.send(channels.Covert_Data_to_svg, { dxf_file });
      };
      reader.readAsDataURL(file_uploaded);
    } else {
      setLocalError(true);
      setLocalErrorMessage("No file uploaded");
    }
  }
  async function displayConflict(svg_data) {
    setGoCheckConflict(false);
    const data = new FormData();
    data.append("svg_data", svg_data);
    try {
      const response = await axios.post(
        "http://34.244.172.132/api/file-section/check_conflict",
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
  async function handleLocalPush() {
    const data = new FormData();
    data.append("commit_id", commitInfo.id);
    try {
      const response = await axios.post(
        "http://34.244.172.132/api/file-section/push_local_commit",
        data
      );
      const IsPushed = await response.data;
      if (IsPushed.status === "success") {
        setIsPushed(true);
        setIsloading(false);
        setIsDone(true);
        donePush();
        setBranchFiles.files?.push(IsPushed.data);
      }
    } catch (error) {
      setLocalError(true);
      setLocalErrorMessage(error.response.data.message);
    }
  }
  function CompareWithMain(main_file_path, local_file_path) {
    setCompareSuccess(false);
    window.electron.send(channels.Compare_Main_Data, {
      main_file_path,
      local_file_path,
    });
  }
  useEffect(() => {
    window.electron.on(channels.Covert_Data_to_svg_IsDone, (data) => {
      const decodedData = base64.decode(data);
      setGetSvg(decodedData);
      setSvgSuccess(true);
      setIsLocalFileLoading(false);
      window.electron.on(channels.Compare_Data_IsDone, (data) => {
        const decodedData = base64.decode(data);
        setCompareResult(decodedData);
        setCompareSuccess(true);
        setIsloading(false);
      });
    });
  }, []);
  return (
    <>
      <div>{isDone && <Message text={"File Is Pushed To Branch"} />}</div>
      <Input
        label={"Commit message"}
        name={"Commit-message"}
        type={"text"}
        onchange={handleCommitMessage}
      />
      <div className="number-of-letter">{commitMessage.length}/50</div>
      <div className="commit-btns-local">
        <div className="input-upload-file">
          <label
            className={`btn updated-file ${
              isLocalFileLoading ? "on-hold" : "n"
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
            {isLocalFileLoading ? <div>On Process</div> : <div>File</div>}
          </label>
          <input
            type="file"
            name="update file"
            id="updated-file"
            onChange={(e) => {
              setIsLocalFileLoading(true);
              setUpdate(e.target.files[0]);
              handleCompare(e, openedfileDetails.path_dxf);
              handleUpload(e);
            }}
            className="none"
          />
          <div
            className={` btn-check ${
              compareSuccess ? "btn color-btn-check" : "on-hold"
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
            className={` btn-commit ${compareSuccess ? "btn" : "on-hold"} ${
              isLocalCommitLoading ? "on-hold" : "n"
            }`}
            onClick={() => {
              setIsLocalCommitLoading(true);
              submitCommit(
                openedfileDetails.path_dxf,
                openedfileDetails.version,
                openedfileDetails.id
              );
            }}>
            {isLocalCommitLoading ? <div>On Process</div> : <div>Commit</div>}
          </button>
          <button
            className={` btn-commit ${
              compareSuccess && isCommited ? "btn btn-push" : "on-hold"
            }`}
            onClick={() => {
              close();
              handleLocalPush();
              setCompareSuccess(false);
              setCommitMessage("");
              closeModal();
            }}>
            Push
          </button>
        </div>
        {errorLocal && <div className="error">{errorLocalMessage}</div>}
        {isCommited && <div className="success">Commit Successfully !</div>}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        className="check-conflict-model"
        style={{ overlay: { background: "rgb(0 0 0 / 30%)" } }}>
        {conflictSvg ? (
          <img
            src={`http://34.244.172.132/storage/${conflictSvg.split("/")[4]}`}
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

export default LocalCommit;
