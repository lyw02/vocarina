import { NoteProps } from "@/types";

export const noteStyle = {
  color: "#ff8fab",
  overlapColor: "#db7790",
  selectedColor: "#ffe5ec",
  overlapSelectedColor: "#db7790b2",
  borderColor: "#fff",
  textColor: "#fff",
  font: "15px sans-serif",
  textAlign: "start",
  textBaseline: "middle",
  borderWidth: 3,
  lineCap: "square",
  noteHeight: 25,
  minNoteWidth: 20,
} as const;

type boundary = "left" | "right";

export class Note {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isOverlap: boolean;
  noteLength: number;
  lyrics: string;

  constructor(id: number, startX: number, startY: number); // New notes
  constructor(
    id: number,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    isOverlap: boolean,
    noteLength: number,
    lyrics: string,
    breakpoints?: any[]
  ); // Read existing notes
  constructor(
    id: number,
    startX: number,
    startY: number,
    endX?: number,
    endY?: number,
    isOverlap?: boolean,
    noteLength?: number,
    lyrics?: string,
    breakpoints?: any[]
  ) {
    if (
      endX &&
      endY &&
      isOverlap !== undefined &&
      noteLength &&
      lyrics !== undefined
    ) {
      this.id = id;
      this.startX = startX;
      this.startY = startY;
      this.endX = endX;
      this.endY = endY;
      this.isOverlap = isOverlap;
      this.noteLength = noteLength;
      this.lyrics = lyrics;
      if (breakpoints) {
        // TODO
      }
    } else {
      this.id = id;
      this.startX = startX;
      this.startY =
        Math.floor(startY / noteStyle.noteHeight) * noteStyle.noteHeight;
      this.endX = startX + noteStyle.minNoteWidth;
      this.endY = this.startY + noteStyle.noteHeight;
      this.isOverlap = false;
      this.noteLength = Math.abs(this.startX - this.endX);
      this.lyrics = "";
    }
  }

  get minX() {
    let min = Math.min(this.startX, this.endX);
    if (
      Math.abs(min - this.startX) < noteStyle.minNoteWidth &&
      min < this.startX
    ) {
      return this.startX - noteStyle.minNoteWidth;
    } else {
      return min;
    }
  }
  get maxX() {
    let max = Math.max(this.startX, this.endX);
    if (
      Math.abs(max - this.startX) < noteStyle.minNoteWidth &&
      max > this.startX
    ) {
      return this.startX + noteStyle.minNoteWidth;
    } else {
      return max;
    }
  }
  get minY() {
    return this.startY;
  }
  get maxY() {
    return this.endY;
  }

  get midX() {
    return (this.startX + this.endX) / 2;
  }
  get midY() {
    return (this.startY + this.endY) / 2;
  }

  drawNote(ctx: CanvasRenderingContext2D, selectedNotes: number[]) {
    this.noteLength = Math.abs(this.minX - this.maxX);
    ctx.beginPath();
    ctx.moveTo(this.minX, this.minY);
    ctx.lineTo(this.maxX, this.minY);
    ctx.lineTo(this.maxX, this.maxY);
    ctx.lineTo(this.minX, this.maxY);
    ctx.lineTo(this.minX, this.minY);
    if (this.isOverlap) {
      selectedNotes.includes(this.id)
        ? (ctx.fillStyle = noteStyle.overlapColor)
        : (ctx.fillStyle = noteStyle.overlapColor);
    } else {
      selectedNotes.includes(this.id)
        ? (ctx.fillStyle = noteStyle.overlapColor)
        : (ctx.fillStyle = noteStyle.color);
    }
    // this.isOverlap
    //   ? (ctx.fillStyle = noteStyle.overlapColor)
    //   : (ctx.fillStyle = noteStyle.color);
    ctx.fill();
    ctx.strokeStyle = noteStyle.borderColor;
    ctx.lineWidth = noteStyle.borderWidth;
    ctx.lineCap = noteStyle.lineCap;
    ctx.stroke();
    ctx.font = noteStyle.font;
    ctx.textAlign = noteStyle.textAlign;
    ctx.textBaseline = noteStyle.textBaseline;
    ctx.fillStyle = noteStyle.textColor;
    ctx.fillText(
      this.lyrics,
      this.minX + 3,
      (this.maxY + this.minY) / 2 + 3,
      this.noteLength - 6
    );
  }

  isInside(x: number, y: number) {
    // whether position (x, y) is inside a note
    return x > this.minX && x < this.maxX && y > this.minY && y < this.maxY;
  }

  isBoundary(x: number, y: number): boundary | undefined {
    // whether position (x, y) is on the left/right boundary of a note
    if (!(y < this.maxY && y > this.minY)) return undefined;
    if (x > this.minX - 2 && x < this.minX + 3) {
      return "left";
    } else if (x > this.maxX - 3 && x < this.maxX + 2) {
      return "right";
    }
  }

  toJSON(): NoteProps {
    return {
      id: this.id,
      startX: this.startX,
      startY: this.startY,
      endX: this.endX,
      endY: this.endY,
      isOverlap: this.isOverlap,
      noteLength: this.noteLength,
      lyrics: this.lyrics,
    };
  }
}
