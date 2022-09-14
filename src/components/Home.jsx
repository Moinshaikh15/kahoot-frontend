import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Home() {
  let goto = useNavigate();
  let { kahoots } = useSelector((state) => state.user);

  return (
    <div className="home">
      <div className="kahoots-container">
        <button onClick={() => goto("/main/create")}>Create</button>
        <h4>My Kahoots</h4>
        <div className="kahoots-card-container">
          {kahoots.map((el) => (
            <div
              key={el._id}
              className="kahoot-card"
              onClick={() => goto(`/main/${el._id}`)}
            >
              <h5>{el.title}</h5>
              <div>
                <button>Edit</button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goto(`/play/${el._id}`);
                  }}
                >
                  Start
                </button>
              </div>
              {/* <p>last updated: {el.updatedAt.toLocaleString()}</p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
