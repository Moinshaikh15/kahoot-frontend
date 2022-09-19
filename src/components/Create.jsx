import { getByPlaceholderText } from "@testing-library/react";
import React, { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteQues } from "../slices/userSlice";
// let queId = "";
export default function Create({ getKahoots }) {
  let location = useLocation();
  let currKahoot = location?.state?.currKahoot;
  let goto = useNavigate();
  let { userInfo, ques } = useSelector((state) => state.user);
  let [questions, setQuestions] = useState([]);
  let [time, setTime] = useState(20);
  let [correctAns, setCorrectAns] = useState(null);
  let [queIdArr, setQueIdArr] = useState([]);
  let queRef = useRef();
  let imgRef = useRef();
  let ref1 = useRef();
  let ref2 = useRef();
  let ref3 = useRef();
  let ref4 = useRef();
  let refTitle = useRef();
  let [type, setType] = useState("quiz");
  let [editing, setEditing] = useState(false);
  let [queId, setQueId] = useState("");
  let [imgURL, setImgURL] = useState("");
  let [image, setImage] = useState("");
  let [score, setScore] = useState(10);
  let typeDrop = useRef();
  let scoreDrop = useRef();
  let timeDrop = useRef();
  let [highLight, setHighLight] = useState("blank");
  useEffect(() => {
    if (currKahoot) {
      setQuestions([]);
      console.log("k", ques);
      currKahoot.questions.map((e) => {
        ques.map((el) => {
          if (el._id === e) {
            console.log(el._id);
            setQuestions((oldArr) => [...oldArr, el]);
          }
        });
      });
      setQueIdArr(currKahoot.questions);
      refTitle.current.value = currKahoot.title;
      setTime(currKahoot.timeLimit);
    }
  }, []);

  let editKahoot = async () => {
    let data = {
      title: refTitle.current.value,
      questions: queIdArr,
      timeLimit: time,
      creator: userInfo._id,
    };
    let id = currKahoot._id;
    let token = localStorage.getItem("accessToken");
    try {
      let resp = await fetch(`http://localhost:8000/kahoot/${id}/edit`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      });
      if (resp.status === 200) {
        let respData = await resp.text();
        getKahoots();
        console.log(respData);
      } else {
        let err = await resp.text();
        alert(err.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  let createKahoot = async () => {
    let data = {
      title: refTitle.current.value,
      questions: queIdArr,
      timeLimit: time,
      creator: userInfo._id,
    };
    console.log(data);

    let token = localStorage.getItem("accessToken");
    try {
      let resp = await fetch("http://localhost:8000/kahoot/new", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      });
      if (resp.status === 200) {
        let respData = await resp.json();
        console.log(respData);
        getKahoots();
        goto("/main");
      } else {
        let err = await resp.text();
        alert(err.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  let deleteQ = async (queId) => {
    let copyQueIdArr = queIdArr;
    copyQueIdArr = copyQueIdArr.filter((e) => e !== queId);
    setQueIdArr(copyQueIdArr);

    let copyQuesArr = questions;
    copyQuesArr = copyQuesArr.filter((el) => el._id !== queId);
    setQuestions(copyQuesArr);

    blank();
  };

  let handleClick = async (event) => {
    event.preventDefault();
    let newForm = new FormData(event.target);
    let data = {
      ques: newForm.get("ques"),
      options: [
        newForm.get("one"),
        newForm.get("two"),
        newForm.get("three"),
        newForm.get("four"),
      ],
      img: newForm.get("img"),
      correctAns,
      type: type,
    };
    newForm.append("correctAns", correctAns);
    newForm.append("type", type);
    newForm.append("timeLimit", time);
    newForm.append("score", score);
    newForm.append("img", newForm.get("img").file);

    let token = localStorage.getItem("accessToken");
    try {
      let resp = await fetch("http://localhost:8000/que/new", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: newForm,
      });
      if (resp.status === 200) {
        let respData = await resp.json();

        setQueIdArr((oldArr) => [...oldArr, respData._id]);
        setQuestions((oldArr) => [...oldArr, respData]);
        console.log(queIdArr);
      } else {
        let err = await resp.text();
        alert(err.message);
      }
    } catch (err) {
      alert(err.message);
    }

    // data = JSON.stringify(data);
    // setQuestions((oldArr) => [...oldArr, data]);
    refTitle.current.value = "";
    ref1.current.value = "";
    ref2.current.value = "";
    ref3.current.value = "";
    ref4.current.value = "";
    imgRef.current.value = "";
    queRef.current.value = "";
    setImage("");
  };
  let editQue = async (event) => {
    let newForm = new FormData(event.target);
    newForm.append("correctAns", correctAns);
    newForm.append("type", type);
    newForm.append("timeLimit", time);
    newForm.append("score", score);
    console.log(newForm.get("img").name);
    if (newForm.get("img").name !== "")
      newForm.append("img", newForm.get("img").file);
    else newForm.append("imgURL", imgURL);
    let data = {
      ques: newForm.get("ques"),
      options: [
        newForm.get("one"),
        newForm.get("two"),
        newForm.get("three"),
        newForm.get("four"),
      ],
      img: newForm.get("img"),
      imgURL: newForm.get("imgURL"),
      correctAns: newForm.get("correctAns"),
      type: newForm.get("type"),
    };
    console.log(data);
    let token = localStorage.getItem("accessToken");
    try {
      let resp = await fetch(`http://localhost:8000/que/${queId}/edit`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: newForm,
      });
      if (resp.status === 200) {
        let respData = await resp.text();
        console.log(respData);
      } else {
        let err = await resp.text();
        alert(err.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  let handleChange = (e) => {
    setTime(e.target.value);
  };
  let handleChangeScore = (e) => {
    setScore(e.target.value);
  };
  let handleClickQ = (e) => {
    console.log(e);
    queRef.current.value = e.ques;
    ref1.current.value = e.options[0];
    ref2.current.value = e.options[1];
    ref3.current.value = e.options[2];
    ref4.current.value = e.options[3];
    typeDrop.current.value = e.type;
    scoreDrop.current.value = e.score;
    timeDrop.current.value = e.timeLimit;
    // imgRef.current.value = e.imgRef ? e.imgUrl : "";
    setEditing(true);
    setCorrectAns(e.correctAns);
    setQueId(e._id);
    setImgURL(e.imgUrl);
    setImage(e.imgUrl);
    setType(e.type);

    //queId = e._id;
  };
  let blank = () => {
    ref1.current.value = type === "quiz" ? "" : "True";
    ref2.current.value = type === "quiz" ? "" : "False";
    if (type === "quiz") {
      ref3.current.value = "";
      ref4.current.value = "";
    }
    queRef.current.value = "";
    typeDrop.current.value = "quiz";
    scoreDrop.current.value = "10";
    timeDrop.current.value = "20";
    setEditing(false);
    setCorrectAns(null);
    setQueId("");
    setImage("");
    setType("quiz");
    queId = "";
  };

  return (
    <div className="create">
      {/*------------------------- left container ----------------------*/}
      <div className="left">
        <div>
          {questions.map((e) => {
            console.log(e);
            return (
              <div
                className="highlight"
                onClick={() => {
                  setHighLight(e._id);
                }}
                style={{
                  backgroundColor:
                    highLight === e._id ? "rgb(218, 218, 240)" : "white",
                }}
              >
                <div className="left-queCard" onClick={() => handleClickQ(e)}>
                  <p>{e.ques}</p>
                  <img
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteQ(e._id);
                    }}
                    src={"../delete.png"}
                    className="delete"
                  />
                  <div className="left-img" style={{ border: "none" }}>
                    <img src={e.imgUrl} alt="" />
                  </div>
                  {e.type === "quiz" ? (
                    <div className="left-opt-container">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  ) : (
                    <div className="left-opt-container">
                      <div></div>
                      <div></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div
            className="highlight"
            style={{
              backgroundColor:
                highLight === "blank" ? "rgb(218, 218, 240)" : "white",
            }}
          >
            <div
              className="left-queCard"
              onClick={() => {
                setHighLight("blank");
                blank();
              }}
            >
              <p>Question</p>
              <div className="left-img"></div>
              {type === "quiz" ? (
                <div className="left-opt-container">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <div className="left-opt-container">
                  <div></div>
                  <div></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="questions-container"></div>
        {/* //<button>Add Que</button> */}
      </div>
      {/*------------------------- left container ----------------------*/}
      {/*------------------------- Middle container ----------------------*/}
      <div className="middle">
        <form
          action=""
          onSubmit={(event) => {
            event.preventDefault();
            !editing ? handleClick(event) : editQue(event);
          }}
        >
          <input
            type="text"
            placeholder="What is your Question"
            id="ques"
            name="ques"
            ref={queRef}
            className="que-input"
          />

          <div className="form-image-div">
            <input
              type="file"
              id="img"
              name="img"
              accept="image/*"
              ref={imgRef}
              className="img-input"
              onChange={(event) => {
                if (event.target.files && event.target.files[0]) {
                  setImage(() => URL.createObjectURL(event.target.files[0]));
                }
              }}
            />
            {image !== "" ? (
              <img src={image} alt="your image" />
            ) : (
              <label htmlFor="img">Insert Image</label>
            )}
          </div>

          {type === "quiz" ? (
            <div className="options">
              <div>
                <input
                  type="text"
                  id="one"
                  name="one"
                  placeholder="add Answer 1"
                  ref={ref1}
                />
                <div
                  className="circle"
                  style={{
                    backgroundColor:
                      ref1?.current?.value === correctAns ? "green" : "",
                  }}
                  onClick={() => setCorrectAns(ref1.current.value)}
                ></div>
              </div>
              <div>
                <input
                  type="text"
                  id="two"
                  name="two"
                  placeholder="add Answer 2"
                  ref={ref2}
                />
                <div
                  className="circle"
                  style={{
                    backgroundColor:
                      ref2.current?.value === correctAns ? "green" : "",
                  }}
                  onClick={() => setCorrectAns(ref2.current.value)}
                ></div>
              </div>
              <div>
                <input
                  type="text"
                  id="three"
                  name="three"
                  placeholder="add Answer 3(optional)"
                  ref={ref3}
                />
                <div
                  className="circle"
                  style={{
                    backgroundColor:
                      ref3.current?.value === correctAns ? "green" : "",
                  }}
                  onClick={() => setCorrectAns(ref3.current.value)}
                ></div>
              </div>
              <div>
                <input
                  type="text"
                  id="four"
                  name="four"
                  placeholder="add Answer 4(optional)"
                  ref={ref4}
                />
                <div
                  className="circle"
                  style={{
                    backgroundColor:
                      ref4.current?.value === correctAns ? "green" : "",
                  }}
                  onClick={() => setCorrectAns(ref4.current.value)}
                ></div>
              </div>
            </div>
          ) : (
            <div className="options">
              <div>
                <input
                  type="text"
                  id="one"
                  name="one"
                  placeholder="False"
                  ref={ref1}
                  value="True"
                />
                <div
                  className="circle"
                  style={{
                    backgroundColor:
                      ref1?.current?.value === correctAns ? "green" : "",
                  }}
                  onClick={() => setCorrectAns(ref1.current.value)}
                ></div>
              </div>
              <div>
                <input
                  type="text"
                  id="two"
                  name="two"
                  placeholder="False"
                  ref={ref2}
                  value="False"
                />
                <div
                  className="circle"
                  style={{
                    backgroundColor:
                      ref2.current?.value === correctAns
                        ? "rgb(37, 174, 60)"
                        : "",
                  }}
                  onClick={() => setCorrectAns(ref2.current.value)}
                ></div>
              </div>
            </div>
          )}

          <button type="submit">Save Que</button>
        </form>
      </div>
      {/*------------------------- Middle container ----------------------*/}
      {/*------------------------- Right container ----------------------*/}
      <div className="right">
        <div>
          <div className="drop-downs">
            <label htmlFor="time">Score/Que</label>
            <select
              id="time"
              name="time"
              onChange={(e) => handleChangeScore(e)}
              ref={scoreDrop}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
            </select>
          </div>
          <div className="drop-downs">
            <label htmlFor="time">Time Limit/Que</label>
            <select
              id="time"
              name="time"
              onChange={(e) => handleChange(e)}
              ref={timeDrop}
            >
              <option value="20">20s</option>
              <option value="40">40s</option>
              <option value="90">1m 30s</option>
              <option value="120">2m</option>
            </select>
          </div>
          <div className="drop-downs">
            <label htmlFor="time">Type</label>
            <select
              id="time"
              name="time"
              onChange={(e) => {
                ref1.current.value = "";
                ref2.current.value = "";
                setType(e.target.value);
              }}
              ref={typeDrop}
            >
              <option value="quiz">Quiz</option>
              <option value="trueNfalse">True or false</option>
            </select>
          </div>
        </div>
        <div>
          <label
            htmlFor="title"
            style={{ fontSize: "20px", fontWeight: "700" }}
          >
            Quiz Title
          </label>
          <input type="text" name="title" id="title" ref={refTitle} />

          <button
            onClick={() => (currKahoot ? editKahoot() : createKahoot())}
            className="save-btn"
          >
            Save Quiz
          </button>
        </div>
      </div>
      {/*------------------------- Right container ----------------------*/}
    </div>
  );
}
