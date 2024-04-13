import { TracksState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TracksState = {
  currentTrack: 1,
  tracks: [
    {
      trackId: 1,
      trackName: "Track 1",
      trackState: "normal",
      trackType: "vocal",
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
      if (
        state.tracks[
          state.tracks.findIndex((t) => t.trackId === action.payload)
        ].trackType === "vocal"
      ) {
        state.currentTrack = action.payload;
      }
    },
    createNewTrack(state, action) {
      state.tracks.splice(action.payload.position, 0, {
        trackId: state.tracks.length + 1,
        trackName:
          action.payload.trackName ||
          `Unnamed track ${state.tracks.length + 1}`,
        trackState: "normal",
        trackType: action.payload.trackType,
        trackLyrics: [
          { sentenceId: 1, nextSentenceId: null, order: 1, content: "" },
        ],
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
    setInstUrl(state, action) {
      const instTrack = state.tracks.find(
        (t) => t.trackType === "instrumental"
      );
      if (instTrack) {
        instTrack.instUrl = action.payload;
      }
    },
    setInstStart(state, action) {
      const instTrack = state.tracks.find(
        (t) => t.trackType === "instrumental"
      );
      if (instTrack) {
        instTrack.instStart = action.payload;
      }
    },
    setInstEnd(state, action) {
      const instTrack = state.tracks.find(
        (t) => t.trackType === "instrumental"
      );
      if (instTrack) {
        instTrack.instEnd = action.payload;
      }
    },
    setTracks(state, action) {
      state.tracks = action.payload;
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
  setInstUrl,
  setInstStart,
  setInstEnd,
  setTracks,
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
  setInstUrl,
  setInstStart,
  setInstEnd,
  setTracks,
};

export default reducer;
