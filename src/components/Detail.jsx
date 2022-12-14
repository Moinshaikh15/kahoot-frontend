import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQues, setQues } from "../slices/userSlice";

export default function Detail({ getKahoots }) {
  let { id } = useParams();
  let goto = useNavigate();
  let dispatch = useDispatch();
  let { ques } = useSelector((state) => state.user);
  let { kahoots } = useSelector((state) => state.user);
  let currKahoot = {};
  kahoots.map((e) => {
    if (e._id === id) {
      currKahoot = e;
    }
  });
  let deleteKahoot = async () => {
    let token = localStorage.getItem("accessToken");
    try {
      let resp = await fetch(`https://quizzo-ms.herokuapp.com/kahoot/${id}`, {
        method: "DELETE",
        headers: {
          "content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
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

 
  return (
    <div className="detail">
      <div className="kahoot-detail" key={currKahoot._id}>
        <div className="left">
          <img src="../quiz.jpg" alt="" />
          <h2>{currKahoot.title}</h2>
          <div>
            {" "}
            <button
              onClick={() => goto(`/play`, { state: { id: currKahoot._id } })}
            >
              Start
            </button>
            <button
              onClick={() => goto("/main/create", { state: { currKahoot } })}
            >
              Edit
            </button>
            <button
              onClick={() => {
                deleteKahoot();
                goto("/main");
              }}
              className="delete"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="questions-container">
          {currKahoot.questions.map((element) =>
            ques.map((e) => {
              console.log(element, e._id);
              return element === e._id ? (
                <div key={e._id} className="ques-card">
                  <div>
                    <h4>{e.ques}</h4>
                    <div className="options-container">
                      {e.options.map((elem) => {
                        if (elem !== null)
                          return (
                            <div key={e._id + elem} className="option">
                              <p>{elem}</p>
                            </div>
                          );
                      })}
                    </div>
                  </div>
                  <img src={e.imgUrl} alt="" />
                </div>
              ) : (
                ""
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
