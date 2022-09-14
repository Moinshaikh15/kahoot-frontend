import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function Play() {
  let { id } = useParams();
  let goto = useNavigate();
  return (
    <div className="play">
      <button onClick={() => goto(`/quiz/${id}`)}>start</button>
    </div>
  );
}
