import React from "react";
import { channels } from "../../shared/constants";

function FilesSection() {
  function FilesSection() {
    window.electron.send(channels.GET_DATA, { product: "notebook" });
  }

  console.log("hello");
  return <div onClick={FilesSection}> filesSection</div>;
}

export default FilesSection;
