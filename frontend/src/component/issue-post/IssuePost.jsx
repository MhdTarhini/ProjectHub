import React, { useEffect, useState } from "react";
import "./IssuePost.css";
import Input from "../input/input";
import axios from "axios";

function IssuePost({ selectedPost }) {
  const [matchedContent, setMatchedContent] = useState(null);
  const [userComment, setUserComment] = useState("");

  async function addComment() {
    const data = new FormData();
    data.append("content", userComment);
    data.append("issue_id", selectedPost.id);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/issue-section/add_comment",
        data
      );
      const add_comment = await response.data;
      if ((add_comment.status = "success")) {
        selectedPost.comments.push(add_comment.data);
        setUserComment("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (selectedPost?.contents) {
      const foundContent = selectedPost.contents.find(
        (content) => content.users?.id === selectedPost.user?.id
      );
      setMatchedContent(foundContent);
    }
  }, [selectedPost]);

  if (!selectedPost) {
    return (
      <>
        <div className="issue-post">no selected post</div>
        <div className="issue-media">no media</div>
      </>
    );
  }

  return (
    <>
      <div className="post-issue">
        <div className="user-info-issue">
          <img
            src={selectedPost.user?.profile_img}
            alt=""
            className="user-img-issues"
          />
          <div className="user-details">
            <div className="user-name-issue">
              {`${selectedPost.user?.first_name} ${selectedPost.user?.last_name}`}
            </div>
            <div className="user-job-issue">{selectedPost.user?.email}</div>
          </div>
        </div>
        <div className="issue-description">{selectedPost.description}</div>
        <div className="issue-post-img">
          {matchedContent && (
            <>
              <img
                src={matchedContent.svg_path}
                alt=""
                className="post-image"
              />
              <div className="img-post-details">
                <div className="img-description">wlecome</div>
              </div>
              <div className="points">
                <div className="point"></div>
                <div className="point"></div>
                <div className="point"></div>
              </div>
            </>
          )}
        </div>
        {selectedPost.comments?.map((comment) => (
          <div key={comment.id} className="issue-post-comments">
            <div className="comment">
              <img
                src={comment.users?.profile_img}
                alt=""
                className="user-img-issues"
              />
              <div className="right-side-comment">
                <div className="user-info-comment">
                  <div className="user-name-issue-comment">
                    {`${comment.users?.first_name} ${comment.users?.last_name}`}
                  </div>
                  <div className="user-job-issue-comment">
                    {comment.users?.email}
                  </div>
                </div>
                <div className="content-comment">{comment.content}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="add-comment">
          <input
            type="text"
            name="user-cpmment"
            id="user-comment"
            placeholder="Write your Comment..."
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
          />
          <div className="issue-post-comment">
            <svg
              width="35px"
              height="35px"
              viewBox="0 0 24 24"
              fill="#ffffff"
              className="svg-comment"
              xmlns="http://www.w3.org/2000/svg"
              onClick={addComment}>
              <path
                d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="issue-media">
        <div className="media-content">
          <div className="members-tag">
            <div className="top-member-tag">
              <div className="title-members">Members</div>
              <div className="add-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none">
                  <mask
                    id="mask0_118_851"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24">
                    <rect width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_118_851)">
                    <path
                      d="M18 14V11H15V9H18V6H20V9H23V11H20V14H18ZM9 12C7.9 12 6.95833 11.6083 6.175 10.825C5.39167 10.0417 5 9.1 5 8C5 6.9 5.39167 5.95833 6.175 5.175C6.95833 4.39167 7.9 4 9 4C10.1 4 11.0417 4.39167 11.825 5.175C12.6083 5.95833 13 6.9 13 8C13 9.1 12.6083 10.0417 11.825 10.825C11.0417 11.6083 10.1 12 9 12ZM1 20V17.2C1 16.6333 1.14583 16.1125 1.4375 15.6375C1.72917 15.1625 2.11667 14.8 2.6 14.55C3.63333 14.0333 4.68333 13.6458 5.75 13.3875C6.81667 13.1292 7.9 13 9 13C10.1 13 11.1833 13.1292 12.25 13.3875C13.3167 13.6458 14.3667 14.0333 15.4 14.55C15.8833 14.8 16.2708 15.1625 16.5625 15.6375C16.8542 16.1125 17 16.6333 17 17.2V20H1ZM3 18H15V17.2C15 17.0167 14.9542 16.85 14.8625 16.7C14.7708 16.55 14.65 16.4333 14.5 16.35C13.6 15.9 12.6917 15.5625 11.775 15.3375C10.8583 15.1125 9.93333 15 9 15C8.06667 15 7.14167 15.1125 6.225 15.3375C5.30833 15.5625 4.4 15.9 3.5 16.35C3.35 16.4333 3.22917 16.55 3.1375 16.7C3.04583 16.85 3 17.0167 3 17.2V18ZM9 10C9.55 10 10.0208 9.80417 10.4125 9.4125C10.8042 9.02083 11 8.55 11 8C11 7.45 10.8042 6.97917 10.4125 6.5875C10.0208 6.19583 9.55 6 9 6C8.45 6 7.97917 6.19583 7.5875 6.5875C7.19583 6.97917 7 7.45 7 8C7 8.55 7.19583 9.02083 7.5875 9.4125C7.97917 9.80417 8.45 10 9 10Z"
                      fill="#1C1B1F"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <div className="member-imgs">
              {" "}
              <div className="team-member-images">
                {selectedPost.members.map((member, index) => {
                  return (
                    <img
                      src={member.users.profile_img}
                      alt={member.users.first_name}
                      srcSet=""
                      className={`member-image image-${index + 1} `}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="media-content-display">
            <div className="top-media-content">
              <div className="title-media">Media</div>
              <svg
                style={{ cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                width="31"
                height="24"
                viewBox="0 0 31 24"
                fill="none">
                <mask
                  id="mask0_118_839"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="31"
                  height="24">
                  <rect width="30.9999" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_118_839)">
                  <path
                    d="M14.2083 17H16.7916V13H21.9583V11H16.7916V7H14.2083V11H9.04166V13H14.2083V17ZM6.45833 21C5.74791 21 5.13975 20.8042 4.63385 20.4125C4.12795 20.0208 3.875 19.55 3.875 19V5C3.875 4.45 4.12795 3.97917 4.63385 3.5875C5.13975 3.19583 5.74791 3 6.45833 3H24.5416C25.252 3 25.8602 3.19583 26.3661 3.5875C26.872 3.97917 27.125 4.45 27.125 5V19C27.125 19.55 26.872 20.0208 26.3661 20.4125C25.8602 20.8042 25.252 21 24.5416 21H6.45833ZM6.45833 19H24.5416V5H6.45833V19Z"
                    fill="#1C1B1F"
                  />
                </g>
              </svg>{" "}
            </div>
            {selectedPost.contents.map((item) => (
              <div className="media-card">
                <div className="issue-post-img-media">
                  <img src={item.svg_path} alt="" className="post-image" />
                  <div className="img-post-details">
                    <div className="img-description">{item.description}</div>
                  </div>
                  <div className="points">
                    <div className="point"></div>
                    <div className="point"></div>
                    <div className="point"></div>
                  </div>
                </div>
                <div className="user-media-upload">
                  <img
                    src={item.users?.profile_img}
                    alt=""
                    className="user-img-media"
                  />
                  <div className="user-info-comment">
                    <div className="user-name-issue-comment">
                      {`${item.users?.first_name} ${item.users?.last_name}`}
                    </div>
                    <div className="user-job-issue-comment">
                      {item.users?.email}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default IssuePost;
