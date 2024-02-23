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
        const parsed = action.payload.map((n: string) => JSON.parse(n));
        state.notes = parsed;
      } catch (error) {
        console.error('Error parsing JSON:', error);
        // 处理错误，例如跳过当前元素或者其他操作
      }
    },
  },
});

const { setNotes } = notesStore.actions;

const reducer = notesStore.reducer;

export { setNotes };

export default reducer;
