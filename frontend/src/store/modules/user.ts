import { createSlice } from "@reduxjs/toolkit";
import { setToken as setToken_, removeToken } from "@/utils/token";
import { UserState } from "@/types";

const initialState: UserState = {
  // currentUser: "",
  currentUser: null,
  currentUserId: null,
};

const userStore = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload.data.user;
      console.log("action.payload", action.payload)
      action.payload.data.session && setToken_(action.payload.data.session.access_token)
    },
    setCurrentUserId(state, action) {
      state.currentUserId = action.payload;
    },
    cleanLoginInfo(state) {
      state.currentUser = null;
      removeToken()
    },
  },
});

const { setCurrentUser, setCurrentUserId, cleanLoginInfo } = userStore.actions;

const userReducer = userStore.reducer;

export { setCurrentUser, setCurrentUserId, cleanLoginInfo };

export default userReducer;
