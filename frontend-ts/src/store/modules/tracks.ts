import { TrackstState, RootState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState: TrackstState = {
  currentTrack: 1,
  tracks: [
    {
      trackId: 1,
      trackName: "Track 1",
      trackState: "normal",
      trackLyrics: [{ sentenceId: 1, nextSentenceId: null, content: "" }],
      sheet: [],
    },
  ],
};

const trackStore = createSlice({
  name: "tracks",
  initialState: initialState,
  reducers: {
    setCurrentTrack(state, action) {
      state.currentTrack = action.payload;
    },
    createNewTrack(state, action) {
      state.tracks.push({
        trackId: state.tracks.length + 1,
        trackName: action.payload.trackName || "Untitled track",
        trackState: "normal",
        trackLyrics: [],
        sheet: [],
      });
    },
    deleteTrack(state, action) {
      state.tracks = state.tracks.filter(
        (track) => track.trackId !== action.payload
      );
    },
  },
});

const { setCurrentTrack, createNewTrack, deleteTrack } = trackStore.actions;

const reducer = trackStore.reducer;

export { setCurrentTrack, createNewTrack, deleteTrack };

export default reducer;
