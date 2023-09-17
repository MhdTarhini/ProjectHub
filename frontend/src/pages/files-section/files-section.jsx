import React, { useContext, useEffect, useState } from "react";
import { channels } from "../../shared/constants";
import "./files-section.css";
import Modal from "react-modal";
import Input from "../../component/input/input";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import FilesContainer from "../../component/FilesContainer/filesContainer";
import { ProjectContext } from "../../context/ProjectContext";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function FilesSection() {
  const [file, setfile] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [getSvg, setGetSvg] = useState("");
  const [brancheName, setBrancheName] = useState("");
  const [SvgSuccess, setSvgSuccess] = useState(false);
  const [dxfFile, setDxfFile] = useState(null);
  const [branche, setBranche] = useState("main");
  const [branches, setBranches] = useState([]);
  const [selectedBranche, setSelectedBranche] = useState(1);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalBrancheOpen, setModalBrancheOpen] = React.useState(false);
  const [selected, setSelected] = useState([]);
  const { teamMember } = useContext(ProjectContext);
  console.log(teamMember);

  const options = [
    { label: "Grapes 🍇", value: "grapes" },
    { label: "Mango 🥭", value: "mango" },
    { label: "Strawberry 🍓", value: "strawberry", disabled: true },
  ];

  const transformedData = teamMember.map((member) => ({
    label: `${member.user.first_name} ${member.user.last_name} - ${member.user.email}`,
    value: member.user.id,
  }));

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  function openBrancheModal() {
    setModalBrancheOpen(true);
  }
  function closeBrancheModal() {
    setModalBrancheOpen(false);
  }
  function handleUpload(e) {
    const file_uploaded = e.target.files[0];
    if (file_uploaded) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dxf_file = event.target.result;
        setDxfFile(dxf_file);
        window.electron.send(channels.Covert_Data_to_svg, { dxf_file });
      };
      reader.readAsDataURL(file_uploaded);
    } else {
      console.log("No file uploaded");
    }
  }

  function handleFileName(e) {
    setFileName(e.target.value);
  }
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2d1ZXN0L2xvZ2luIiwiaWF0IjoxNjk0OTMyMTE2LCJleHAiOjE2OTQ5MzU3MTYsIm5iZiI6MTY5NDkzMjExNiwianRpIjoiYUFBZUVHSEVKYldMSXZkdCIsInN1YiI6IjMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.Uxh13PFbGSVAd6Dpmhb3H_mrGimNQv__MoPj9ui0Xds`;

  async function handleSubmitUpload() {
    const data = new FormData();
    data.append("name", fileName);
    data.append("path_svg", getSvg);
    data.append("path_dxf", file);
    data.append("version", 1);
    data.append("project_id", 1);
    data.append("user_id", 3);
    data.append("branche_id", selectedBranche);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/file-section/upload_file",
        data
      );
    } catch (error) {
      console.error(error);
    }
  }

  function handleBrancheName(e) {
    setBrancheName(e.target.value);
  }

  async function getBranches() {
    const project_id = 1;
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/file-section/get_branches/${project_id}`
      );
      const branchesData = await response.data;
      setBranches(branchesData.data);
      console.log(branchesData.data);
    } catch (error) {
      console.log(error);
    }
  }
  let accumulatedData = [];
  let isDuplicate = false;

  useEffect(() => {}, [selectedBranche]);

  useEffect(() => {
    getBranches();
    window.electron.on(channels.Extract_Data_IsDone, (data) => {
      setUploadSuccess(true);
    });

    window.electron.on(channels.Covert_Data_to_svg_IsDone, (data) => {
      setSvgSuccess(true);
      if (!isDuplicate) {
        accumulatedData.push(data);
        if (data.includes(">")) {
          accumulatedData.push("\n");
        }
      }

      isDuplicate = !isDuplicate;

      if (data.includes("</svg>")) {
        const fullSvgData = accumulatedData.join("");
        setGetSvg(fullSvgData);
      }
    });
  }, []);

  return (
    <>
      <div className="files-section">
        <div className="top-file-section">
          <div className="file-section-title">Files Section</div>
          <div onClick={openModal} className="btn">
            New File
          </div>
        </div>
        <div className="hr"></div>
        <div className="branches-filter">
          <div className="branches">
            <Menu
              as="div"
              className="relative inline-block text-left w-100 menu">
              <div>
                <Menu.Button className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md bg-white px-20 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  Branches
                  <ChevronDownIcon
                    className="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as="div"
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute left-0 z-10 mt-2 w-60 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {branches.map((branche) => (
                    <div className="py-1" key={branche.id}>
                      <Menu.Item onClick={() => setSelectedBranche(branche.id)}>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm flex items-center justify-center"
                            )}>
                            {branche.name}
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  ))}
                  <div className="py-1">
                    <Menu.Item onClick={openBrancheModal}>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm flex items-center justify-center"
                          )}>
                          add Branche
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <div>Fileter</div>
        </div>
        <div className="hr"></div>
        <div className="file-section-card">
          <FilesContainer branche={selectedBranche} file={file} />
        </div>
      </div>
      <div className="model-container">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
          className="new-file-model">
          <h2 className="model-title">Upload New File</h2>
          <div className="upload-file-form">
            <div className="file-name-conatainer">
              <Input
                label={"File Name"}
                name={"file-name"}
                type={"text"}
                onchange={handleFileName}
              />
            </div>
            <div className="input-upload-file">
              <label className="btn" htmlFor="new-file">
                upload
              </label>
              <input
                type="file"
                id="new-file"
                name="new-file"
                onChange={(e) => {
                  setfile(e.target.files[0]);
                  handleUpload(e);
                }}
                className="none"
              />
              <div>{file.name}</div>
            </div>
            <div className="btns">
              <button className="btn" onClick={handleSubmitUpload}>
                submit
              </button>
              <button className="btn" onClick={closeModal}>
                close
              </button>
            </div>
          </div>
        </Modal>
      </div>
      <div className="model-container">
        <Modal
          isOpen={modalBrancheOpen}
          onRequestClose={closeBrancheModal}
          ariaHideApp={false}
          className="new-file-model">
          <h2 className="model-title">Add New Branche</h2>
          <Input
            label={"Branch Name"}
            name={"branch-name"}
            type={"text"}
            onchange={handleBrancheName}
          />
          <div>
            <pre>{JSON.stringify(selected)}</pre>
            <MultiSelect
              options={transformedData}
              value={selected}
              onChange={setSelected}
              labelledBy="Select"
            />
          </div>
          <button className="btn" onClick={closeBrancheModal}>
            close
          </button>
        </Modal>
      </div>
    </>
  );
}

export default FilesSection;
