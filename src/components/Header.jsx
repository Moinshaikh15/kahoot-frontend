import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setShowQuiz } from "../slices/userSlice";

export default function Header() {
  let { userInfo } = useSelector((state) => state.user);
  let goto = useNavigate();
  let dispatch = useDispatch();
  let [selected, setSelected] = useState(1);
  let logout = () => {
    localStorage.removeItem("userInfo");
    goto("/");
  };
  return (
    <div className="header">
      <h1 className="branding">Quizzo</h1>
      <div className="brand-menu">
        <div className="menu">
          <ul>
            <li
              className={selected === 1 ? "selected" : ""}
              onClick={() => {
                dispatch(setShowQuiz(true));
                setSelected(1);
                goto('/main')
              }}
            >
              Quiz
            </li>
            <li
              className={selected === 2 ? "selected" : ""}
              onClick={() => {
                dispatch(setShowQuiz(false));
                setSelected(2);
                goto('/main')
              }}
            >
              Reports
            </li>
          </ul>
        </div>
        <div className="username">
          <button onClick={() => logout()}>Logout</button>
        </div>
      </div>
    </div>
  );
}
