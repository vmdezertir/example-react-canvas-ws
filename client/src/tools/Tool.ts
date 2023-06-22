import { EFigureType } from 'types';

class Tool {
  canvas: HTMLCanvasElement;
  socket: WebSocket | null;
  id: string;
  ctx: CanvasRenderingContext2D | null;
  name: EFigureType;
  mouseDown: boolean;

  constructor(canvas: HTMLCanvasElement, socket: WebSocket | null, id: string, name: EFigureType) {
    this.canvas = canvas;
    this.name = name;
    this.socket = socket;
    this.id = id;
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
