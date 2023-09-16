import React, { useEffect, useRef, useState } from "react";
import "./FilesContainer.css";
import axios from "axios";
import { channels } from "../../shared/constants";
import Input from "../input/input";
import Modal from "react-modal";
// const fs = require("fs");
// const os = require("os");
// const path = require("path");

function FilesContainer({ branche, file }) {
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

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function handleGetFiles() {
    const data = new FormData();
    data.append("branche_id", 1);
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
  function handleUpdate(e, old_version_path) {
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
    const data = new FormData();
    data.append("message", commitMessage);
    data.append("compare_path_svg", CompareResult);
    data.append("old_path_dxf", old_path_dxf);
    data.append("new_path_dxf", file);
    data.append("version", 1);
    data.append("project_id", 1);
    data.append("user_id", 3);
    data.append("branche_id", 1);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/upload_file",
        data
      );
    } catch (error) {
      console.error(error);
    }
  }
  async function displayConflict(fullSvgData) {
    console.log(fullSvgData);
    const data = new FormData();
    data.append("svg_data", fullSvgData);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/check_conflict",
        data
      );
      const conflictSVG = response.data;
      setConflitSvg(conflictSVG.data);
      console.log(conflictSVG.data);
    } catch (error) {
      console.error(error);
    }
  }
  let accumulatedData = [];
  let isDuplicate = false;
  useEffect(() => {
    handleGetFiles();
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
        displayConflict(fullSvgData);
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
                      setOpenOption(!openOption);
                      setOpenedFileDetails(file);
                      getDxfData(file.path_dxf);
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
        {openOption && (
          <div className="file-details">
            <div onClick={() => setOpenOption(!openOption)}>back</div>
            <div className="side-details-file">
              <div className="file-details-title">{openedfileDetails.name}</div>
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
                    handleUpdate(e, openedfileDetails.path_dxf);
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

              <button className="btn">update file</button>
            </div>
            <div className="show-file-details">{FileDetails}</div>

            <button className="btn delete">delete file</button>
          </div>
        )}
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
