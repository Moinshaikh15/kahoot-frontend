import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addKahoot } from "../slices/userSlice";

export default function Home() {
  let dispatch = useDispatch();
  let goto = useNavigate();
  let { kahoots } = useSelector((state) => state.user);
  let getKahoots = async () => {
    let token = localStorage.getItem("accessToken");
    try {
      let resp = await fetch("http://localhost:8000/kahoot/", {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (resp.status === 200) {
        let data = await resp.json();
        dispatch(addKahoot(data));
        console.log(data);
      } else {
        let err = await resp.text();
        alert(err);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    getKahoots();
  }, []);

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
                <button>edit</button>
              </div>
              {/* <p>last updated: {el.updatedAt.toLocaleString()}</p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
