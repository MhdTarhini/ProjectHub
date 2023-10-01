import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${user?.user?.token}`;
    const logout = async () => {
      await axios.post("http://34.244.172.132/api/logout");
      localStorage.clear();
    };

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
    }, []);

    return (
      <AuthContext.Provider value={{ logout }}>{children}</AuthContext.Provider>
    );
};
