import Tool from './Tool';

export class Pencil extends Tool {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas, 'Pencil');
    this.listen();
    this.setConfig();
  }

  setConfig() {
    if (this.ctx) {
      this.ctx.lineCap = 'round';
      this.ctx.lineWidth = 5;
    }
  }

  listen() {
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
  }

  mouseDownHandler(e: MouseEvent) {
    super.mouseDownHandler(e);
    const target = e.target as HTMLCanvasElement;
    this.ctx?.moveTo(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
  }

  mouseUpHandler(e: MouseEvent) {
    super.mouseUpHandler(e);
  }

  mouseMoveHandler(e: MouseEvent) {
    if (!this.mouseDown) {
      return;
    }

    const target = e.target as HTMLCanvasElement;
    this.draw(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
  }

  draw(x: number, y: number) {
    this.ctx?.lineTo(x, y);
    this.ctx?.stroke();
  }
}
