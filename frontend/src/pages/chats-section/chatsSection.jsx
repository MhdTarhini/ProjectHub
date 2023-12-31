import React, { useEffect, useState } from "react";
import "./chatsSection.css";
import { MultiSelect } from "react-multi-select-component";
import {
  onSnapshot,
  collection,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import axios from "axios";
import Modal from "react-modal";
import Logo from "../../component/logo/Logo";
import db from "../../firebase";

function ChatsSection() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const auth = getAuth();
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [rooms, setRooms] = useState([]);
  const [userRooms, setUserRooms] = useState([]);
  const [roomsName, setRoomsName] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoomName, setNewRoomName] = useState(null);
  const [isMulti, setIsMulti] = useState(false);
  const [createMultiRoomIsOpen, setCreateMultiRoomIsOpen] = useState(false);
  const [seletedRoomInfo, setSeletedRoomInfo] = useState([]);
  const [selected, setSelected] = useState([]);
  const [teamMember, setTeamMember] = useState([]);
  const [showlogo, setShowlogo] = useState(true);

  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${userData.user.token}`;

  const transformedData = teamMember.map((member) => ({
    label: `${member.user.first_name} ${member.user.last_name} - ${member.user.email}`,
    value: member.user.id,
  }));

  async function getTeamMember() {
    try {
      const project_id = userData.active;
      const response = await axios.get(
        `http://34.244.172.132/api/common/get_project_Member/${project_id}`
      );
      const teamData = await response.data.data;
      setTeamMember(teamData);
    } catch (error) {
      console.log(error);
    }
  }

  function closeCreateMultiRoom() {
    setCreateMultiRoomIsOpen(false);
    setIsMulti(false);
  }

  async function getRooms() {
    try {
      const response = await axios.get(
        "http://34.244.172.132/api/chat-section/get_rooms"
      );
      const Rooms = await response.data;
      setUserRooms(Rooms.data);
      setRoomsName(userRooms.map((room) => room.name));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getTeamMember();
    getRooms();
  }, [isMulti]);

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
  }, [isMulti]);

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

  const createRoom = async (roomName) => {
    await addDoc(collection(db, "rooms"), {
      name: roomName,
      createdAt: serverTimestamp(),
    });
    setIsMulti(true);
  };

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
    selected.map((select) => {
      selected_id.push(select.value);
    });
    try {
      const response = await axios.post(
        `http://34.244.172.132/api/chat-section/add_room`,
        {
          room_member: selected_id,
          project_id: userData.active,
          name: name,
          Room_db_id: RoomId ? RoomId : newRoomName,
          room_image: "http://34.244.172.132/uploads/users_image/default.png",
        }
      );
      const add_new_chat = await response.data;
      setIsMulti(true);
    } catch (error) {
      console.error(error);
    }
  }
  const usersignout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowlogo(false);
    }, 3000);
  }, []);

  return (
    <>
      {showlogo ? (
        <Logo />
      ) : (
        <div className="chat-section">
          <div className="left-side-chat">
            <div className="top-left-side">
              <div className="chat-word">Chat</div>
              <input type="search" name="search" id="" />
              <svg
                width="40px"
                height="40px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                  setCreateMultiRoomIsOpen(true);
                }}>
                <path
                  d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                  stroke="#0F8EEA"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                  stroke="#0F8EEA"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div className="bottom-left-side">
              <div className="all">ALL</div>
              <div className="room-list">
                {rooms.map((room) =>
                  userRooms.map((userRoom) => {
                    console.log(room.data.name);
                    console.log(userRoom.userRoom);
                    if (room.data.name === userRoom.name) {
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
                            <div className="date-name">
                              <div className="user-name-info-contact">
                                <div className="name">{userRoom.name}</div>
                                <div className="date">10:20 am</div>
                              </div>
                              <div className="display-text">hello there</div>
                            </div>
                          </div>
                          <div className="line-space-chat"></div>
                        </>
                      );
                    }
                  })
                )}
              </div>
            </div>
          </div>
          <div className="right-side-chat">
            <div className="chat-name-navbar">
              <img
                src={
                  seletedRoomInfo.room_image
                    ? seletedRoomInfo.room_image
                    : "http://34.244.172.132/uploads/users_image/default.png"
                }
                alt=""
                className="user-room-contact-img "
              />
              <div>
                {seletedRoomInfo.name ? seletedRoomInfo.name : "Let's Chat"}
              </div>
            </div>
            <div className="chat-container">
              {message.length > 0 ? (
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
                      <div className="message-container">
                        <div className="user-name-message">
                          {msg.data.displayName}
                        </div>
                        <div className="chat-message-send">{msg.data.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="chat-empty">
                    <div className="empty-title">No message yet...</div>
                    <div className="empty-text">
                      Start sharing and communicate with other.
                    </div>
                    <button
                      className="btn empty-button"
                      onClick={() => {
                        setCreateMultiRoomIsOpen(true);
                      }}>
                      Create New Room
                    </button>
                  </div>
                </div>
              )}
              <div className="input-chat-field">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="send-input"
                  placeholder="Write your message here..."
                />
                <button
                  onClick={selectedRoom ? sendMessageToRoom : sendMessage}>
                  <svg
                    width="40px"
                    height="40px"
                    viewBox="0 0 24 24"
                    fill="#0F8EEA"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                      stroke="#fffff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <Modal
            isOpen={createMultiRoomIsOpen}
            onRequestClose={closeCreateMultiRoom}
            ariaHideApp={false}
            className="new-room-model"
            style={{ overlay: { background: "rgb(0 0 0 / 30%)" } }}>
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
              className="btn"
              onClick={() => {
                handleCreateRoom(null, newRoomName);
                createRoom(newRoomName);
                closeCreateMultiRoom();
              }}>
              Create Room
            </button>
          </Modal>
        </div>
      )}
    </>
  );
}

export default ChatsSection;
