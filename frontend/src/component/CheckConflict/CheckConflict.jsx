import React, { useEffect, useState } from "react";
import { channels } from "../../shared/constants";
import base64 from "base-64";
import Modal from "react-modal";
import Loading from "../common/loading";
import axios from "axios";
import Message from "../common/Message/message";
import "./CheckConflict.css";

function CheckConflict({ onData, Pulldata, BranchData, branch }) {
  // handleCompare(e, openedfileDetails.path_dxf);
  const [compareResult, setCompareResult] = useState([]);
  const [seletedFile, setSeletedFile] = useState([]);
  const [compareSuccess, setCompareSuccess] = useState(false);
  const [conflictSVG, setConflitSvg] = useState("");
  const [modalIsOpen, setmodelisOpen] = useState(false);
  const [isAcceptedId, setIsAcceptedId] = useState([]);
  const [isRejectedId, setIsRejectedId] = useState([]);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDoneChecking, setIsDoneChecking] = useState(false);

  function closeModal() {
    setmodelisOpen(false);
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
      setmodelisOpen(true);
    } catch (error) {
      console.error(error);
    }
  }

  function ComparePull(main_file) {
    let local_file_path = "";
    setCompareSuccess(false);
    const main_file_path = main_file.path_dxf;
    BranchData.map((branchFile) => {
      if (branchFile.name === main_file.name) {
        local_file_path = branchFile.path_dxf;
      }
    });

    window.electron.send(channels.Compare_Main_Data, {
      main_file_path,
      local_file_path,
    });
  }

  async function acceptFile() {
    const data = new FormData();
    data.append("branch_id", branch.id);
    data.append("file_name", seletedFile.name);
    data.append("new_dxf_path", seletedFile.path_dxf);
    data.append("new_svg_path", seletedFile.path_svg);
    try {
      const response = await axios(
        "http://127.0.0.1:8000/api/file-section/accepte-file",
        data
      );
      const accepteData = await response.data;
      if (accepteData.status === "success") {
        isAccepted(true);
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    window.electron.on(channels.Compare_Main_Data_IsDone, (data) => {
      const decodedData = base64.decode(data);
      setCompareResult(decodedData);
      displayConflict(decodedData);
    });
    if (Pulldata.length === isAcceptedId.length + isRejectedId.length) {
      setIsDoneChecking(true);
    }
  }, [isAcceptedId, isRejectedId]);

  return (
    <>
      {isAccepted && <Message text={"File Is Accepted"} />}
      {isDoneChecking ? (
        <div className="loading-display">
          <Loading />
          <div>Pull New Files....</div>
          {setTimeout(() => {
            onData();
          }, 3000)}
        </div>
      ) : (
        <div className="card-container">
          {Pulldata.map((file) => {
            if (file.id)
              return (
                <div
                  className={`${
                    isAcceptedId.includes(file.id) && "accpted-card"
                  } ${isRejectedId.includes(file.id) && "rejected-card"} card`}
                  key={file.id}
                  onClick={() => {
                    ComparePull(file);
                    setSeletedFile(file);
                  }}>
                  <img
                    src={file.path_svg}
                    className="file-section-card-img"
                    alt={file.name}
                  />
                  <div className="middle-card">
                    <div className="file-name">{file.name}</div>
                    <div className="card-option">
                      <div className="point"></div>
                      <div className="point"></div>
                      <div className="point"></div>
                    </div>
                  </div>
                </div>
              );
          })}
        </div>
      )}

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
        {conflictSVG ? (
          <>
            <img
              src={conflictSVG}
              style={{ height: 700 }}
              alt="SVG"
              srcSet=""
              className="svg-image"
            />
            {!isAcceptedId.includes(seletedFile.id) &&
            !isRejectedId.includes(seletedFile.id) ? (
              <div className="btns">
                <div
                  className="accept "
                  onClick={() => {
                    acceptFile();
                    setIsAccepted(true);
                    setIsAcceptedId([...isAcceptedId, seletedFile.id]);
                    closeModal();
                  }}>
                  <svg
                    width="40px"
                    height="40px"
                    viewBox="0 0 1024 1024"
                    class="icon"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z"
                      fill="#4CAF50"
                    />
                    <path
                      d="M738.133333 311.466667L448 601.6l-119.466667-119.466667-59.733333 59.733334 179.2 179.2 349.866667-349.866667z"
                      fill="#CCFF90"
                    />
                  </svg>
                </div>
                <div
                  className="reject"
                  onClick={() => {
                    setIsRejectedId([...isRejectedId, seletedFile.id]);
                    closeModal();
                  }}>
                  <svg
                    width="40px"
                    height="40px"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="#ff0000"
                      d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zM288 512a38.4 38.4 0 0 0 38.4 38.4h371.2a38.4 38.4 0 0 0 0-76.8H326.4A38.4 38.4 0 0 0 288 512z"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div> </div>
            )}
          </>
        ) : (
          <Loading />
        )}
      </Modal>
    </>
  );
}

export default CheckConflict;
