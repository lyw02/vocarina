export const dragSelectorStyle = {
  color: "#ffbbd6c2",
} as const;

export class DragSelector {
  startX: number;
  startY: number;
  endX: number;
  endY: number;

  constructor(startX: number, startY: number) {
    this.startX = startX;
    this.startY = startY;
    this.endX = startX;
    this.endY = startY;
  }

  get minX() {
    return Math.min(this.startX, this.endX);
  }
  get maxX() {
    return Math.max(this.startX, this.endX);
  }
  get minY() {
    return Math.min(this.startY, this.endY);
  }
  get maxY() {
    return Math.max(this.startY, this.endY);
  }

  get midX() {
    return (this.startX + this.endX) / 2;
  }
  get midY() {
    return (this.startY + this.endY) / 2;
  }

  get width() {
    return Math.abs(this.startX - this.endX);
  }
  get height() {
    return Math.abs(this.startY - this.endY);
  }

  drawSelector(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.minX, this.minY);
    ctx.lineTo(this.maxX, this.minY);
    ctx.lineTo(this.maxX, this.maxY);
    ctx.lineTo(this.minX, this.maxY);
    ctx.lineTo(this.minX, this.minY);
    ctx.fillStyle = dragSelectorStyle.color
    ctx.fill();
  }
}
