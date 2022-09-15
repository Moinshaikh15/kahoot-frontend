import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

export default function Player() {
  let { socket } = useSelector((state) => state.user);
  let ref = useRef();
  socket?.on("valid", () => {
    console.log("valid");
    socket.emit("name", "Moin");
  });
  socket?.on("invalid", () => alert("invalid"));
  socket?.on("member-joined", (data) => console.log(data));
  return (
    <div className="player">
      <div className="player-id">
        <label htmlFor="roomId">Enter Pin</label>
        <input type="text" name="roomId" />
        <button
          onClick={() => {
            console.log("clicked");
            socket?.emit("joined", ref.current.value);
          }}
        >
          join
        </button>
      </div>
    </div>
  );
}
