import { Track } from "./project";

export type editMode = "edit" | "select";

export interface PianoKey {
  id: number;
  octave: number;
  color: "black" | "white";
  name: string;
}

export interface NoteProps {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isOverlap: boolean;
  noteLength: number;
  lyrics: string;
  breakpoints?: any[];
}

export interface RootState {
  notes: NotesState;
  params: ParamsState;
  tracks: TrackstState;
  project: ProjectState;
  editMode: EditModeState;
  projectAudio: projectAudioState;
}

export interface NotesState {
  notes: NoteProps[];
}

export interface ParamsState {
  numerator: number;
  denominator: number;
  bpm: number;
}

export interface TrackstState {
  currentTrack: number;
  tracks: Track[];
}

export interface ProjectState {
  tracks: Track[];
  params: ParamsState;
}

export interface EditModeState {
  editMode: editMode;
}

export interface projectAudioState {
  base64: string;
}
