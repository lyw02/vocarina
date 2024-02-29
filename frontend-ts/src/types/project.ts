import { Note } from "@/utils/Note";

export type trackState = "normal" | "muted" | "solo";

interface Sentence {
  sentenceOrder: number;
  startNote: number;
  endNote: number;
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
  sheet: Note[];
  trackLyrics: Sentence[];
}

export interface Project {
  tracks: Track[];
  params: Params;
}
