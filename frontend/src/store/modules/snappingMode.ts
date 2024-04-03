import { SnappingModeState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: SnappingModeState = {
  snappingMode: true
};

const snappingModeStore = createSlice({
  name: "snappingMode",
  initialState: initialState,
  reducers: {
    setSnappingMode(state, action) {
      state.snappingMode = action.payload;
    },
  },
});

const { setSnappingMode } = snappingModeStore.actions;

const reducer = snappingModeStore.reducer;

export { setSnappingMode };

export default reducer;
