import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { addSocket } from "../slices/userSlice";
import Leader from "./Leader";
let kahoot;
let questions = [];
let i = 0;
let correctAns = "";
let time1 = 20;
let showCorr = false;
export default function Quiz() {
  let time1 = 20;
  let location = useLocation();
  let id = location?.state?.id;
  let member = location?.state?.member;
  let playerName = location?.state?.name;
  let totalMember = location?.state?.memberCount;
  let { roomId } = useParams();
  let { socket } = useSelector((state) => state.user);
  let { kahoots, ques, userInfo } = useSelector((state) => state.user);
  let dispatch = useDispatch();
  let [currQues, setCurrQues] = useState("");
  let [options, setOptions] = useState([]);
  let [img, setImg] = useState("");
  //let [correctAns, setCorrectAns] = useState("");
  // let [kahoot, setKahoot] = useState(null);
  //let [showCorr, setShowCorr] = useState(false);
  let [name, setName] = useState("");
  let [ansCount, setAnsCount] = useState(0);
  let [selectedOpt, setSelectedOpt] = useState(null);
  let [board, setBoard] = useState([]);
  let [showBoard, setShowBoard] = useState(false);
  let [queTime, setQueTime] = useState(20);
  let [time, setTime] = useState(20);
  let [queScore, setQueScore] = useState(10);
  //let [questions, setQuestions] = useState([]);
  let [showLeaderBoard, setShowLeaderBoard] = useState(true);
  let [corrAnsGuess, setCorrAnsGuess] = useState(false);
  let timeInterval;

  // functions
  //--------------- teacher---------------
  //load new ques
  let nextQue = (i) => {
    console.log(questions[i]);
    setCurrQues(questions[i]?.ques);
    setOptions(questions[i]?.options);
    //setCorrectAns(() => questions[i]?.correctAns);
    correctAns = questions[i]?.correctAns;
    setImg(questions[i]?.imgUrl);
    setQueScore(questions[i]?.score);
    // setShowCorr(() => false);
    showCorr = false;
    setQueTime(questions[i]?.timeLimit);
    setAnsCount(() => 0);
    setSelectedOpt(null);
    time1 = questions[i]?.timeLimit;
    setCorrAnsGuess(() => false);

    socket.emit("new-que", {
      currQues: questions[i]?.ques,
      options: questions[i]?.options,
      imgUrl: questions[i]?.imgUrl,
      score: questions[i]?.score,
      queTime: questions[i]?.timeLimit,
    });

    if (i >= kahoot.questions.length) {
      socket.emit("finished", { roomId, id: socket.id });
      console.log("finished");
    }
    startTimer();
  };

  let startTimer = () => {
    clearInterval(timeInterval);
    timeInterval = setInterval(() => {
      if (time1 >= 0) {
        setQueTime((queTime) => (queTime -= 1));
        time1 -= 1;
      }
      if (time1 <= 0) {
        //setShowCorr(true);
        showCorr = true;
        clearInterval(timeInterval);
      }
    }, 1000);
  };

  //--------------- teacher---------------
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
    nextQue(i);
  };

  //--------------- teacher---------------
  let saveReport = async () => {
    console.log("board", board);
    let token = localStorage.getItem("accessToken");
    try {
      let resp = await fetch("https://quizzo-ms.herokuapp.com/report/new", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          kahootId: id,
          scores: board,
          teacherId: userInfo._id,
        }),
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
      // startTimer();
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
      setQueScore(data.score);
      showCorr = false;
      setQueTime(data.queTime);
      setSelectedOpt(null);
      time1 = data.queTime;
      setCorrAnsGuess(() => false);
      startTimer();
    });

    socket.on("answered", ({ ans, memberId }) => {
      console.log("yess", ans, correctAns);
      setAnsCount((AnsCount) => AnsCount + 1);
      if (ans === correctAns) {
        socket.emit("correct", { roomId, memberId, queScore });
        console.log(ans);
      }
    });

    socket.on("board", (data) => {
      let copyBoard = data;
      copyBoard.sort((a, b) => b.count - a.count);
      console.log(copyBoard);
      setBoard(copyBoard);
      setShowBoard(true);
      //saveReport();
      setTimeout(() => {
        setShowLeaderBoard(false);
      }, 20000);
    });

    socket.on("corrAns", () => {
      console.log("yesCor");
      setCorrAnsGuess(true);
      // setShowCorr(true);
    });
  }, []);

  return (
    <div className="quiz">
      {showBoard ? (
        member ? (
          <div className="your-score">
            {board.map((el, index) => {
              if (el.name === playerName) {
                return (
                  <div className="my-score">
                    {/* {index === 0 ? <img src="../first.jpg" alt="" /> : ""} */}
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
            <h2 className="title">{kahoot?.title}</h2>
            <p style={{ color: "white", fontSize: "22px" }}>Score Board</p>
            <div className="scoreBoard">
              {board.map((el) => (
                <div className="score">
                  <p>{el.name}</p>
                  <p>{el.count}</p>
                </div>
              ))}
            </div>
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
                nextQue(i);
              }}
              className="next"
            >
              Next
            </button>
          )}

          {!member ? (
            <div className="overview">
              <p className="opt">Students Answered</p>
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
            <>
              <div className="timer">
                <div>
                  <p>{queTime}</p>
                </div>
              </div>

              <div className="ques">
                <div className="question">
                  <h3>{currQues}</h3>
                </div>

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
                          backgroundColor: showCorr
                            ? correctAns === el
                              ? "#8ac926"
                              : ""
                            : selectedOpt === el
                            ? "rgb(37, 39, 50)"
                            : "",
                          color: selectedOpt === el ? "white" : "",
                        }}
                      >
                        {el}
                      </button>
                    </div>
                  ))}
                </div>
                {member ? (
                  <div style={{ display: showCorr ? "flex" : "none" }}>
                    {corrAnsGuess ? (
                      <p style={{ color: "#8ac926" }}>Correct Answer</p>
                    ) : (
                      <p
                        style={{
                          color: "#d62828",
                          fontSize: "18px",
                          marginTop: "10px",
                        }}
                      >
                        Opps Better luck next Time
                      </p>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
