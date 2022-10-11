import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Leader from "./Leader";

export default function Scores() {
  let goto=useNavigate()
  let location = useLocation();
  let board = location?.state?.board;
  let kahootTitle = location?.state?.kahootTitle;
  let member = location?.state?.member;
  let playerName = location?.state?.playerName;
  let [showLeaderBoard, setShowLeaderBoard] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowLeaderBoard(false);
    }, 20000);
  }, []);
  console.log(board);
  return (
    <div className="scores">
      {member ? (
        <div className="your-score">
          {board.map((el, index) => {
            if (el.name === playerName) {
              return (
                <div className="my-score">
                  <h1>{el.count}</h1>
                  <p>Your Score</p>
                </div>
              );
            }
          })}
        </div>
      ) : showLeaderBoard ? (
        <Leader board={board} />
      ) : (
        <div>
          <h2 className="title">{kahootTitle}</h2>
          <p style={{ color: "white", fontSize: "22px" }}>Score Board</p>
          <div className="scoreBoard">
            {board.map((el) => (
              <div className="score">
                <p>{el.name}</p>
                <p>{el.count}</p>
              </div>
            ))}
          </div>

          <button className="back-home" onClick={()=>goto('/main/')}>Home</button>
        </div>
      )}
    </div>
  );
}
