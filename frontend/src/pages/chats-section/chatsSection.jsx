import React, { useContext, useEffect, useState } from "react";
import ChatSidebar from "../../component/chatComponent/sidebar/ChatSidebar";
import Chat from "../../component/chatComponent/chat/Chat";
import "./chatsSection.css";
import { MultiSelect } from "react-multi-select-component";
import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  onSnapshot,
  collection,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { ProjectContext } from "../../context/ProjectContext";
import axios from "axios";
import Modal from "react-modal";

const db = getFirestore(
  initializeApp({
    apiKey: "AIzaSyDsB1iitOEJl9_95lfdpU4jHNi4eS4VCvs",
    authDomain: "projecthub-28b52.firebaseapp.com",
    projectId: "projecthub-28b52",
    storageBucket: "projecthub-28b52.appspot.com",
    messagingSenderId: "810956090127",
    appId: "1:810956090127:web:c42e239ee518b89f1bec7a",
    measurementId: "G-BF9LZW2GDY",
  })
);

function ChatsSection() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [userRooms, setUserRooms] = useState([]);
  const [roomsName, setRoomsName] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoomName, setNewRoomName] = useState(null);
  const [openContact, setOpenContact] = useState(false);
  const [isMulti, setIsMulti] = useState(false);
  const [createMultiRoomIsOpen, setCreateMultiRoomIsOpen] = useState(false);
  const [seletedRoomInfo, setSeletedRoomInfo] = useState([]);
  const { teamMember } = useContext(ProjectContext);
  const [selected, setSelected] = useState([]);

  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${userData.user.token}`;

  const transformedData = teamMember.map((member) => ({
    label: `${member.user.first_name} ${member.user.last_name} - ${member.user.email}`,
    value: member.user.id,
  }));

  function closeCreateMultiRoom() {
    setCreateMultiRoomIsOpen(false);
  }

  let selected_users_id = [];
  // function newMulti() {
  //   const data = new FormData();

  //   data.append("members", selected_users_id);
  //   data.append("project_id", user.active);
  //   data.append("name", brancheName);

  //   // let selected_users_id = [3, 4];
  //   // function newBranch() {
  //   //   const data = new FormData();
  //   //   selected.map((select) => {
  //   //     console.log(select);
  //   //     selected_users_id.push(select.value);
  //   //   });
  //   //   data.append("members", selected_users_id);
  //   //   data.append("project_id", 1);
  //   //   data.append("name", brancheName);

  //   try {
  //     const response = axios.post(
  //       "http://127.0.0.1:8000/api/file-section/new_branch",
  //       data
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async function getRooms() {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/chat-section/get_rooms"
      );
      const Rooms = await response.data;
      setUserRooms(Rooms.data);
      setRoomsName(userRooms.map((room) => room.name));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getRooms();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
  //     setUsers(
  //       snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         data: doc.data(),
  //       }))
  //     );
  //   });

  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessage(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      const q = query(
        collection(db, `rooms/${selectedRoom}/messages`),
        orderBy("timestamp")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessage(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

      return unsubscribe;
    }
  }, [selectedRoom]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const createRoom = async (roomName) => {
    await addDoc(collection(db, "rooms"), {
      name: roomName,
      createdAt: serverTimestamp(),
    });
  };

  // const signInWithGoogle = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     await signInWithPopup(auth, provider);
  //   } catch (error) {
  //     console.error("Error signing in:", error);
  //   }
  // };

  const sendMessageToRoom = async () => {
    if (selectedRoom) {
      await addDoc(collection(db, `rooms/${selectedRoom}/messages`), {
        uid: userData.user.id,
        photoURL: userData.user.profile_img,
        displayName: `${userData.user.first_name} ${userData.user.last_name}`,
        text: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    }
  };

  const sendMessage = async () => {
    await addDoc(collection(db, "messages"), {
      uid: userData.user.id,
      photoURL: userData.user.profile_img,
      displayName: `${userData.user.first_name} ${userData.user.last_name}`,
      text: newMessage,
      timestamp: serverTimestamp(),
    });
    setNewMessage("");
  };
  let selected_id = [];
  async function handleCreateRoom(reciver_id, name, RoomId, image) {
    if (isMulti) {
      selected.map((select) => {
        selected_id.push(select.value);
      });
    }
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/chat-section/add_room`,
        {
          room_member: reciver_id ? reciver_id : selected_id,
          project_id: userData.active,
          name: name,
          Room_db_id: RoomId ? RoomId : newRoomName,
          room_image: "http://127.0.0.1:8000/uploads/users_image/default.png",
        }
      );
      const add_new_chat = await response.data;
    } catch (error) {
      console.error(error);
    }
  }
  const usersignout = async () => {
    await signOut(auth);
  };

  return (
    <div className="chat-section">
      <div className="right-side-chat">
        <div className="top-right-side">
          <div
            className="contact"
            onClick={() => {
              setOpenContact(true);
            }}>
            Contact
          </div>
          <div
            className="contact"
            onClick={() => {
              setOpenContact(false);
            }}>
            Chat
          </div>
        </div>
        <div className="bottom-right-side">
          {openContact ? (
            <div className="contact-list">
              {teamMember.map((member) => {
                return (
                  <>
                    <div
                      className="user-info-contact"
                      onClick={() => {
                        handleCreateRoom(
                          [member.user.id],
                          `${member.user.first_name} ${member.user.last_name}`,
                          `${member.user.id} - ${userData.user.id}`,
                          member.profile_img
                        );
                        createRoom(`${member.user.id}-${userData.user.id}`);
                        setOpenContact(false);
                      }}>
                      <img
                        src={member.user.profile_img}
                        alt=""
                        className="user-chat-contact-img"
                      />
                      <div className="user-name-info-contact">
                        <div className="name">{member.user.first_name}</div>
                        <div className="name">{member.user.email}</div>
                      </div>
                    </div>
                    <div className="line-space"></div>
                  </>
                );
              })}
            </div>
          ) : (
            <>
              <div className="contact-list">
                <div
                  className="create-room"
                  onClick={() => {
                    setCreateMultiRoomIsOpen(true);
                  }}>
                  Create Room
                </div>
                <div className="line-space"></div>
                <div className="room-list">
                  {rooms.map((room) =>
                    userRooms.map((userRoom) => {
                      if (room.data.name === userRoom.Room_db_id) {
                        return (
                          <>
                            <div
                              key={room.id}
                              onClick={() => {
                                setSelectedRoom(room.id);
                                setSeletedRoomInfo(userRoom);
                              }}
                              className="user-info-contact">
                              <img
                                src={userRoom.room_image}
                                alt=""
                                className="user-chat-contact-img"
                              />
                              <div className="user-name-info-contact">
                                <div className="name">{userRoom.name}</div>
                              </div>
                            </div>
                            <div className="line-space"></div>
                          </>
                        );
                      }
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="left-side-chat">
        <div className="chat-container">
          <div className="chat-name-navbar">
            <img
              src={seletedRoomInfo.room_image}
              alt=""
              className="user-room-contact-img "
            />
            <div>{seletedRoomInfo.name}</div>
          </div>
          <div className="chat-part">
            {message.map((msg) => (
              <div
                key={msg.id}
                className={`message-info ${
                  msg.data.displayName ===
                  `${userData.user.first_name} ${userData.user.last_name}`
                    ? "user-message"
                    : ""
                }`}>
                <img
                  src={msg.data.photoURL}
                  alt={msg.data.displayName}
                  className="user-chat-contact-img"
                />
                {msg.data.text}
              </div>
            ))}
          </div>
          <div className="input-chat-field">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="send-input"
            />
            <button onClick={selectedRoom ? sendMessageToRoom : sendMessage}>
              <svg
                width="40px"
                height="40px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* <div>
          <h3>Users</h3>
          {users.map((user) => (
            <div key={user.id}>{user.data.displayName}</div>
          ))}
        </div> */}
      </div>
      {/* <Modal
        isOpen={createMultiRoomIsOpen}
        onRequestClose={closeCreateMultiRoom}
        ariaHideApp={false}
        className="new-Room-model">
        
      </Modal> */}
      <Modal
        isOpen={createMultiRoomIsOpen}
        onRequestClose={closeCreateMultiRoom}
        ariaHideApp={false}
        className="new-room-model"
        style={{ overlay: { background: "rgb(0 0 0 / 15%)" } }}>
        <h2 className="model-title">Upload New File</h2>
        <div className="btns close">
          <button className="btn" onClick={closeCreateMultiRoom}>
            X
          </button>
        </div>
        <MultiSelect
          options={transformedData}
          value={selected}
          onChange={setSelected}
          labelledBy="Select"
        />
        <input
          type="text"
          placeholder="New room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button
          onClick={() => {
            setIsMulti(true);
            handleCreateRoom(null, newRoomName);
            createRoom(newRoomName);
          }}>
          Create Room
        </button>
      </Modal>
    </div>
  );
}

export default ChatsSection;
