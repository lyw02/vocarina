import { MusicPanelState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: MusicPanelState = {
  src: null,
  isPanelOpen: false,
  musicId: null,
  title: "",
  artist: "",
};

const musicPanelStore = createSlice({
  name: "musicPanel",
  initialState: initialState,
  reducers: {
    setSrc(state, action) {
      state.src = action.payload;
    },
    setIsPanelOpen(state, action) {
      state.isPanelOpen = action.payload;
    },
    setTitle(state, action) {
      state.title = action.payload;
    },
    setArtist(state, action) {
      state.artist = action.payload;
    },
    setMusicId(state, action) {
      state.musicId = action.payload;
    },
  },
});

const { setSrc, setIsPanelOpen, setTitle, setArtist, setMusicId } =
  musicPanelStore.actions;

const reducer = musicPanelStore.reducer;

export { setSrc, setIsPanelOpen, setTitle, setArtist, setMusicId };

export default reducer;
