import React, { useEffect, useRef, useState } from "react";
import "./FilesContainer.css";
import axios from "axios";
import { channels } from "../../shared/constants";
import Input from "../input/input";

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
  function handleUpdate() {
    const file_update = update;
    if (file_update) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const new_version_data = event.target.result;
        window.electron.send(channels.Compare_Data, { new_version_data });
      };
      reader.readAsDataURL(file_update);
    } else {
      console.log("No file uploaded");
    }
  }

  function handleCommitMessage(e) {
    setCommitMessage(e.target.value);
  }

  function handleDetails() {
    // const file_details = dxfData;
    // if (file_details) {
    //   const reader = new FileReader();
    //   reader.onload = (event) => {
    //     const details_for_data = event.target.result;
    window.electron.send(channels.Get_Details, { dxfData });
    //   };
    //   reader.readAsDataURL(file_details);
    // } else {
    //   console.log("No file uploaded");
    // }
  }

  async function getDxfData(file_id) {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/file-section/get_dxf_Data/${file_id}`
      );
      const dxf_data = await response.data;
      setDxfData(dxf_data.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    handleGetFiles();
    window.electron.on(channels.Compare_Data_IsDone, (data) => {
      setCompareSuccess(true);
      setCompareResult(data);
    });
    window.electron.on(channels.Extract_Data_IsDone, (data) => {
      setDetailsSuccess(true);
      setFileDetails(data);
    });
  }, []);
  return (
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
                    getDxfData(file.id);
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
              version {openedfileDetails.path_dxf}
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
                }}
                className="none"
              />
              <div>{update.name}</div>
            </div>

            <button onClick={handleUpdate} className="btn">
              {" "}
              update file
            </button>
          </div>
          <div className="show-file-details">{FileDetails}</div>

          <button className="btn delete" onClick={handleDetails}>
            {" "}
            delete file
          </button>
        </div>
      )}
    </div>
  );
}

export default FilesContainer;
