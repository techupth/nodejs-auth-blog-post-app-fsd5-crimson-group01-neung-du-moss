import React, { useState } from "react";
import axios from "axios";
const AuthContext = React.createContext();
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });

  // const login = () => {
  //   const login = async (data) => {
  //     const result = await axios.post("http://localhost:4000/login", data);
  //     const token = result.data.token;
  //     localStorage.setItem("token", token);
  //     const userDataFromToken = jwtDecode(token);
  //     setState({ ...state, user: userDataFromToken });
  //   };
  // };

  const login = async (data) => {
    try {
      const result = await axios.post("http://localhost:4000/login", data);
      const token = result.data.token;

      // Assuming you have imported jwtDecode at the beginning of your file
      const userDataFromToken = jwtDecode(token);

      localStorage.setItem("token", token);
      setState({ ...state, user: userDataFromToken });
    } catch (error) {
      console.error("Login error:", error);
      setState({ ...state, error: "Login failed" });
    }
  };

  const navigate = useNavigate();

  const register = async (data) => {
    await axios.post("http://localhost:4000/register", data);
    navigate("/login");
  };

  const logout = () => {
    // 🐨 Todo: Exercise #7
    //  ให้เขียน Logic ของ Function `logout` ตรงนี้
    //  Function logout ทำหน้าที่ในการลบ JWT Token ออกจาก Local Storage
  };

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
