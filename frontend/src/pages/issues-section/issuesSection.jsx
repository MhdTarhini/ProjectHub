import React, { useEffect, useState } from "react";
import "./issuesSection.css";
import IssuePost from "../../component/issue-post/IssuePost";
import Modal from "react-modal";
import Input from "../../component/input/input";
import axios from "axios";
import Loading from "../../component/common/loading";
import Message from "../../component/common/Message/message";

function IssuesSection() {
  const userData = JSON.parse(localStorage.getItem("user"));
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${userData.user.token}`;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [isloading, setIsloading] = React.useState(false);
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueDescription, setNewIssueDescription] = useState("");
  const [newErrorTitle, setNewErrorTitle] = useState("");
  const [newErrorDescription, setNewErrorDescription] = useState("");
  const [isNewError, setIsNewError] = useState(false);
  const [issueImageDescription, setIssueImageDescription] = useState("");
  const [newIssueImage, setNewIssueImage] = useState([]);
  const [allIssuesPosts, setAllIssuesPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState([]);
  const [imageIsUploaded, setImageIsUploaded] = useState(false);
  const [isDoneCreateNewIssue, setIsDoneCreateNewIssue] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleImageChange = (e) => {
    setNewIssueImage(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  function closeModal() {
    setIsOpen(false);
    setImageIsUploaded(false);
    setNewErrorDescription("");
    setNewErrorTitle("");
    setIsNewError(false);
  }
  function handleIssueTitle(e) {
    setNewIssueTitle(e.target.value);
    setIsNewError(false);
  }
  function handleIssueDescription(e) {
    setIsNewError(false);
    setNewIssueDescription(e.target.value);
  }

  async function handleAddNewIssue() {
    const data = new FormData();
    data.append("title", newIssueTitle);
    data.append("description", newIssueDescription);
    data.append("issue-image", newIssueImage ? newIssueImage : "");
    data.append(
      "issue_image_descrition",
      issueImageDescription ? issueImageDescription : ""
    );
    data.append("status", 1);
    data.append("project_id", userData.active);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/issue-section/add_edit_issue",
        data
      );
      const added_issue = await response.data;
      if ((added_issue.status = "success")) {
        setIsloading(false);
        closeModal();
        setIsDoneCreateNewIssue(true);
      }
    } catch (error) {
      setIsloading(false);
      setIsNewError(true);
      setNewErrorTitle(error.response.data.errors.title);
      setNewErrorDescription(error.response.data.errors.description);
    }
    setImageSrc(null);
    setNewIssueDescription("");
    setNewIssueImage([]);
    setNewIssueTitle("");
  }
  async function getIssuesPosts() {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/issue-section/get_issues_posts/${userData.active}`
      );
      const allIssuesPosts = await response.data;
      console.log(allIssuesPosts);
      setAllIssuesPosts(allIssuesPosts.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getIssuesPosts();
  }, [isDoneCreateNewIssue]);

  return (
    <div className="issues-section">
      {isDoneCreateNewIssue && <Message text={`New Issue Is Created`} />}
      <div className="top-file-section">
        <div className="issue-section-title">Issues Section</div>
        <div
          className="btn"
          onClick={() => {
            setIsOpen(true);
          }}>
          New Issue
        </div>
      </div>
      <div className="hr"></div>
      <div className="issues-container">
        <div className="user-issues-container">
          {allIssuesPosts.map((IssuePost) => {
            return (
              <div key={IssuePost.id}>
                <div
                  className={`user-issues-titles ${
                    selectedPostId === IssuePost.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedPost(IssuePost);
                    setIsSelected(true);
                    if (selectedPostId === IssuePost.id) {
                      setSelectedPostId(null);
                    } else {
                      setSelectedPostId(IssuePost.id);
                    }
                  }}>
                  <div className="issue-name">{IssuePost.title}</div>
                  <div className="issue-sub-title">{IssuePost.description}</div>
                </div>
                <div className="line-space-title"></div>
              </div>
            );
          })}
        </div>
        <IssuePost selectedPost={selectedPost} isSeleted={isSelected} />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        className={`new-issue-model ${imageIsUploaded ? "" : "noImage"}`}
        style={{ overlay: { background: "rgb(0 0 0 / 15%)" } }}>
        <h2 className="model-title">Upload New File</h2>
        <div className="upload-file-form">
          <div className="model-issue-conatainer">
            <Input
              label={"File Name"}
              name={"file-name"}
              type={"text"}
              onchange={handleIssueTitle}
            />
            {isNewError && <div className="error">{newErrorTitle}</div>}
            <textarea
              className="teaxt-are-dexription"
              placeholder="Description"
              onChange={handleIssueDescription}
            />
            {isNewError && <div className="error">{newErrorDescription}</div>}
          </div>

          {imageIsUploaded ? (
            <div>
              <img
                src={imageSrc}
                alt="Uploaded Preview"
                style={{ maxWidth: "300px", maxHeight: "300px" }}
              />
              <textarea
                className="textarea-image-decription"
                placeholder="Description"
                onChange={(e) => {
                  setIssueImageDescription(e.target.value);
                }}
              />
            </div>
          ) : (
            <div className="input-new-image">
              <label htmlFor="issue-image" className="issue-image-label">
                <svg
                  width="25px"
                  height="25px"
                  viewBox="-2 0 32 32"
                  version="1.1">
                  <title>arrow-bottom</title>
                  <desc>Created with Sketch Beta.</desc>
                  <defs></defs>
                  <g
                    id="Page-1"
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd">
                    <g
                      id="Icon-Set"
                      transform="translate(-519.000000, -931.000000)"
                      fill="rgb(0 0 0 / 85%)">
                      <path
                        d="M543,935 L540,935 L540,937 L543,937 C544.104,937 545,937.896 545,939 L545,959 C545,960.104 544.104,961 543,961 L523,961 C521.896,961 521,960.104 521,959 L521,939 C521,937.896 521.896,937 523,937 L526,937 L526,935 L523,935 C520.791,935 519,936.791 519,939 L519,959 C519,961.209 520.791,963 523,963 L543,963 C545.209,963 547,961.209 547,959 L547,939 C547,936.791 545.209,935 543,935 L543,935 Z M525.343,949.758 L532.242,956.657 C532.451,956.865 532.728,956.954 533,956.939 C533.272,956.954 533.549,956.865 533.758,956.657 L540.657,949.758 C541.048,949.367 541.048,948.733 540.657,948.343 C540.267,947.953 539.633,947.953 539.242,948.343 L534,953.586 L534,932 C534,931.447 533.553,931 533,931 C532.448,931 532,931.447 532,932 L532,953.586 L526.757,948.343 C526.367,947.953 525.733,947.953 525.343,948.343 C524.952,948.733 524.952,949.367 525.343,949.758 L525.343,949.758 Z"
                        id="arrow-bottom"></path>
                    </g>
                  </g>
                </svg>
                Upload Image
                {isloading && <Loading />}
              </label>
              <input
                type="file"
                name="issue-image"
                id="issue-image"
                onChange={(e) => {
                  handleImageChange(e);
                  setImageIsUploaded(true);
                }}
              />
            </div>
          )}
          <div className="btns-new-file">
            <button className="btn close-btn" onClick={closeModal}>
              close
            </button>

            <button
              className="btn"
              onClick={() => {
                handleAddNewIssue();
                setIsloading(true);
              }}>
              Create
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default IssuesSection;
