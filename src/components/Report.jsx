import React from "react";
import { useLocation } from "react-router-dom";

export default function Report() {
  let location = useLocation();
  let el = location?.state?.el;
  console.log(el);
  return (
    <div className="report">
      <h2>{el?.kahootId?.title}'s Report</h2>
      <div className="score-container">
        <div className="score" style={{ backgroundColor: "white" ,color:'black'}}>
          <p>Student Name</p>
          <p>score</p>
        </div>
        {el?.scores?.map((e) => {
          return (
            <div className="score">
              <p>{e.name}</p>
              <p>{e.count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
