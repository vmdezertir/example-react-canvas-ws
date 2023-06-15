class Tool {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  name: string;
  mouseDown: boolean;

  constructor(canvas: HTMLCanvasElement, name: string) {
    this.canvas = canvas;
    this.name = 'Brush';
    this.mouseDown = false;
    this.ctx = canvas.getContext('2d');
    this.destroyEvents();
  }

  set fillColor(color: string) {
    if (!this.ctx) {
      return;
    }

    this.ctx.fillStyle = color;
  }

  set strokeColor(color: string) {
    if (!this.ctx) {
      return;
    }

    this.ctx.strokeStyle = color;
  }

  set lineWidth(width: number) {
    if (!this.ctx) {
      return;
    }

    this.ctx.lineWidth = width;
  }

  destroyEvents() {
    this.canvas.onmousedown = null;
    this.canvas.onmousemove = null;
    this.canvas.onmouseup = null;
  }

  mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false;
  }

  mouseDownHandler(e: MouseEvent) {
    if (!e.target) {
      return;
    }

    this.mouseDown = true;
    this.ctx?.beginPath();
  }
}

export default Tool;
