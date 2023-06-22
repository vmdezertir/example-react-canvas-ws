import { EEventType, EFigureType, TLineFigure } from 'types';
import Tool from './Tool';

export class Line extends Tool {
  currentX: number;
  currentY: number;
  savedImg?: string;

  constructor(canvas: HTMLCanvasElement, socket: WebSocket | null, id: string) {
    super(canvas, socket, id, EFigureType.LINE);
    this.listen();
    this.currentX = 0;
    this.currentY = 0;
  }

  listen() {
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
  }
  mouseDownHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;
    super.mouseDownHandler(e);
    this.currentX = e.pageX - target.offsetLeft;
    this.currentY = e.pageY - target.offsetTop;
    this.ctx?.moveTo(this.currentX, this.currentY);
    this.savedImg = this.canvas.toDataURL();
  }

  mouseUpHandler(e: MouseEvent) {
    super.mouseUpHandler(e);

    const target = e.target as HTMLCanvasElement;
    this.socket?.send(
      JSON.stringify({
        eventType: EEventType.DRAW,
        room: this.id,
        figure: {
          type: this.name,
          cX: this.currentX,
          cY: this.currentY,
          x: e.pageX - target.offsetLeft,
          y: e.pageY - target.offsetTop,
          color: this.ctx?.strokeStyle,
          borderWidth: this.ctx?.lineWidth,
        },
      }),
    );
  }

  mouseMoveHandler(e: MouseEvent) {
    if (!this.mouseDown) {
      return;
    }

    const target = e.target as HTMLCanvasElement;
    this.draw(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
  }

  draw(x: number, y: number) {
    if (!this.savedImg) {
      return;
    }

    const img = new Image();
    img.src = this.savedImg;
    img.onload = async () => {
      const { width, height } = this.canvas;
      this.ctx?.clearRect(0, 0, width, height);
      this.ctx?.drawImage(img, 0, 0, width, height);
      this.ctx?.beginPath();
      this.ctx?.moveTo(this.currentX, this.currentY);
      this.ctx?.lineTo(x, y);
      this.ctx?.stroke();
    };
  }

  static staticDraw(ctx: CanvasRenderingContext2D, { cX, cY, x, y, color, borderWidth }: TLineFigure) {
    ctx?.beginPath();
    ctx?.moveTo(cX, cY);
    ctx?.lineTo(x, y);
    ctx?.stroke();
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = borderWidth;
    }
  }
}
