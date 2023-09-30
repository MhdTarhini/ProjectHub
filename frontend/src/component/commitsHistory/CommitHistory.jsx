import React, { useState } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import Modal from "react-modal";
import Loading from "../common/loading/loading";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function CommitHistory({ allCommit }) {
  const [selected, setSelected] = useState(["commit message </> version"]);
  const [CheckCommitIsOpen, setCheckCommitIsOpen] = React.useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCommited, setIsCommited] = useState(false);
  const [CheckFileIsOpen, setCheckFileIsOpen] = useState(false);

  const [seletedCommitSVG, setSeletedCommitSVG] = useState("");

  function closeCheckCommit() {
    setCheckCommitIsOpen(false);
    setIsloading(false);
  }
  function openCommitModal() {
    setCheckCommitIsOpen(true);
    setIsloading(false);
    setIsCommited(false);
  }

  function closeCheckFile() {
    setCheckFileIsOpen(false);
    setIsloading(false);
  }

  //   async function getfileCommit(file_id) {
  //     try {
  //       const response = await axios.get(
  //         `http://127.0.0.1:8000/api/file-section/get_commits/${file_id}`
  //       );
  //       const commitData = await response.data;
  //       setAllCommit(commitData.data);
  //     } catch (error) {
  //       setError(true);
  //       setErrorMessage(error.response.data.message);
  //     }
  //   }

  return (
    <>
      <div>
        <Listbox value={selected} onChange={setSelected}>
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                Commit History
              </Listbox.Label>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                  <span className="flex items-center">
                    <span className="ml-3 block truncate">{selected}</span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0">
                  <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {allCommit.map((commit) => (
                      <Listbox.Option
                        key={commit.id}
                        className={({ active }) =>
                          classNames(
                            active
                              ? "bg-indigo-600 text-white"
                              : "text-gray-900",
                            "relative cursor-default select-none py-2 pl-3 pr-9"
                          )
                        }
                        value={commit.message + " </> "}>
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "ml-3 block truncate"
                                )}>
                                {commit.message + " </> "}
                              </span>
                            </div>

                            {setSeletedCommitSVG(commit.compare_path_svg)}
                            {selected ? (
                              <span
                                className={classNames(
                                  active ? "text-white" : "text-indigo-600",
                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                )}>
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
      <button
        className="btn btn-commit-check"
        onClick={() => {
          setSelected(["commit message </> version"]);
          closeCheckFile();
          openCommitModal();
        }}>
        Check Commit
      </button>
      <Modal
        isOpen={CheckCommitIsOpen}
        onRequestClose={closeCheckCommit}
        ariaHideApp={false}
        className="check-conflict-model zindex">
        {seletedCommitSVG ? (
          <img
            src={seletedCommitSVG}
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

export default CommitHistory;
