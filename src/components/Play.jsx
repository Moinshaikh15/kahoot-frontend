import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { addSocket } from "../slices/userSlice";
export default function Play() {
  let location = useLocation();
  let id = location?.state?.id;
  let goto = useNavigate();
  let dispatch = useDispatch();
  let { socket } = useSelector((state) => state.user);
  let [roomId, setRoomId] = useState("");
  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    dispatch(addSocket(newSocket));

    socket?.emit("New-Room");
  }, []);
  if (socket !== null) {
    socket.on("connect", () => {
      console.log("client connected");
    });

    socket?.on("new-id", (id) => {
      setRoomId(id);
    });
  }

  return (
    <div className="play">
      <button onClick={() => goto(`/quiz/${roomId}`, { state: { id } })}>
        start
      </button>
      <div className="room-id">
        <p>/quiz</p> {roomId !== "" ? <p>{roomId}</p> : ""}
      </div>
    </div>
  );
}
