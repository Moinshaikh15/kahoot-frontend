import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQues } from "../slices/userSlice";

export default function Detail() {
  let { id } = useParams();
  let goto = useNavigate();
  let dispatch = useDispatch();
  let { kahoots } = useSelector((state) => state.user);

  let deleteQ = async (id, queId) => {
    let newKahoots = JSON.parse(JSON.stringify(kahoots));
    let data;
    newKahoots.map((e) => {
      if (e._id === id) {
        e.questions = e.questions.filter((el) => el._id !== queId);
        data = e;
      }
    });
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
        console.log("deleted");
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
      {kahoots.map((el) =>
        el._id === id ? (
          <div className="kahoot-detail" key={el._id}>
            <div className="left">
              <h4>{el.title}</h4>
              <button onClick={() => goto(`/play/${el._id}`)}>Start</button>
            </div>

            <div className="questions-container">
              {el.questions.map((e) => (
                <div key={e._id} className="ques-card">
                  <p>{e.ques}</p>
                  <div className="options-container">
                    {e.options.map((elem) => (
                      <div key={e._id + elem} className="option">
                        <p>{elem}</p>
                      </div>
                    ))}
                  </div>
                  <p
                    style={{ color: "red" }}
                    onClick={() => {
                      dispatch(deleteQues({ kahootId: el._id, queId: e._id }));
                      deleteQ(el._id, e._id);
                    }}
                  >
                    delete
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          ""
        )
      )}
    </div>
  );
}
