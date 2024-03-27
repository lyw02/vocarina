import { NotesState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: NotesState = {
  notes: [],
};

const notesStore = createSlice({
  name: "notes",
  initialState: initialState,
  reducers: {
    setNotes(state, action) {
      // const parsed = action.payload.map((n: string) => JSON.parse(n));
      // state.notes = parsed;
      // // state.notes = action.payload;

      try {
        // const parsed = action.payload.map((n: string) => JSON.parse(n));
        // state.notes = parsed;
        state.notes = action.payload;
      } catch (error) {
        console.error('Error:', error);
      }
    },
  },
});

const { setNotes } = notesStore.actions;

const reducer = notesStore.reducer;

export { setNotes };

export default reducer;
