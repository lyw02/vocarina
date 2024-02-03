import { createSlice } from "@reduxjs/toolkit";
import { setToken as setToken_, getToken, removeToken } from "@/utils/token";

const userStore = createSlice({
  name: "user",
  initialState: {
    token: getToken() || "",
    currentUser: "",
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      setToken_(state.token);
    },
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    cleanLoginInfo(state) {
      removeToken();
      state.token = "";
      state.currentUser = "";
    },
  },
});

const { setToken, setCurrentUser, cleanLoginInfo } = userStore.actions;

const userReducer = userStore.reducer;

export { setToken, setCurrentUser, cleanLoginInfo };

export default userReducer;
