import React from "react";
import Login from "../../components/Login";

const LoginPage = () => {
  return (
    <div
      style={{
        margin: "200px 600px 200px",
        border: "0.2px solid",
        padding: 50,
      }}
    >
      <p style={{ fontSize: 22, textAlign: "center", color: "grey" }}>
        Smart Trash Can - Login
      </p>
      <Login />
    </div>
  );
};

export default LoginPage;
