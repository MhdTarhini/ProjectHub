import React, { useEffect, useState } from "react";
import { channels } from "../../shared/constants";
import "./files-section.css";
import Modal from "react-modal";
import Input from "../../component/input/input";

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
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleUpload() {
    const file_uploaded = file;
    if (file_uploaded) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dxf_file = event.target.result;
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
    console.log(e.target.value);
  }

  useEffect(() => {
    window.electron.on(channels.Extract_Data_IsDone, (data) => {
      setUploadSuccess(true);
      console.log("done");
    });
    // window.electron.on(channels.Compare_Data_IsDone, (data) => {
    //   setCompareSuccess(true);
    //   setCompareResult(data);
    // });
    window.electron.on(channels.Covert_Data_to_svg_IsDone, (data) => {
      setSvgSuccess(true);
      setGetSvg(data);
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
          <form className="upload-file-form">
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
                }}
                className="none"
              />
              <div>{file.name}</div>
            </div>
            <div className="btns">
              <button className="btn">submit</button>
              <button className="btn" onClick={closeModal}>
                close
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default FilesSection;
