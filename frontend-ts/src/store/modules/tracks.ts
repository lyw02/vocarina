import { TracksState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TracksState = {
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
      state.tracks.splice(action.payload.position, 0, {
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
      const trackIndex = state.tracks.findIndex(
        (t) => t.trackId === action.payload.trackId
      );
      state.tracks[trackIndex].sheet = action.payload.sheet;
    },
    setTrackState(state, action) {
      const trackIndex = state.tracks.findIndex(
        (t) => t.trackId === action.payload.trackId
      );
      state.tracks[trackIndex].trackState = action.payload.newState;
    },
    setTrackName(state, action) {
      const trackIndex = state.tracks.findIndex(
        (t) => t.trackId === action.payload.trackId
      );
      state.tracks[trackIndex].trackName = action.payload.trackName;
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
  setTrackName,
} = trackStore.actions;

const reducer = trackStore.reducer;

export {
  setCurrentTrack,
  createNewTrack,
  deleteTrack,
  setLyrics,
  setSheet,
  setTrackState,
  setTrackName,
};

export default reducer;
