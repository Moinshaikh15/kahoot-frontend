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
import { addSocket } from "../slices/userSlice";
import Play from "./Play";
import Room from "./Room";
export default function App() {
  let dispatch = useDispatch();

  return (
    <div>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />}>
          <Route path="/main/" element={<Home />} />
          <Route path="/main/:id" element={<Detail />} />
          <Route path="/main/create" element={<Create />} />
        </Route>
        <Route path="/play" element={<Play />} />
        <Route path="/quiz/:roomId" element={<Quiz />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </div>
  );
}
