import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  userInfo: null,
  kahoots: [],
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
  },
});

export default userSlice.reducer;
export const { addUser,addKahoot } = userSlice.actions;
