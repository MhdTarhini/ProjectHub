import React, { useEffect, useRef, useState } from "react";
import "./FilesContainer.css";
import axios from "axios";

function FilesContainer({ branche }) {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2d1ZXN0L2xvZ2luIiwiaWF0IjoxNjk0ODU4NjQwLCJleHAiOjE2OTQ4NjIyNDAsIm5iZiI6MTY5NDg1ODY0MCwianRpIjoiQnlORHp4aXRGUVhUNGhDUiIsInN1YiI6IjMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.hekIxprVG_3vWuF37ku6hPLAjqABMwkt13fmVMt3EEg`;
  const [getFiles, setGetFiles] = useState([]);

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
  useEffect(() => {
    handleGetFiles();
  }, []);
  return (
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
              <div className="card-option">
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
  );
}

export default FilesContainer;
