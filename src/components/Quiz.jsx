import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { addSocket } from "../slices/userSlice";
let kahoot;
export default function Quiz() {
  let location = useLocation();
  let id = location?.state?.id;
  let { socket } = useSelector((state) => state.user);
  let { kahoots, ques } = useSelector((state) => state.user);
  let dispatch = useDispatch();
  let [currQues, setCurrQues] = useState("");
  let [options, setOptions] = useState([]);
  // let [kahoot, setKahoot] = useState(null);
  let time;
  let [questions, setQuestions] = useState([]);

  //socket's
  socket.on("got-newQue", ({ currQues, options }) => {
    setCurrQues(currQues);
    setOptions(options);
  });

  // functions
  let play = () => {
    let i = 0;
    setCurrQues(questions[i]?.ques);
    setOptions(questions[i]?.options);
    socket.emit("new-que", { currQues, options });
    let interval = setInterval(() => {
      i++;
      setCurrQues(questions[i]?.ques);
      setOptions(questions[i]?.options);
      socket.emit("new-que", { currQues, options });

      if (i >= kahoot.questions.length) {
        clearInterval(interval);
      }
    }, time);
  };

  let load = () => {
    kahoots.map((e) => {
      if (e._id === id) {
        kahoot = e;
        console.log(kahoot, "llll");
      }
    });
    console.log(kahoot, "kkkkk");
    kahoot?.questions?.map((e) => {
      ques.map((el) => {
        if (el._id === e) {
          setQuestions((oldArr) => [...oldArr, el]);
        }
      });
    });
    time = Number(kahoot.timeLimit) * 1000;
    // play();
  };

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    dispatch(addSocket(newSocket));
    load();
  }, []);

  if (socket !== null) {
    socket.on("connect", () => {
      console.log("Client connected");
    });
  }
  console.log(currQues);
  return (
    <div className="quiz">
      <h2>{kahoot?.title}</h2>
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
