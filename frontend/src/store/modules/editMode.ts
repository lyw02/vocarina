import { EditModeState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: EditModeState = {
  editMode: "edit",
};

const editModeStore = createSlice({
  name: "editMode",
  initialState: initialState,
  reducers: {
    setEditMode(state, action) {
      state.editMode = action.payload;
    },
  },
});

const { setEditMode } = editModeStore.actions;

const reducer = editModeStore.reducer;

export { setEditMode };

export default reducer;
