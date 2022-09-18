import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { addSocket } from "../slices/userSlice";
import QRCode from "react-qr-code";
import { FOCUSABLE_SELECTOR } from "@testing-library/user-event/dist/utils";
export default function Play() {
  let location = useLocation();
  let id = location?.state?.id;
  let goto = useNavigate();
  let dispatch = useDispatch();
  let { socket } = useSelector((state) => state.user);
  let [roomId, setRoomId] = useState("");
  let [usersJoined, setUsersJoined] = useState([]);
  let [isCopied, setIsCopied] = useState(FOCUSABLE_SELECTOR);
  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    dispatch(addSocket(newSocket));

    socket?.emit("New-Room");
    if (socket !== null) {
      socket.on("connect", () => {
        console.log("client connected");
      });

      socket?.on("new-id", (id) => {
        setRoomId(id);
      });
    }
    socket?.on("member-joined", (data) => {
      setUsersJoined(data);
      console.log(data);
    });
  }, []);

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const handleCopyClick = (copyText) => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(copyText)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="play">
      <div
        className="copied"
        style={{ display: isCopied === true ? "flex" : "none" }}
      >
        <p>Copied</p>
      </div>
      <div className="room-id-container">
        <div className="id-card">
          <div className="room-id">
            <div>
              <p>join at</p>
              <p style={{ fontWeight: "700" }}>http://localhost:3000/player</p>
            </div>

            <div>
              <p>Game Pin</p>

              {roomId !== "" ? (
                <p
                  style={{ fontSize: "28px", fontWeight: "700" }}
                  className="roomId"
                  onClick={() => handleCopyClick(roomId)}
                >
                  {roomId}
                </p>
              ) : (
                <p
                  style={{ fontSize: "24px", fontWeight: "700" }}
                  className="roomId"
                  onClick={() => handleCopyClick(roomId)}
                >
                  loading Pin...
                </p>
              )}
            </div>
          </div>

          <div className="qr-code-container">
            <QRCode
              value={`http://localhost:8000/quiz/${roomId}`}
              className="qr-code"
            ></QRCode>
          </div>
        </div>
      </div>

      <div className="bottom">
        <button
          onClick={() =>
            goto(`/quiz/${roomId}`, {
              state: { id, memberCount: usersJoined.length },
            })
          }
        >
          start
        </button>

        <div className="member-container">
          {usersJoined.map((e) => (
            <p className="members-name">{e.name}</p>
          ))}
          {usersJoined.length === 0 ? (
            <div style={{ color: "white", fontSize: "22px" }}>
              <p>Waiting for members to Join</p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
