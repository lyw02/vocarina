import { ProjectState, RootState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initParams = useSelector((state: RootState) => state.params);

const initialState: ProjectState = {
  tracks: [],
  params: initParams,
};

const projectStore = createSlice({
  name: "project",
  initialState: initialState,
  reducers: {
    // setProject(state, action) {
    //   try {
    //     state.project = action.payload;
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // },
    // setParams(state, action) {
    //   try {
    //     state.params = action.payload;
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // },
    setTracks(state, action) {
      // TODO
    },
  },
});

const { setTracks } = projectStore.actions;

const reducer = projectStore.reducer;

export { setTracks };

export default reducer;
