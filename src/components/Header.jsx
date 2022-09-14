import React from "react";
import { useSelector } from "react-redux";

export default function Header() {
  let { userInfo } = useSelector((state) => state.user);
  console.log(userInfo);
  return (
    <div className="header">
      <h3>Kahoot</h3>
      <div className="username">
        <p>{userInfo.name}</p>
        <button>Logout</button>
      </div>
    </div>
  );
}
