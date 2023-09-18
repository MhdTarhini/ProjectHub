import React, { useState, useEffect } from "react";
import "./message.css";

const Message = ({ text }) => {
  const [showMessage, setShowMessage] = useState(false);

  const showMessageWithDelay = () => {
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  useEffect(() => {
    showMessageWithDelay();
  }, []);

  return (
    <div className={`message ${showMessage ? "show" : ""}`}>
      <p>{text}</p>
    </div>
  );
};

export default Message;
