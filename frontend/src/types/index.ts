import { User } from "@supabase/supabase-js";
import { Track } from "./project";

export type editMode = "edit" | "select";

export type wavePlotElement = {
  trackId: 0;
  id: number;
  left: number;
  top: number;
  width: number;
};

export interface AlertStatus {
  severity: "success" | "error" | "warning" | "info";
  message: string;
}

export interface BaseDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

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
  user: UserState;
  musicPanel: MusicPanelState;
}

export interface NotesState {
  notes: NoteProps[];
}

export interface ParamsState {
  numerator: number;
  denominator: number;
  bpm: number;
  voice: string;
}

export interface TracksState {
  currentTrack: number;
  tracks: Track[];
}

export interface ProjectState {
  projectName: string;
  projectId: number | null;
}

export interface EditModeState {
  editMode: editMode;
}

export interface ProjectAudioState {
  base64Arr: { id: number; data: string[] }[]; // Data of each note in each track
  base64: { id: number; data: string }[]; // Data of final audio in each track
  wavePlotElements: wavePlotElement[];
  cursorTime: number;
  parsedLyricsArr: { id: number; data: string[] }[];
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

export interface UserState {
  currentUser: User | null;
  currentUserId: number | null;
}

export interface MusicPanelState {
  src: string | null;
  isPanelOpen: boolean;
  musicId: number | null;
  title: string;
  artist: string;
}
