import { createSlice } from "@reduxjs/toolkit";

const notesStore = createSlice({
  name: "notes",
  initialState: {
    notes: [],
  },
  reducers: {
    setNotes(state, action) {
      state.notes = action.payload;
    },
  },
});

const { setNotes } = notesStore.actions;

const reducer = notesStore.reducer;

export { setNotes };

export default reducer;
