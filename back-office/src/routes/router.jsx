import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import BasicLayout from "../components/BasicLayout";
import Home from "./home/Home";
import Products from "./products/Products";
import Users from "./users/Users";
import LoginPage from "./login/LoginPage";
import useAuthContext from "../contexts/AuthContext";

export const PrivateRoute = ({ children, path }) => {
  console.log(children);
  const { isValid } = useAuthContext();
  if (!isValid) {
    return <Navigate exact to="/login" />;
  }
  return children;
};
const Router = () => {
  const { user } = useAuthContext();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <PrivateRoute>
              <BasicLayout path="/">
                <Home />
              </BasicLayout>
            </PrivateRoute>
          }
        />
        <Route exact path="/login" element={<LoginPage />} />
        <Route
          exact
          path="/garbages"
          element={
            <PrivateRoute>
              <BasicLayout path="/garbages">
                <Products />
              </BasicLayout>
            </PrivateRoute>
          }
        />

        <Route
          exact
          path="/users"
          element={
            <PrivateRoute>
              <BasicLayout path="/users">
                <Users />
              </BasicLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
