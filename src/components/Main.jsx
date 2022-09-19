import React, { useEffect } from "react";
import { addKahoot } from "../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "./Header";
export default function Main() {
  let dispatch = useDispatch();
  let { userInfo } = useSelector((state) => state.user);
  // let getKahoots = async () => {
  //   let token = localStorage.getItem("accessToken");
  //   try {
  //     let resp = await fetch("http://localhost:8000/kahoot/", {
  //       method: "GET",
  //       headers: {
  //         "content-Type": "application/json",
  //         Authorization: "Bearer " + token,
  //       },
  //     });

  //     if (resp.status === 200) {
  //       let data = await resp.json();
  //       dispatch(addKahoot(data));
  //       console.log(data);
  //     } else {
  //       let err = await resp.text();
  //       alert(err);
  //     }
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };

  // useEffect(() => {
  //   getKahoots();
  // }, []);

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
