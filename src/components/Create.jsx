
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { deleteQues } from "../slices/userSlice";

export default function Create() {
  let location = useLocation();
  let currKahoot = location?.state?.currKahoot;
  let goto = useDispatch();
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

  let createKahoot = async () => {
    let data = {
      title: refTitle.current.value,
      questions: queIdArr,
      timeLimit: time,
      creator: userInfo._id,
    };

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
      goto('/main')
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
    };
    newForm.append("correctAns", correctAns);
    newForm.append("type", type);
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
        console.log(queIdArr);
      } else {
        let err = await resp.text();
        alert(err.message);
      }
    } catch (err) {
      alert(err.message);
    }

    // data = JSON.stringify(data);
    setQuestions((oldArr) => [...oldArr, data]);
    refTitle.current.value = "";
    ref1.current.value = "";
    ref2.current.value = "";
    ref3.current.value = "";
    ref4.current.value = "";
    imgRef.current.value = "";
    queRef.current.value = "";
  };
  let handleChange = (e) => {
    setTime(e.target.value);
  };

  return (
    <div className="create">
      <div className="left">
        <div>
          {questions.map((e) => {
            console.log(e);
            return (
              <div className="left-queCard">
                <p>{e.ques}</p>
                <img
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => {
                    deleteQ(e._id);
                  }}
                  src={"../delete.png"}
                  className="delete"
                />

                {e.type === "quiz" ? (
                  <div className="left-opt-container">
                    <div>opt 1</div>
                    <div>opt 2</div>
                    <div>opt 3</div>
                    <div>opt 4</div>
                  </div>
                ) : (
                  <div className="left-opt-container">
                    <div>true</div>
                    <div>false</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="questions-container"></div>
        <button>Add Que</button>
      </div>
      <div className="middle">
        <form action="" onSubmit={(event) => handleClick(event)}>
          <input
            type="text"
            placeholder="What is your Question"
            id="ques"
            name="ques"
            ref={queRef}
          />
          <label htmlFor="img">Select image:</label>
          <input
            type="file"
            id="img"
            name="img"
            accept="image/*"
            ref={imgRef}
          />

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
                      ref2.current?.value === correctAns ? "green" : "",
                  }}
                  onClick={() => setCorrectAns(ref2.current.value)}
                ></div>
              </div>
            </div>
          )}

          <button type="submit">Save Que</button>
        </form>
      </div>
      <div className="right">
        <label htmlFor="title">Kahoot Title</label>
        <input type="text" name="title" id="title" ref={refTitle} />
        <button onClick={() => (currKahoot ? editKahoot() : createKahoot())}>
          Save
        </button>
        <div className="time-limit">
          <label htmlFor="time">Time Limit/Que</label>
          <select id="time" name="time" onChange={(e) => handleChange(e)}>
            <option value="20">20s</option>
            <option value="40">40s</option>
            <option value="90">1m 30s</option>
            <option value="120">2m</option>
          </select>
        </div>
        <label htmlFor="time">Type</label>
        <select
          id="time"
          name="time"
          onChange={(e) => {
            ref1.current.value = "";
            ref2.current.value = "";
            setType(e.target.value);
          }}
        >
          <option value="quiz">Quiz</option>
          <option value="trueNfalse">True or false</option>
        </select>
      </div>
    </div>
  );
}
