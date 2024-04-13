import { ProjectState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ProjectState = {
  projectName: "Untitled Project",
  projectId: null,
};

const projectStore = createSlice({
  name: "project",
  initialState: initialState,
  reducers: {
    setProjectName(state, action) {
      state.projectName = action.payload;
    },
    setProjectId(state, action) {
      state.projectId = action.payload;
    },
  },
});

const { setProjectName, setProjectId } = projectStore.actions;

const reducer = projectStore.reducer;

export { setProjectName, setProjectId };

export default reducer;
