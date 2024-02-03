import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./modules/notes";
import paramsReducer from "./modules/params";
import userReducer from "./modules/user";

const store = configureStore({
  reducer: {
    notes: notesReducer,
    params: paramsReducer,
    user: userReducer,
  },
});

export default store;
