import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

let initialState = {
  userInfo: null,
  kahoots: [],
  socket: null,
  ques: [],
  showQuiz: true,
  report: [],
};
if (localStorage.getItem("userInfo") !== "undefined") {
  initialState.userInfo = JSON.parse(localStorage.getItem("userInfo"));
}
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    addUser: (state, action) => {
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    addKahoot: (state, action) => {
      state.kahoots = action.payload;
    },
    addSocket: (state, action) => {
      state.socket = action.payload;
    },
    deleteQues: (state, action) => {
      let { kahootId, queId } = action.payload;
      let kahoots = state.kahoots;
      kahoots.map((e) => {
        if (e._id === kahootId) {
          e.questions = e.questions.filter((el) => el._id !== queId);
        }
      });
      state.kahoots = kahoots;
    },
    addQues: (state, action) => {
      let { kahootId, ques } = action.payload;
      let kahoots = state.kahoots;
      kahoots.map((e) => {
        if (e._id === kahootId) {
          e.questions.push(ques);
        }
      });
      state.kahoots = kahoots;
    },
    setQues: (state, action) => {
      state.ques = action.payload;
    },
    setShowQuiz: (state, action) => {
      state.showQuiz = action.payload;
    },
    setReport: (state, action) => {
      state.report = action.payload;
    },
  },
});

export default userSlice.reducer;
export const {
  addUser,
  addKahoot,
  addSocket,
  deleteQues,
  addQues,
  setQues,
  setShowQuiz,
  setReport,
} = userSlice.actions;
