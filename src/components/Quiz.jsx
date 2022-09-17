import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { addSocket } from "../slices/userSlice";
let kahoot;
let questions = [];
let i = 0;
let correctAns = "";
export default function Quiz() {
  let location = useLocation();
  let id = location?.state?.id;
  let member = location?.state?.member;
  let playerName = location?.state?.name;
  let totalMember = location?.state?.memberCount;
  let { roomId } = useParams();
  let { socket } = useSelector((state) => state.user);
  let { kahoots, ques } = useSelector((state) => state.user);
  let dispatch = useDispatch();
  let [currQues, setCurrQues] = useState("");
  let [options, setOptions] = useState([]);
  let [img, setImg] = useState("");
  //let [correctAns, setCorrectAns] = useState("");
  // let [kahoot, setKahoot] = useState(null);
  let [showCorr, setShowCorr] = useState(false);
  let [name, setName] = useState("");
  let [ansCount, setAnsCount] = useState(0);
  let [selectedOpt, setSelectedOpt] = useState(null);
  let [board, setBoard] = useState([]);
  let [showBoard, setShowBoard] = useState(false);
  let time;
  //let [questions, setQuestions] = useState([]);

  // functions
  let nextQue = (i) => {
    console.log(i);
    setCurrQues(questions[i]?.ques);
    setOptions(questions[i]?.options);
    // setCorrectAns(() => questions[i]?.correctAns);
    correctAns = questions[i]?.correctAns;
    setImg(questions[i]?.imgUrl);
    socket.emit("new-que", {
      currQues: questions[i]?.ques,
      options: questions[i]?.options,
      imgUrl: questions[i]?.imgUrl,
    });

    if (i >= kahoot.questions.length) {
      socket.emit("finished", { roomId, id: socket.id });
      console.log("finished");
    }
    // let interval = setInterval(() => {
    //   i++;
    //   if (i >= kahoot.questions.length) {
    //     clearInterval(interval);
    //     socket.emit("finished", roomId);
    //     console.log("finished");
    //   }

    //   setCurrQues(questions[i]?.ques);
    //   setOptions(questions[i]?.options);
    //   setCorrectAns(questions[i].correctAns);
    //   setImg(questions[i]?.imgUrl);
    //   socket.emit("new-que", {
    //     currQues: questions[i]?.ques,
    //     options: questions[i]?.options,
    //     imgUrl: questions[i]?.imgUrl,
    //   });
    // }, time);
  };

  let load = () => {
    kahoots.map((e) => {
      if (e._id === id) {
        kahoot = e;
      }
    });
    questions = [];
    kahoot?.questions?.map((e) => {
      ques.map((el) => {
        if (el._id === e) {
          questions.push(el);
          // setQuestions((oldArr) => [...oldArr, el]);
        }
      });
    });
    time = Number(kahoot.timeLimit) * 1000;
    nextQue(i);
  };
  let saveReport = async () => {
    console.log('board',board)
    let token = localStorage.getItem("accessToken");
    try {
      let resp = await fetch("http://localhost:8000/report/new", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ kahootId: id, scores: board }),
      });
      if (resp.status === 200) {
        let respData = await resp.json();
        console.log(respData);
      } else {
        let err = await resp.text();
        alert(err.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!member) {
      load();
    }

    if (socket !== null) {
      socket.on("connect", (client) => {
        console.log("Client connected", client.id);
      });
    }

    //socket's
    socket.on("got-newQue", (data) => {
      console.log("got", data);
      setCurrQues(data.currQues);
      setOptions(data.options);
      setImg(data.imgUrl);
      setShowCorr(false);
      setAnsCount(0);
      setSelectedOpt(null);
    });
    socket.on("answered", ({ ans, memberId }) => {
      console.log(correctAns);
      console.log("yess", ans, correctAns);
      setAnsCount((count) => count + 1);
      if (ans === correctAns) {
        socket.emit("correct", { roomId, memberId });
        console.log(ans);
      }
    });
    socket.on("board", (data) => {
      let copyBoard = data;
      copyBoard.sort((a, b) => b.count - a.count);
      console.log(copyBoard);
      setBoard(copyBoard);
      setShowBoard(true);
    });
    // socket.on("corrAns", () => {
    //   console.log("yesCor");
    //   setShowCorr(true);
    // });
  }, []);

  return (
    <div className="quiz">
      {showBoard ? (
        member ? (
          <div className="your-score">
            {board.map((el) => {
              if (el.name === playerName) {
                return (
                  <div className="my-score">
                    <h1>{el.count * 20}</h1>
                    <p>Your Score</p>
                  </div>
                );
              }
            })}
            {/* <div className="my-score">
              <h1>799</h1>
              <p>Your Score</p>
            </div> */}
          </div>
        ) : (
          <div>
            <p style={{ color: "white", fontSize: "22px" }}>Score Board</p>
            <div className="scoreBoard">
              {board.map((el) => (
                <div className="score">
                  <p>{el.name}</p>
                  <p>{el.count * 20}</p>
                </div>
              ))}
              {/* <div className="score">
                <p>Moin</p>
                <p>2</p>
              </div>
              <div className="score">
                <p>Moin</p>
                <p>2</p>
              </div> */}
            </div>
            <button className="save-report" onClick={()=>saveReport()}>Save Report</button>
          </div>
        )
      ) : (
        <>
          {member ? (
            <div className="name">
              <p>{playerName}</p>
            </div>
          ) : (
            <button
              onClick={() => {
                i++;
                console.log(i);
                nextQue(i);
              }}
              className="next"
            >
              Next
            </button>
          )}

          <h2 className="title">{kahoot?.title}</h2>
          <div className="timer"></div>

          {!member ? (
            <div className="overview">
              {options?.map((el) => (
                <div className="opt">
                  <p>{el}</p> <p></p>
                </div>
              ))}
              <p className="opt" style={{ width: "40px" }}>
                {ansCount}/{totalMember}
              </p>
            </div>
          ) : (
            ""
          )}
          {currQues === "" ? (
            <div v style={{ color: "white", fontSize: "22px" }}>
              <h4>Waiting for Quiz to Start</h4>
            </div>
          ) : (
            <div className="ques">
              <h3>{currQues}</h3>
              {img !== "" ? <img src={img} alt="" /> : ""}
              <div className="option">
                {options?.map((el) => (
                  <div>
                    <button
                      onClick={() => {
                        if (selectedOpt === null) {
                          console.log("clicked");
                          setSelectedOpt(el);
                          socket.emit("option-selected", { el, roomId });
                        }
                      }}
                      style={{
                        backgroundColor: selectedOpt === el ? "black" : "",
                        color: selectedOpt === el ? "white" : "",
                      }}
                    >
                      {el}
                    </button>
                  </div>
                ))}
              </div>
              {/* {member ? (
            <div style={{ display: showCorr ? "flex" : "none" }}>
              <p>Correct Answer</p>
            </div>
          ) : (
            ""
          )} */}
            </div>
          )}
        </>
      )}
    </div>
  );
}
