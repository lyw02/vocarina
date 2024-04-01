import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./modules/notes";
import paramsReducer from "./modules/params";
import userReducer from "./modules/user";
import tracksReducer from "./modules/tracks";
import projectReducer from "./modules/project";
import editModeReducer from "./modules/editMode";
import projectAudioReducer from "./modules/projectAudio";
import localStatusReducer from "./modules/localStatus";

const store = configureStore({
  reducer: {
    notes: notesReducer,
    params: paramsReducer,
    user: userReducer,
    tracks: tracksReducer,
    project: projectReducer,
    editMode: editModeReducer,
    projectAudio: projectAudioReducer,
    localStatus: localStatusReducer,
  },
});

export default store;
