import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Main from "./Main";
import Home from "./Home";
import Detail from "./Detail";
import Create from "./Create";
export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />}>
          <Route path="/main/" element={<Home />} />
          <Route path="/main/:id" element={<Detail />} />
          <Route path="/main/create" element={<Create />} />
        </Route>
      </Routes>
    </div>
  );
}
