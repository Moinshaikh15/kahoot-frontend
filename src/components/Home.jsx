import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setQues } from "../slices/userSlice";

export default function Home() {
  let goto = useNavigate();
  let { kahoots, userInfo } = useSelector((state) => state.user);
  let dispatch = useDispatch();
  useEffect(() => {
    getQue();
  }, []);
  let getQue = async () => {
    let token = localStorage.getItem("accessToken");
    try {
      let resp = await fetch(`http://localhost:8000/que/`, {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (resp.status === 200) {
        let data = await resp.json();
        dispatch(setQues(data));
      } else {
        let err = await resp.text();
        alert(err.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <div className="home">
      <div className="kahoots-container">
        <button onClick={() => goto("/main/create")}>Create</button>
        <h4>My Kahoots</h4>
        <div className="kahoots-card-container">
          {kahoots.map((el) =>
            el.creator === userInfo._id ? (
              <div
                key={el._id}
                className="kahoot-card"
                onClick={() => goto(`/main/${el._id}`)}
              >
                <h5>{el.title}</h5>
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goto(`/main/create`, { state: { currKahoot: el } });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goto(`/play`, { state: { id: el._id } });
                    }}
                  >
                    Start
                  </button>
                </div>
                {/* <p>last updated: {el.updatedAt.toLocaleString()}</p> */}
              </div>
            ) : (
              ""
            )
          )}
        </div>
      </div>
    </div>
  );
}
