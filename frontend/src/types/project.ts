import { NoteProps } from ".";

export type trackState = "normal" | "muted" | "solo";
export type trackType = "vocal" | "instrumental";

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
  trackType: trackType;
  params?: any[];
  sheet: NoteProps[];
  trackLyrics: Sentence[];
  instUrl?: string;
  instStart?: number;
  instEnd?: number;
  instFilename?: string;
}

export interface Project {
  tracks: Track[];
  params: Params;
}
