import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function Create() {
  let { userInfo } = useSelector((state) => state.user);

  let [questions, setQuestions] = useState([]);
  let [time, setTime] = useState(20);
  let [correctAns, setCorrectAns] = useState(null);
  let ref1 = useRef();
  let ref2 = useRef();
  let ref3 = useRef();
  let ref4 = useRef();
  let refTitle = useRef();
  let createKahoot = async () => {
    let newForm = new FormData();
    newForm.append("title", refTitle.current.value);
    newForm.append("questions", JSON.stringify(questions));
    newForm.append("timeLimit", time);
    newForm.append("creator", userInfo._id);

    let data = {
      title: refTitle.current.value,
      questions,
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
      } else {
        let err = await resp.text();
        alert(err.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };
  let handleClick = async (event) => {
    event.preventDefault();
    let newForm = new FormData(event.target);
    let data = {
      ques: newForm.get("ques"),
      options: [
        newForm.get("1"),
        newForm.get("2"),
        newForm.get("3"),
        newForm.get("4"),
      ],
      img: newForm.get("img"),
      correctAns,
    };
    // data = JSON.stringify(data);
    setQuestions((oldArr) => [...oldArr, data]);
    console.log(questions);
  };
  let handleChange = (e) => {
    setTime(e.target.value);
  };
  return (
    <div className="create">
      <div className="left">
        <div>
          {questions.map((e) => {
            return (
              <div>
                <p>{e.ques}</p>
              </div>
            );
          })}
        </div>

        <div className="questions-container"></div>
        <button>Add</button>
      </div>
      <div className="middle">
        <form action="" onSubmit={(event) => handleClick(event)}>
          <input
            type="text"
            placeholder="What is your Question"
            id="ques"
            name="ques"
          />
          <label htmlFor="img">Select image:</label>
          <input type="file" id="img" name="img" accept="image/*" />

          <div className="options">
            <div>
              <input
                type="text"
                id="1"
                name="1"
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
                id="2"
                name="2"
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
                id="3"
                name="3"
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
                id="4"
                name="4"
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

          <button type="submit">Add</button>
        </form>
      </div>
      <div className="right">
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="title" ref={refTitle} />
        <button onClick={() => createKahoot()}>Save</button>
        <div className="time-limit">
          <label htmlFor="time">Time Limit</label>
          <select id="time" name="time" onChange={(e) => handleChange(e)}>
            <option value="20">20s</option>
            <option value="40">40s</option>
            <option value="90">1m 30s</option>
            <option value="120">2m</option>
          </select>
        </div>
      </div>
    </div>
  );
}
