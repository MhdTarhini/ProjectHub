import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // const login = async (data) => {
  //    const response = await axios.post(
  //      "http://127.0.0.1:8000/api/guest/login",
  //      data
  //    );
  //    const userdata = await response.data.data;
  //    setUserData(userdata);
  //    localStorage.setItem("user", JSON.stringify(userData));
  // };
  const logout = async () => {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${userData.user.token}`;
    await axios.post("http://127.0.0.1:8000/api/logout");
    localStorage.clear();
    setUserData(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(userData));
  }, [userData]);

  return (
    <AuthContext.Provider value={{ userData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
