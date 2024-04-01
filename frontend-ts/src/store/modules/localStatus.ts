import { LocalStatusState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: LocalStatusState = {
  isGenerating: false,
  isGenerated: false,
  isPlaying: false,
};

const localStatusStore = createSlice({
  name: "localStatus",
  initialState: initialState,
  reducers: {
    setGeneratingStatus(state, action) {
      state.isGenerating = action.payload;
    },
    setGeneratedStatus(state, action) {
      state.isGenerated = action.payload;
    },
    setPlayingStatus(state, action) {
      state.isPlaying = action.payload;
    },
  },
});

const { setGeneratingStatus, setGeneratedStatus, setPlayingStatus } =
  localStatusStore.actions;

const reducer = localStatusStore.reducer;

export { setGeneratingStatus, setGeneratedStatus, setPlayingStatus };

export default reducer;
