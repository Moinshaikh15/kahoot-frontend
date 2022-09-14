import React from "react";

import { Outlet } from "react-router-dom";
import Header from "./Header";
export default function Main() {
  return (
    <div>
      <Header />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
}
