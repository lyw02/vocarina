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
      trackLyrics: [
        { sentenceId: 1, nextSentenceId: null, order: 1, content: "" },
      ],
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
        trackName:
          action.payload.trackName ||
          `Untitled track ${state.tracks.length + 1}`,
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
    setLyrics(state, action) {
      state.tracks = state.tracks.map((track) => {
        if (track.trackId === action.payload.trackId) {
          return {
            ...track,
            trackLyrics: action.payload.sentences,
          };
        }
        return track;
      });
      state.currentTrack = action.payload.trackId;
    },
    setSheet(state, action) {
      state.tracks[action.payload.trackId - 1].sheet = action.payload.sheet;
    },
    setTrackState(state, action) {
      state.tracks[action.payload.trackId - 1].trackState =
        action.payload.newState;
    },
  },
});

const {
  setCurrentTrack,
  createNewTrack,
  deleteTrack,
  setLyrics,
  setSheet,
  setTrackState,
} = trackStore.actions;

const reducer = trackStore.reducer;

export {
  setCurrentTrack,
  createNewTrack,
  deleteTrack,
  setLyrics,
  setSheet,
  setTrackState,
};

export default reducer;
