import { ParamsState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ParamsState = {
  numerator: 4,
  denominator: 4,
  bpm: 120,
  language: "",
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
    setLanguage(state, action) {
      state.language = action.payload;
    },
    setVoice(state, action) {
      state.voice = action.payload;
    },
  },
});

const { setNumerator, setDenominator, setBpm, setLanguage, setVoice } =
  paramsStore.actions;

const reducer = paramsStore.reducer;

export { setNumerator, setDenominator, setBpm, setLanguage, setVoice };

export default reducer;
