import React, { useEffect, useState } from "react";
import Input from "../input/input";
import axios from "axios";
import { channels } from "../../shared/constants";
import base64 from "base-64";
import Loading from "../common/loading";
import Modal from "react-modal";

function CommitMain({
  noMainMatch,
  openedfileDetails,
  mainDxfPath,
  mainDxfVersion,
  close,
  mainDxfId,
  closeCheckFile,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  axios.defaults.headers.common["Authorization"] = `Bearer ${user.user.token}`;
  const [errorMain, setMainError] = useState(false);

  const [mainCompareSuccess, setMainCompareSuccess] = useState(false);
  const [mainCommitMessage, setMainCommitMessage] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [mainCompareResult, setMainCompareResult] = useState("");
  const [isDoneCommitMain, setIsDoneCommitMain] = useState(false);
  const [errorMainMessage, setMainErrorMessage] = useState("");
  const [goCheckConflict, setGoCheckConflict] = useState(false);
  const [conflictSvg, setConflitSvg] = useState("");
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [compareSuccess, setCompareSuccess] = useState(false);

  function openModal() {
    setIsloading(false);
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
    setIsloading(false);
  }

  function handleMainCommitMessage(e) {
    setMainCommitMessage(e.target.value);
  }
  async function handleCommitMain(
    compare_Svg,
    new_path_svg,
    old_path_dxf,
    new_path_dxf,
    version,
    status
  ) {
    const data = new FormData();
    data.append("message", mainCommitMessage);
    data.append("file_id", noMainMatch ? null : mainDxfId);
    data.append("new_path_svg", new_path_svg);
    data.append("new_path_dxf", new_path_dxf);
    data.append("old_path_dxf", old_path_dxf);
    data.append("compare_path_svg", compare_Svg);
    data.append("version", version);
    data.append("status", status);
    data.append("team_id", user.team_active);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/file-section/main_commit`,
        data
      );
      const commitData = await response.data;
      setIsloading(false);
      setMainError(false);
      setIsDoneCommitMain(true);
    } catch (error) {
      setMainError(true);
      setMainErrorMessage(error.response.data.message);
    }
  }
  async function displayConflict(svg_data) {
    setGoCheckConflict(false);
    const data = new FormData();
    data.append("svg_data", svg_data);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/check_conflict",
        data
      );
      const conflictSVG = await response.data;
      setConflitSvg(conflictSVG.data);
      setIsloading(false);
    } catch (error) {
      setMainError(true);
      setMainErrorMessage(error.response.data.message);
    }
  }
  function CompareWithMain(main_file_path, local_file_path) {
    setCompareSuccess(false);
    window.electron.send(channels.Compare_Main_Data, {
      main_file_path,
      local_file_path,
    });
  }

  useEffect(() => {
    window.electron.on(channels.Compare_Main_Data_IsDone, (data) => {
      const decodedData = base64.decode(data);
      setMainCompareResult(decodedData);
      displayConflict(decodedData);
      setMainCompareSuccess(true);
      setGoCheckConflict(true);
      setIsloading(false);
    });
  }, []);

  return (
    <>
      <Input
        label={"Commit message"}
        name={"Commit-message"}
        type={"text"}
        onchange={handleMainCommitMessage}
      />
      <div className="btn-main-commit">
        <button
          className={`commit-main ${
            mainCompareSuccess || noMainMatch ? "btn" : "on-procress"
          }`}
          onClick={() => {
            if (noMainMatch) {
              handleCommitMain(
                null,
                openedfileDetails.path_svg,
                null,
                openedfileDetails.path_dxf,
                "-1",
                0
              );
            } else {
              handleCommitMain(
                mainCompareResult,
                openedfileDetails.path_svg,
                mainDxfPath,
                openedfileDetails.path_dxf,
                mainDxfVersion,
                0
              );
            }
            close();
          }}>
          Commit To Main
        </button>
        <div
          className={`check-main ${noMainMatch ? "on-procress" : "btn"}`}
          onClick={() => {
            CompareWithMain(mainDxfPath, openedfileDetails.path_dxf);
            closeCheckFile();
            openModal();
          }}>
          Check
        </div>
      </div>
      {errorMain && <div className="error">{errorMainMessage}</div>}
      {/* <Modal
        isOpen={CheckFileIsOpen}
        onRequestClose={closeCheckFile}
        ariaHideApp={false}
        className="check-conflict-model">
    
        {seletedFile ? (
          <img
            src={seletedFile}
            style={{ height: 700 }}
            alt="SVG"
            srcSet=""
            className="svg-image"
          />
        ) : (
          <Loading />
        )}
      </Modal> */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        className="check-conflict-model">
        {/* <div className="btns close">
          <button className="btn" onClick={closeModal}>
            X
          </button>
        </div> */}
        {conflictSvg ? (
          <img
            src={conflictSvg}
            style={{ height: 700 }}
            alt="SVG"
            srcSet=""
            className="svg-image"
          />
        ) : (
          <Loading />
        )}
      </Modal>
    </>
  );
}

export default CommitMain;
