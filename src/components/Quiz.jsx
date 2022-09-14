import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { addSocket } from "../slices/userSlice";
export default function Quiz() {
  let { socket } = useSelector((state) => state.user);
  let { kahoots } = useSelector((state) => state.user);
  let dispatch = useDispatch();
  let { id } = useParams();
  let kahoot;
  let [currQues, setCurrQues] = useState("");
  let [options, setOptions] = useState([]);
  kahoots.map((e) => {
    if (e._id === id) {
      kahoot = e;
    }
  });
  let time = Number(kahoot.timeLimit) * 1000;
  let play = () => {
    let i = 0;
    setCurrQues(kahoot.questions[i].ques);
    setOptions(kahoot.questions[i].options);

    let interval = setInterval(() => {
      i++;
      //   console.log(kahoot.questions.length,i)
      setCurrQues(kahoot.questions[i].ques);
      setOptions(kahoot.questions[i].options);

      if (i >= kahoot.questions.length) {
        clearInterval(interval);
      }
    }, time);
  };
  console.log(kahoot);
  useEffect(() => {
    play();
    const newSocket = io("http://localhost:8000");
    dispatch(addSocket(newSocket));
  }, []);

  if (socket !== null) {
    socket.on("connect", () => {
      console.log("Client connected");
    });
  }
  return (
    <div className="quiz">
      <h2>{kahoot.title}</h2>
      <div className="timer"></div>
      <div className="ques">
        <h3>{currQues}</h3>
        <div className="option">
          {options.map((el) => (
            <div>
              <button>{el}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
