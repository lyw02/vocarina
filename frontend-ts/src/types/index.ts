import { Note } from "@/utils/Note";
import { Track } from "./project";

export interface PianoKey {
  id: number;
  octave: number;
  color: "black" | "white";
  name: string;
}

export interface NoteProps {
  id?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  isOverlap?: boolean;
  noteLength?: number;
  lyrics?: string;
}

export interface RootState {
  notes: NotesState;
  params: ParamsState;
  project: ProjectState;
}

export interface NotesState {
  notes: Note[];
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
