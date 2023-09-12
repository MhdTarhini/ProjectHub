import React, { useEffect, useState } from "react";
import { channels } from "../../shared/constants";

function FilesSection() {
  const [file, setfile] = useState([]);
  function handlesubmit() {
    const selectedFile = file;

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target.result;
        window.electron.send(channels.GET_DATA, { fileData });
      };
      reader.readAsDataURL(selectedFile);
    } else {
      console.log("No file selected");
    }
  }

  useEffect(() => {
    window.electron.on(channels.POST_DATA, (data) => {
      console.log("Received data from Python:", data);
    });
    console.log(file);
  }, [file]);

  return (
    <div>
      <button onClick={handlesubmit}> submit</button>
      <input
        type="file"
        name="file"
        onChange={(e) => {
          setfile(e.target.files[0]);
        }}
      />
    </div>
  );
}

export default FilesSection;
