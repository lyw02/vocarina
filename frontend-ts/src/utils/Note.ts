export const noteStyle = {
  color: "#ff8fab",
  overlapColor: "#ffe5ec",
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

export class Note {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isOverlap: boolean;
  noteLength: number;
  lyrics: string;

  constructor(id: number, startX: number, startY: number) {
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

  drawNote(ctx: CanvasRenderingContext2D) {
    this.noteLength = Math.abs(this.minX - this.maxX);
    ctx.beginPath();
    ctx.moveTo(this.minX, this.minY);
    ctx.lineTo(this.maxX, this.minY);
    ctx.lineTo(this.maxX, this.maxY);
    ctx.lineTo(this.minX, this.maxY);
    ctx.lineTo(this.minX, this.minY);
    this.isOverlap
      ? (ctx.fillStyle = noteStyle.overlapColor)
      : (ctx.fillStyle = noteStyle.color);
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
}
