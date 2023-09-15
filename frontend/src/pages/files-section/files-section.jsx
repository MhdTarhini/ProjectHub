import React, { useEffect, useState } from "react";
import { channels } from "../../shared/constants";
import "./files-section.css";

function FilesSection() {
  const [file, setfile] = useState([]);
  const [update, setUpdate] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [compareSuccess, setCompareSuccess] = useState(false);
  const [CompareResult, setCompareResult] = useState("");
  const [FileDetails, setFileDetails] = useState("");
  const [detailsSuccess, setDetailsSuccess] = useState(false);

  function handleUpload() {
    const file_uploaded = file;
    if (file_uploaded) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target.result;
        window.electron.send(channels.Extract_Data, { fileData });
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

  useEffect(() => {
    window.electron.on(channels.Extract_Data_IsDone, (data) => {
      setUploadSuccess(true);
      console.log("done");
    });
    window.electron.on(channels.Compare_Data_IsDone, (data) => {
      setCompareSuccess(true);
      setCompareResult(data);
      // console.log(typeof data);
      console.log(data);
      // console.log(data.removed_objects);
      // const newjson = JSON.parse(data);
      // console.log(newjson);
    });
    window.electron.on(channels.Get_Details_IsDone, (data) => {
      setDetailsSuccess(true);
      setFileDetails(data);
    });
  }, []);

  return (
    <div className="files-section">
      <div className="top-file-section">
        <div className="file-section-title">Files Section</div>
        <label
          className="new-file"
          //  onClick={handleUpload}
          htmlFor="new-file">
          New file
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
  );
}

export default FilesSection;
