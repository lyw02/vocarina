import { LocalStatusState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: LocalStatusState = {
  isGenerating: false,
  isGenerated: false,
  isPlaying: false,
  selectedNotes: [],
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
    setSelectedNotes(state, action) {
      state.selectedNotes = action.payload;
    },
  },
});

const {
  setGeneratingStatus,
  setGeneratedStatus,
  setPlayingStatus,
  setSelectedNotes,
} = localStatusStore.actions;

const reducer = localStatusStore.reducer;

export {
  setGeneratingStatus,
  setGeneratedStatus,
  setPlayingStatus,
  setSelectedNotes,
};

export default reducer;
