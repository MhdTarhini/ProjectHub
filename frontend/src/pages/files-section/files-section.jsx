import React, { useEffect, useState } from "react";
import { channels } from "../../shared/constants";
import "./files-section.css";
import Modal from "react-modal";
import Input from "../../component/input/input";
import axios from "axios";
import FilesContainer from "../../component/FilesContainer/filesContainer";

function FilesSection() {
  const [file, setfile] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [getSvg, setGetSvg] = useState("");
  const [SvgSuccess, setSvgSuccess] = useState(false);
  const [dxfFile, setDxfFile] = useState(null);
  const [branche, setBranche] = useState("main");
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

  function handleFileName(e) {
    setFileName(e.target.value);
  }
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2d1ZXN0L2xvZ2luIiwiaWF0IjoxNjk0ODg4NTAwLCJleHAiOjE2OTQ4OTIxMDAsIm5iZiI6MTY5NDg4ODUwMCwianRpIjoiNGhSVjhoWlJ2TERscDQ1YyIsInN1YiI6IjMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.2_4JhDeRla_oOlVXizI8a_-g9JDatl8EZ7nkNSeC5Ko`;
  async function handleSubmitUpload() {
    const data = new FormData();
    data.append("name", fileName);
    data.append("path_svg", getSvg);
    data.append("path_dxf", file);
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

  let accumulatedData = [];
  let isDuplicate = false;

  useEffect(() => {
    window.electron.on(channels.Extract_Data_IsDone, (data) => {
      setUploadSuccess(true);
      console.log("done");
    });

    window.electron.on(channels.Covert_Data_to_svg_IsDone, (data) => {
      setSvgSuccess(true);
      if (!isDuplicate) {
        accumulatedData.push(data);
        console.log(data);
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
          <FilesContainer branche={branche} file={file} />
        </div>
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
