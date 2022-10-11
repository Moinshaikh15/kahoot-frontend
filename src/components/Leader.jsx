import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Confetti from "react-confetti";
export default function Leader({ board }) {
  let [showConfetti, setShowConfetti] = useState(false);
  const config = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };
  useEffect(() => {
    setTimeout(() => {
      setShowConfetti(true);
    }, 6000);
  }, []);

  return (
    <div className="leaderBoard">
      {showConfetti ? <Confetti className="confetti"/> : ""}

      <div className="middle-box">
        <div className="second">
          <p className="name1">{board[1]?.name}</p>
        </div>
        <div className="first">
          <p className="name1">{board[0]?.name}</p>
          <div>
            <p className="score1">{board[0]?.count}</p>
            <p className="score1">Score</p>
          </div>
        </div>
        <div className="third">
          <p className="name1">{board[2]?.name}</p>
        </div>
      </div>
    </div>
  );
}
