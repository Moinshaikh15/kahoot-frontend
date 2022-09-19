import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setQues, setReport } from "../slices/userSlice";

export default function Home() {
  let goto = useNavigate();
  let { kahoots, userInfo, showQuiz, report } = useSelector(
    (state) => state.user
  );
  let dispatch = useDispatch();
  useEffect(() => {
    getQue();
  }, []);
  let getQue = async () => {
    let token = localStorage.getItem("accessToken");
    try {
      let resp = await fetch(`https://quizzo-ms.herokuapp.com/que/`, {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (resp.status === 200) {
        let data = await resp.json();
        dispatch(setQues(data));
        console.log(data);
      } else {
        let err = await resp.text();
        alert(err.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  let getReports = async () => {
    let token = localStorage.getItem("accessToken");
    try {
      let resp = await fetch(`https://quizzo-ms.herokuapp.com/report/`, {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (resp.status === 200) {
        let data = await resp.json();
        dispatch(setReport(data));
        console.log(data);
      } else {
        let err = await resp.text();
        alert(err.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };
  useEffect(() => {
    getReports();
  }, []);
  return (
    <div className="home">
      <div className="kahoots-container">
        {showQuiz ? (
          <>
            <button onClick={() => goto("/main/create")}>Create</button>
            <h3>My Quizes</h3>
            <div className="kahoots-card-container">
              {kahoots.map((el) =>
                el.creator === userInfo._id ? (
                  <div
                    key={el._id}
                    className="kahoot-card"
                    onClick={() => goto(`/main/${el._id}`)}
                  >
                    <div className="kahoot-title-card">
                      <img src="../quiz.jpg" alt="" />
                      <div className="kahoot-title">
                        <h4>{el.title}</h4>
                        <p>{el.questions.length} Questions</p>
                      </div>
                    </div>

                    <div>
                      <img
                        onClick={(e) => {
                          e.stopPropagation();
                          goto(`/main/create`, { state: { currKahoot: el } });
                        }}
                        src="../edit.png"
                        className="edit-img"
                      />

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
          </>
        ) : (
          <div>
            <h3>Reports</h3>
            <div className="report-container">
              {report.map((el) => {
                console.log(el);
                return (
                  <div
                    className="report-Card"
                    onClick={() => goto("/main/report", { state: { el } })}
                  >
                    <img src="../quiz.jpg" alt="" />
                    <div>
                      <h3>{el.kahootId.title}</h3>
                      <p>Teacher: {el.teacherId.name}</p>
                      <p>last played :{el.updatedAt}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
