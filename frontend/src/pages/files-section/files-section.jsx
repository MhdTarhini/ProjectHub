import React, { useEffect, useState } from "react";
import { channels } from "../../shared/constants";
import "./files-section.css";
import Modal from "react-modal";
import Input from "../../component/input/input";
import axios from "axios";

function FilesSection() {
  const [file, setfile] = useState([]);
  const [update, setUpdate] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [compareSuccess, setCompareSuccess] = useState(false);
  const [CompareResult, setCompareResult] = useState("");
  const [FileDetails, setFileDetails] = useState("");
  const [detailsSuccess, setDetailsSuccess] = useState(false);
  const [getSvg, setGetSvg] = useState("");
  const [SvgSuccess, setSvgSuccess] = useState(false);
  const [dxfFile, setDxfFile] = useState(null);
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
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
  function handleDetails() {
    const file_update = update;
    if (file_update) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const details_for_data = event.target.result;
        window.electron.send(channels.Get_Details, { details_for_data });
      };
      reader.readAsDataURL(file_update);
    } else {
      console.log("No file uploaded");
    }
  }

  function handleFileName(e) {
    setFileName(e.target.value);
  }
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2d1ZXN0L2xvZ2luIiwiaWF0IjoxNjk0ODUzNTk3LCJleHAiOjE2OTQ4NTcxOTcsIm5iZiI6MTY5NDg1MzU5NywianRpIjoibVd3aHZWQkN5TVFIVHVGTCIsInN1YiI6IjMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.HtDKTT5xNIw_1CbtZ_4jkLFJUv2pNeMn7OspKQNzN1g`;
  async function handleSubmitUpload() {
    const data = new FormData();
    data.append("name", fileName);
    data.append("path_svg", getSvg);
    data.append("path_dxf", file);
    data.append("version", 1);
    data.append("project_id", 1);
    data.append("user_id", 3);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/upload_file",
        data
      );
    } catch (error) {
      console.error(error);
    }
  }

  console.log(getSvg);
  let svg = "";
  let accumulatedData = [];
  let isDuplicate = false;

  useEffect(() => {
    window.electron.on(channels.Extract_Data_IsDone, (data) => {
      setUploadSuccess(true);
      console.log("done");
    });
    window.electron.on(channels.Compare_Data_IsDone, (data) => {
      setCompareSuccess(true);
      setCompareResult(data);
    });
    window.electron.on(channels.Covert_Data_to_svg_IsDone, (data) => {
      setSvgSuccess(true);

      const cleanMessage = data.replace(/^\d*files-section\.jsx:\d+\s/, "");
      if (!isDuplicate) {
        accumulatedData.push(cleanMessage);
        if (cleanMessage.includes(">")) {
          accumulatedData.push("\n");
        }
      }

      isDuplicate = !isDuplicate;

      if (data.includes("</svg>")) {
        const fullSvgData = accumulatedData.join("");
        setGetSvg(fullSvgData);
      }
    });
    window.electron.on(channels.Get_Details_IsDone, (data) => {
      setDetailsSuccess(true);
      setFileDetails(data);
    });
  }, []);

  return (
    <>
      <div className="files-section">
        <div className="top-file-section">
          <div className="file-section-title">Files Section</div>
          <div onClick={openModal} className="btn">
            New File
          </div>
        </div>
        <div className="hr"></div>
        <div className="branches-filter">
          <div>branches</div>
          <div>Fileter</div>
        </div>
        <div className="hr"></div>
        <div className="file-section-card">
          <div className="card-container">
            <div className="card">
              <img
                src="./hello.svg"
                className="file-section-card-img"
                alt="Description"
              />
              <div className="middle-card">
                <div className="file-name">hello world</div>
                <div className="card-option">
                  <div className="point"></div>
                  <div className="point"></div>
                  <div className="point"></div>
                </div>
              </div>
              <div className="uploaded-by">User name</div>
            </div>
          </div>
        </div>

        <button onClick={handleUpdate}> update file</button>
        <input
          type="file"
          name="update"
          onChange={(e) => {
            setUpdate(e.target.files[0]);
          }}
        />
      </div>
      <div className="model-container">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
          className="new-file-model">
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
                upload
              </label>
              <input
                type="file"
                id="new-file"
                name="new-file"
                onChange={(e) => {
                  setfile(e.target.files[0]);
                  handleUpload(e);
                }}
                className="none"
              />
              <div>{file.name}</div>
            </div>
            <div className="btns">
              <button className="btn" onClick={handleSubmitUpload}>
                submit
              </button>
              <button className="btn" onClick={closeModal}>
                close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default FilesSection;
