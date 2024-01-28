import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./modules/notes";
import paramsReducer from "./modules/params";

const store = configureStore({
  reducer: {
    notes: notesReducer,
    params: paramsReducer,
  },
});

export default store;
