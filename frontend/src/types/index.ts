import { Track } from "./project";

export type editMode = "edit" | "select";

export type wavePlotElement = {
  id: number;
  left: number;
  top: number;
  width: number;
};

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
  tracks: TracksState;
  project: ProjectState;
  editMode: EditModeState;
  projectAudio: ProjectAudioState;
  localStatus: LocalStatusState;
  snappingMode: SnappingModeState;
}

export interface NotesState {
  notes: NoteProps[];
}

export interface ParamsState {
  numerator: number;
  denominator: number;
  bpm: number;
  language: string;
  voice: string;
}

export interface TracksState {
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

export interface ProjectAudioState {
  base64Arr: string[]; // Data of each note
  base64: string; // Data of final audio
  wavePlotElements: wavePlotElement[];
  cursorTime: number;
}

export interface LocalStatusState {
  isGenerating: boolean;
  isGenerated: boolean;
  isPlaying: boolean;
  selectedNotes: number[];
}

export interface SnappingModeState {
  snappingMode: boolean;
}
