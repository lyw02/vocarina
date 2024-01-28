export interface PianoKey {
  id: number;
  octave: number;
  color: "black" | "white";
  name: string;
}

export interface Note {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isOverlap: boolean;
  noteLength: number;
  lyrics: string;
}
