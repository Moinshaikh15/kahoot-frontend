import React, { useState } from "react";

export default function Create() {
  let [questions, setQuestions] = useState([]);
  let [time, setTime] = useState(20);
  let [correctAns, setCorrectAns] = useState("");
  let createKahoot = () => {
    let data = {
      questions,
      timeLimit: time,
    };
    console.log(questions);
    console.log(time);
  };
  let handleClick = (event) => {
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
    };
    data = JSON.stringify(data);
    setQuestions((oldArr) => [...oldArr, data]);
  };
  let handleChange = (e) => {
    setTime(e.target.value);
  };
  return (
    <div className="create">
      <div className="left">
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
              <input type="text" id="1" name="1" placeholder="add Answer 1" />
              <div className="circle"></div>
            </div>
            <div>
              <input type="text" id="2" name="2" placeholder="add Answer 2" />
              <div className="circle"></div>
            </div>
            <div>
              <input
                type="text"
                id="3"
                name="3"
                placeholder="add Answer 3(optional)"
              />
              <div className="circle"></div>
            </div>
            <div>
              <input
                type="text"
                id="4"
                name="4"
                placeholder="add Answer 4(optional)"
              />
              <div className="circle"></div>
            </div>
          </div>

          <button type="submit">Add</button>
        </form>
      </div>
      <div className="right">
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
