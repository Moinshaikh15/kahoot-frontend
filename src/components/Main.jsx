import React, { useEffect } from "react";
import { addKahoot } from "../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "./Header";
export default function Main() {
  let dispatch = useDispatch();
  let { userInfo } = useSelector((state) => state.user);
  
  return (
    <div>
      {userInfo ? (
        <>
          <Header />
          <div className="outlet">
            <Outlet />
          </div>
        </>
      ) : (
        <div className="loading-container">
          <div className="loading">
            <div className="square"></div>
          </div>
        </div>
      )}
    </div>
  );
}
