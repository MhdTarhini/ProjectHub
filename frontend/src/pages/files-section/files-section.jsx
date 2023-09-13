import React, { useEffect, useState } from "react";
import { channels } from "../../shared/constants";

function FilesSection() {
  const [file, setfile] = useState([]);
  const [update, setUpdate] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [compareSuccess, setCompareSuccess] = useState(false);
  const [CompareResult, setCompareResult] = useState("");
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

  useEffect(() => {
    window.electron.on(channels.Extract_Data_IsDone, (data) => {
      setUploadSuccess(true);
      console.log("done");
    });
    window.electron.on(channels.Compare_Data_IsDone, (data) => {
      setCompareSuccess(true);
      setCompareResult(data);
    });
  }, []);

  return (
    <div>
      <button onClick={handleUpload}> upload file</button>
      <input
        type="file"
        name="file"
        onChange={(e) => {
          setfile(e.target.files[0]);
        }}
      />
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
