import React, { useEffect } from "react";
import { channels } from "../../shared/constants";

function FilesSection() {
  function FilesSection() {
    window.electron.send(channels.GET_DATA, { product: "notebook" });
  }

  useEffect(() => {
    window.electron.on(channels.POST_DATA, (data) => {
      console.log("Received data from Python:", data);
    });
  }, []);

  return <div onClick={FilesSection}> filesSection</div>;
}

export default FilesSection;
