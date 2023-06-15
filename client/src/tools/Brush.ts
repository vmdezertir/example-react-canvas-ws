import Tool from './Tool';

export class Brush extends Tool {
  constructor(canvas: HTMLCanvasElement, name = 'Brush') {
    super(canvas, name);
    this.listen();
  }

  listen() {
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
  }

  mouseDownHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;
    super.mouseDownHandler(e);
    this.draw(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
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
