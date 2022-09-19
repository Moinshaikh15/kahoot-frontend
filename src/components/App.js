import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Main from "./Main";
import Home from "./Home";
import Detail from "./Detail";
import Create from "./Create";
import Quiz from "./Quiz";

import { useDispatch, useSelector } from "react-redux";
import { addKahoot, addSocket } from "../slices/userSlice";
import Play from "./Play";
import Player from "./Player";
import Report from "./Report";
export default function App() {
  let dispatch = useDispatch();
  let getKahoots = async () => {
    let token = localStorage.getItem("accessToken");
    try {
      let resp = await fetch("http://localhost:8000/kahoot/", {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (resp.status === 200) {
        let data = await resp.json();
        dispatch(addKahoot(data));
        console.log(data);
      } else {
        let err = await resp.text();
        alert(err);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    getKahoots();
  }, []);
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />}>
          <Route path="/main/" element={<Home />} />
          <Route
            path="/main/:id"
            element={<Detail getKahoots={getKahoots} />}
          />
          <Route path="/main/report" element={<Report />} />
          <Route
            path="/main/create"
            element={<Create getKahoots={getKahoots} />}
          />
        </Route>
        <Route path="/play" element={<Play />} />
        <Route path="/quiz/:roomId" element={<Quiz />} />
        <Route path="/player/" element={<Player />} />
      </Routes>
    </div>
  );
}
