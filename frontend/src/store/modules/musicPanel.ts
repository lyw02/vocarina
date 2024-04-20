import { MusicPanelState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: MusicPanelState = {
  src: null,
  isPlaying: false,
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
    setIsPlaying(state, action) {
      state.isPlaying = action.payload;
    },
    setTitle(state, action) {
      state.title = action.payload;
    },
    setArtist(state, action) {
      state.artist = action.payload;
    },
  },
});

const { setSrc, setIsPlaying, setTitle, setArtist } = musicPanelStore.actions;

const reducer = musicPanelStore.reducer;

export { setSrc, setIsPlaying, setTitle, setArtist };

export default reducer;
