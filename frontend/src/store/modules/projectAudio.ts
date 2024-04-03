import { ProjectAudioState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ProjectAudioState = {
  base64: "",
};

const projectAudioStore = createSlice({
  name: "projectAudio",
  initialState: initialState,
  reducers: {
    setProjectAudio(state, action) {
      state.base64 = action.payload;
    },
  },
});

const { setProjectAudio } = projectAudioStore.actions;

const reducer = projectAudioStore.reducer;

export { setProjectAudio };

export default reducer;
