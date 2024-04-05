import { ProjectAudioState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ProjectAudioState = {
  base64Arr: [],
  base64: "",
  wavePlotElements: [],
  cursorTime: 0,
};

const projectAudioStore = createSlice({
  name: "projectAudio",
  initialState: initialState,
  reducers: {
    setProjectAudioArr(state, action) {
      state.base64Arr = action.payload;
    },
    setProjectAudio(state, action) {
      state.base64 = action.payload;
    },
    setWavePlotElements(state, action) {
      state.wavePlotElements = action.payload;
    },
    pushWavePlotElements(state, action) {
      state.wavePlotElements.push(action.payload);
    },
    setCursorTime(state, action) {
      state.cursorTime = action.payload;
    },
  },
});

const {
  setProjectAudioArr,
  setProjectAudio,
  setWavePlotElements,
  pushWavePlotElements,
  setCursorTime,
} = projectAudioStore.actions;

const reducer = projectAudioStore.reducer;

export {
  setProjectAudioArr,
  setProjectAudio,
  setWavePlotElements,
  pushWavePlotElements,
  setCursorTime,
};

export default reducer;
