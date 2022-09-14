import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function Detail() {
  let { id } = useParams();

  let { kahoots } = useSelector((state) => state.user);
  console.log(id);
  return (
    <div className="detail">
      {kahoots.map((el) =>
        el._id === id ? (
          <div className="kahoot-detail">
            <div className="left">
              <h4>{el.title}</h4>
              <button>Start</button>
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
