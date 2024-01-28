import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./modules/notes";

const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
});

export default store;
