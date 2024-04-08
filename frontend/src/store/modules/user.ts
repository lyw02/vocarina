import { createSlice } from "@reduxjs/toolkit";
import { removeToken } from "@/utils/token";
import { UserState } from "@/types";

const initialState: UserState = {
  currentUser: "",
};

const userStore = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    // setToken(state, action) {
    //   state.token = action.payload;
    //   setToken_(state.token);
    // },
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    cleanLoginInfo(state) {
      removeToken();
      // state.token = "";
      state.currentUser = "";
    },
  },
});

const { setCurrentUser, cleanLoginInfo } = userStore.actions;

const userReducer = userStore.reducer;

export { setCurrentUser, cleanLoginInfo };

export default userReducer;
