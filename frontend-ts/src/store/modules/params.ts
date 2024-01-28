import { createSlice } from "@reduxjs/toolkit";

const paramsStore = createSlice({
  name: "params",
  initialState: {
    numerator: 4,
    denominator: 4,
    bpm: 120,
  },
  reducers: {
    setNumerator(state, action) {
      state.numerator = action.payload;
    },
    setDenominator(state, action) {
      state.denominator = action.payload;
    },
    setBpm(state, action) {
      state.bpm = action.payload;
    },
  },
});

const { setNumerator, setDenominator, setBpm } = paramsStore.actions;

const reducer = paramsStore.reducer;

export { setNumerator, setDenominator, setBpm };

export default reducer;
