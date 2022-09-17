import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Header() {
  let { userInfo } = useSelector((state) => state.user);
  let goto = useNavigate();
  console.log(userInfo);
  let logout = () => {
    localStorage.removeItem("userInfo");
    goto("/");
  };
  return (
    <div className="header">
      <h3>Kahoot</h3>
      <div className="username">
        <p>{userInfo.name}</p>
        <button onClick={() => logout()}>Logout</button>
      </div>
    </div>
  );
}
