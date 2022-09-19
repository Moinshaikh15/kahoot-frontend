import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { addSocket } from "../slices/userSlice";

export default function Player() {
  let { socket } = useSelector((state) => state.user);
  let ref = useRef();
  let nameRef = useRef();
  let dispatch = useDispatch();
  let goto = useNavigate();
  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    dispatch(addSocket(newSocket));
  }, []);
  socket?.on("valid", () => {
    goto(`/quiz/${ref.current.value}`, {
      state: { member: true, name: nameRef.current.value },
    });
  });
  socket?.on("invalid", () => alert("invalid"));
  return (
    <div className="player">
      <h1>Quizzo!</h1>
      <div className="player-id">
        <input type="text" name="roomId" ref={ref} placeholder="Game Pin" />

        <input type="text" name="name" ref={nameRef} placeholder="NickName" />
        <button
          onClick={() => {
            console.log("clicked");
            socket?.emit("joined", ref.current.value);
            socket.emit("name", {
              name: nameRef.current.value,
              id: ref.current.value,
            });
          }}
        >
          Enter
        </button>
      </div>
    </div>
  );
}
