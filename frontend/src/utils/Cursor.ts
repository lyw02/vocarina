export const cursorStyle = {
  color: "red",
  lineWidth: 1,
} as const;

export class Cursor {
  x: number;
  startY: number;
  endY: number;
  private static instance: Cursor;

  constructor(x: number, endY: number) {
    this.x = x;
    this.startY = 0;
    this.endY = endY;
  }

  public static getInstance(x: number, endY: number): Cursor {
    if (!Cursor.instance) {
      Cursor.instance = new Cursor(x, endY);
    }
    return Cursor.instance;
}

  set (x: number) {
    this.x = x;
  }

  drawCursor(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.startY);
    ctx.lineTo(this.x, this.endY);
    ctx.strokeStyle = cursorStyle.color;
    ctx.lineWidth = cursorStyle.lineWidth;
    ctx.stroke();
  }
}
