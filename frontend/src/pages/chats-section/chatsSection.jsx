import React, { useContext, useEffect, useState } from "react";
import ChatSidebar from "../../component/chatComponent/sidebar/ChatSidebar";
import Chat from "../../component/chatComponent/chat/Chat";
import "./chatsSection.css";
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
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { ProjectContext } from "../../context/ProjectContext";
import axios from "axios";

// import {auth , app}
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
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoomName, setNewRoomName] = useState(null);
  const [openContact, setOpenContact] = useState(false);
  const { teamMember } = useContext(ProjectContext);
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${userData.user.token}`;

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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, []);

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
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
        text: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    }
  };

  const sendMessage = async () => {
    await addDoc(collection(db, "messages"), {
      uid: user.uid,
      photoURL: user.photoURL,
      displayName: user.displayName,
      text: newMessage,
      timestamp: serverTimestamp(),
    });
    setNewMessage("");
  };
  async function handleCreateRoom(reciver_id, name, RoomId, image) {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/chat-section/add_room`,
        {
          room_member: reciver_id,
          project_id: userData.active,
          name: name,
          Room_db_id: RoomId,
          room_image: image,
        }
      );
      const add_new_chat = await response.data;
    } catch (error) {
      console.error(error);
    }
  }
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
                <input
                  type="text"
                  placeholder="New room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
                <button onClick={() => createRoom(newRoomName)}>
                  Create Room
                </button>
                <div className="room-list">
                  {rooms.map((room) => (
                    <div key={room.id} onClick={() => setSelectedRoom(room.id)}>
                      {room.data.name}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="left-side-chat">
        <div className="chat-container">
          {user ? (
            <>
              <div>Logged in as {user.displayName}</div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={selectedRoom ? sendMessageToRoom : sendMessage}>
                Send
              </button>
              {message.map((msg) => (
                <div key={msg.id}>
                  <img src={msg.data.photoURL} alt={msg.data.displayName} />
                  {msg.data.text}
                </div>
              ))}
            </>
          ) : (
            <>
              <div>Sign in with Google to continue</div>
              {/* <button onClick={signInWithGoogle}>Sign in with Google</button> */}
            </>
          )}
        </div>
        {/* <div>
          <h3>Users</h3>
          {users.map((user) => (
            <div key={user.id}>{user.data.displayName}</div>
          ))}
        </div> */}
      </div>
    </div>
  );
}

export default ChatsSection;
