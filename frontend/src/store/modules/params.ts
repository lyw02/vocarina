import { ParamsState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ParamsState = {
  numerator: 4,
  denominator: 4,
  bpm: 120,
  voice: "",
};

const paramsStore = createSlice({
  name: "params",
  initialState: initialState,
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
    setVoice(state, action) {
      state.voice = action.payload;
    },
  },
});

const { setNumerator, setDenominator, setBpm, setVoice } = paramsStore.actions;

const reducer = paramsStore.reducer;

export { setNumerator, setDenominator, setBpm, setVoice };

export default reducer;
