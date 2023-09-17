import React, { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import "./branches.css";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Branches() {
  const [branches, setBranches] = useState([]);

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
  useEffect(() => {
    getBranches();
  }, []);
  return (
    <Menu as="div" className="relative inline-block text-left w-100 menu">
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
              {" "}
              {/* Added key for uniqueness */}
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm flex items-center justify-center"
                    )}>
                    {branche.name}
                  </a>
                )}
              </Menu.Item>
            </div>
          ))}
        </Menu.Items>
        <Menu.Items className="absolute left-0 z-10 mt-2 w-60 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {branches.map((branche) => (
            <div className="py-1" key={branche.id}>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm flex items-center justify-center"
                    )}>
                    {branche.name}
                  </a>
                )}
              </Menu.Item>
            </div>
          ))}
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
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
  );
}

export default Branches;
