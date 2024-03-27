import { Note } from "@/utils/Note";
import { NoteProps } from ".";

export type trackState = "normal" | "muted" | "solo";

export interface Sentence {
  sentenceId: number;
  nextSentenceId: number | null;
  order: number;
  content: string;
  startNote?: number;
  endNote?: number;
}

interface Params {
  numerator: number;
  denominator: number;
  bpm: number;
}

export interface Track {
  trackId: number;
  trackName: string;
  trackState: trackState;
  params?: any[];
  sheet: NoteProps[];
  trackLyrics: Sentence[];
}

export interface Project {
  tracks: Track[];
  params: Params;
}
