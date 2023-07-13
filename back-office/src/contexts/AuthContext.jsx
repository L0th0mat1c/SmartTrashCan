import React, { createContext, useContext, useState } from "react";
import { message } from "antd";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useStateWithLocalStorage } from "../utils/storage";

const AuthContext = createContext({});
const axiosInstance = axios.create({
  baseURL: "https://api-smart-trash-can-g13.herokuapp.com", //https://api-smart-trash-can-g13.herokuapp.com - http://localhost:8000
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useStateWithLocalStorage("user", {
    first_name: "John",
    last_name: "Doe",
    role: "admins:ADMIN",
    permission: {
      grant: [],
      permission_label: "",
    },
  });
  const [token, setToken] = useStateWithLocalStorage("token");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setSession = (accessToken) => {
    if (accessToken) {
      setToken(accessToken);
      setIsValid(true);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      setToken(null);
      setIsValid(false);
      delete axiosInstance.defaults.headers.common.Authorization;
    }
  };

  const loginAPI = async (email, password, remember) => {
    try {
      const result = await axiosInstance.post("/login", {
        email,
        password,
      });
      console.log(result.data);
      setUser(result.data.user);
      setSession(result.data.token);
      return result;
    } catch (e) {
      return message(e);
    }
  };

  const registerAPI = async (values) => {
    try {
      return await axiosInstance.post("/register", values);
    } catch (e) {
      return e;
    }
  };

  const logout = () => {
    setSession(null);
    setUser(null);
  };

  const isTokenValid = () => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        message.warn("token expirée");
        setSession(null);
        return false;
      }
    } catch (e) {
      message.warn("Token erroné");
      setSession(null);
      return false;
    }
    if (!isValid) {
      setIsValid(true);
    }
    return true;
  };

  const checkShouldDisplayMenuItem = (requestedItem) => {
    if (requestedItem === "users") {
      return user.role === "admins:ADMIN";
    }
    if (requestedItem === "documents") {
      return user.role === "admins:ADMIN";
    }
    if (requestedItem === "dashboard")
      return user.role !== "commercials:COMMERCIAL";
    if (requestedItem === "indicators")
      return user.role !== "commercials:COMMERCIAL";
    return true;
  };

  isTokenValid();

  const fetchAPI = async (
    url,
    method = "GET",
    body = null,
    responseType = "json",
    cancelToken
  ) => {
    console.log(method);
    try {
      // isTokenValid();
      setIsLoading(true);
      const result = await axiosInstance({
        url,
        method,
        responseType,
        cancelToken,
        data: body,
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
      });
      setIsLoading(false);
      return result;
    } catch (e) {
      setIsLoading(false);
      return e;
    }
  };

  const dispatchAPI = (type, options) => {
    console.log(options);
    switch (type) {
      case "LOGIN":
        return loginAPI(options.email, options.password, options.rememberMe);
      case "REGISTER":
        return registerAPI(options);
      case "LOGOUT":
        return logout();
      case "GET":
        return fetchAPI(
          options.url,
          "GET",
          null,
          options.responseType,
          options.cancelToken
        );
      case "DELETE":
        return fetchAPI(options.url, "DELETE");
      case "POST":
      case "PATCH":
        return fetchAPI(options.url, type, options.body);
      default:
        return "Switch error";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        isValid,
        dispatchAPI,
        checkShouldDisplayMenuItem,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default () => useContext(AuthContext);
