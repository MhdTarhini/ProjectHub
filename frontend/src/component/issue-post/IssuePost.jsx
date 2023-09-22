import React from "react";
import "./IssuePost.css";

function IssuePost() {
  return (
    <>
      <div className="issue-post">
        <div className="post-issue-title">helloworld</div>
        <div className="post-issue">
          <div className="user-info-issue">
            <img src="./default.png" alt="" className="user-img-issues" />
            <div className="user-details">
              <div className="user-name-issue">user-name</div>
              <div className="user-job-issue">user-job</div>
            </div>
          </div>
          <div className="issue-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque illo
            fugiat mollitia ratione harum rerum quod, ullam, repudiandae nostrum
            hic reiciendis officiis cupiditate assumenda sapiente. Fugiat
            aliquam aperiam quaerat vitae?
          </div>
          <div className="issue-post-img">
            <img src="" alt="" srcset="" />
            <div className="img-post-details">
              <div className="img-name">img-name</div>
              <div className="img-description">img-description</div>
            </div>
            <div className="points">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className="issue-post-comments">
            <div className="comment">
              <img src="default.png" alt="" srcset="" />
              <div className="right-side-comment">
                <div className="user-info-comment">
                  <div className="user-name-issue-comment">user-name</div>
                  <div className="user-job-issue-comment">user-job</div>
                </div>
                <div className="content-comment">hello </div>
              </div>
            </div>
            <div className="comment">
              <img src="default.png" alt="" srcset="" />
              <div className="right-side-comment">
                <div className="user-info-comment">
                  <div className="user-name-issue-comment">user-name</div>
                  <div className="user-job-issue-comment">user-job</div>
                </div>
                <div className="content-comment">hello </div>
              </div>
            </div>
            <div className="comment">
              <img src="default.png" alt="" srcset="" />
              <div className="right-side-comment">
                <div className="user-info-comment">
                  <div className="user-name-issue-comment">user-name</div>
                  <div className="user-job-issue-comment">user-job</div>
                </div>
                <div className="content-comment">hello </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="issue-media"></div>
    </>
  );
}

export default IssuePost;
