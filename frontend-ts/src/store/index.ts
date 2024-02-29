import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./modules/notes";
import paramsReducer from "./modules/params";
import userReducer from "./modules/user";
import tracksReducer from "./modules/tracks";
import projectReducer from "./modules/project";

const store = configureStore({
  reducer: {
    notes: notesReducer,
    params: paramsReducer,
    user: userReducer,
    tracks: tracksReducer,
    project: projectReducer,
  },
});

export default store;
