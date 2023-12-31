import React, { useEffect, useState } from "react";
import { channels } from "../../shared/constants";
import base64 from "base-64";
import Modal from "react-modal";
import Loading from "../common/loading/loading";
import axios from "axios";
import Message from "../common/Message/message";
import "./CheckConflict.css";

function CheckConflict({ onData, Pulldata, BranchData, branch }) {
  const [seletedFile, setSeletedFile] = useState([]);
  const [conflictSVG, setConflitSvg] = useState("");
  const [modalIsOpen, setmodelisOpen] = useState(false);
  const [isAcceptedId, setIsAcceptedId] = useState([]);
  const [isRejectedId, setIsRejectedId] = useState([]);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDoneChecking, setIsDoneChecking] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [checkConflictdisplay, setCheckConflictdisplay] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const [cache, setCache] = useState({});

  function closeModal() {
    setmodelisOpen(false);
    setConflitSvg("");
  }

  async function displayConflict(svg_data) {
    setShowImage(false);
    if (checkConflictdisplay) {
      setCheckConflictdisplay(false);

      if (cache[svg_data]) {
        setConflitSvg(cache[svg_data]);
        setShowImage(true);
      } else {
        const data = new FormData();
        data.append("svg_data", svg_data);
        try {
          const response = await axios.post(
            "http://34.244.172.132/api/file-section/check_conflict",
            {
              svg_data: svg_data,
            }
          );
          const conflictSVGData = await response.data;
          setCache((prevCache) => ({
            ...prevCache,
            [svg_data]: conflictSVGData.data,
          }));
          setConflitSvg(conflictSVGData.data);
          setShowImage(true);
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
  function ComparePull(main_file) {
    let local_file_path = "";
    let main_file_path = main_file.path_dxf;
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
    data.append("path_dxf", seletedFile.path_dxf);
    data.append("path_svg", seletedFile.path_svg);
    try {
      const response = await axios.post(
        "http://34.244.172.132/api/file-section/accepte_file",
        data
      );
      const accepteData = await response.data;
      if (accepteData.status === "success") {
        setIsAccepted(true);
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    window.electron.on(channels.Compare_Main_Data_IsDone, (data) => {
      const decodedData = base64.decode(data);
      setCheckConflictdisplay(true);
      displayConflict(decodedData);
    });
  }, []);

  useEffect(() => {
    if (Pulldata.length === isAcceptedId.length + isRejectedId.length) {
      setIsDoneChecking(true);
    }
  }, [isRejected, isAccepted]);

  return (
    <>
      {isAccepted && <Message text={"File Is Accepted"} type={"success"} />}
      {isDoneChecking ? (
        <div className="loading-display">
          <Loading />
          <div>Pull New Files....</div>
          {onData()}
        </div>
      ) : (
        <div className="card-container">
          {Pulldata.map((file) => {
            if (file.id)
              return (
                <div
                  className={` card ${
                    isAcceptedId.includes(file.id) && "accpted-card "
                  } ${isRejectedId.includes(file.id) && "rejected-card"}`}
                  key={file.id}
                  onClick={() => {
                    ComparePull(file);
                    setSeletedFile(file);
                    setmodelisOpen(true);
                  }}>
                  {file.path_svg ? (
                    <img
                      src={
                        file.path_svg
                          ? `http://34.244.172.132/storage/${
                              file.path_svg.split("/")[4]
                            }`
                          : "data:image/png;base64,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"
                      }
                      className="file-section-card-img"
                      alt={file.name}
                    />
                  ) : (
                    <Loading />
                  )}
                  <div className="middle-card">
                    <div className="file-name">{file.name}</div>
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
        <img
          src={
            showImage
              ? conflictSVG
              : "https://forums.synfig.org/uploads/default/original/2X/3/320a629e5c20a8f67d6378c5273cda8a9e2ff0bc.gif"
          }
          style={{ height: 700 }}
          alt="SVG"
          srcSet=""
          className="svg-image"
          key={Date.now()}
        />
        {!isAcceptedId.includes(seletedFile.id) &&
        !isRejectedId.includes(seletedFile.id) ? (
          <div className="btns">
            <div
              className="accept "
              onClick={() => {
                acceptFile();
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
                setIsRejected(true);
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
      </Modal>
    </>
  );
}

export default CheckConflict;
