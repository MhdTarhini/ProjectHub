import React, { useState, useEffect } from "react";
import "./message.css";

const Message = ({ text, type }) => {
  const [showMessage, setShowMessage] = useState(true);

  const showMessageWithDelay = () => {
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  useEffect(() => {
    showMessageWithDelay();
  }, []);

  // <Alert severity="warning">This is a warning alert — check it out!</Alert>
  // <Alert severity="info">This is an info alert — check it out!</Alert>
  // <Alert severity="success">This is a success alert — check it out!</Alert>

  return (
    <div className={`message-popup ${showMessage ? "show" : ""}`}>
      <Alert severity="error">This is an error alert — check it out!</Alert>
      <p>{text}</p>
    </div>
  );
};

export default Message;
