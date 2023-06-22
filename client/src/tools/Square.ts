import { EEventType, EFigureType, TSquareFigure } from 'types';
import Tool from './Tool';

export class Square extends Tool {
  startX: number;
  startY: number;
  width: number;
  height: number;
  savedImg?: string;

  constructor(canvas: HTMLCanvasElement, socket: WebSocket | null, id: string) {
    super(canvas, socket, id, EFigureType.SQUARE);
    this.listen();
    this.startX = 0;
    this.startY = 0;
    this.width = 0;
    this.height = 0;
  }

  listen() {
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
  }
  mouseDownHandler(e: MouseEvent) {
    super.mouseDownHandler(e);

    const target = e.target as HTMLCanvasElement;
    this.startX = e.pageX - target.offsetLeft;
    this.startY = e.pageY - target.offsetTop;
    this.savedImg = this.canvas.toDataURL();
  }

  mouseUpHandler(e: MouseEvent) {
    super.mouseUpHandler(e);

    this.socket?.send(
      JSON.stringify({
        eventType: EEventType.DRAW,
        room: this.id,
        figure: {
          type: this.name,
          x: this.startX,
          y: this.startY,
          width: this.width,
          height: this.height,
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
    const currentX = e.pageX - target.offsetLeft;
    const currentY = e.pageY - target.offsetTop;
    this.width = currentX - this.startX;
    this.height = currentY - this.startY;

    this.draw(this.startX, this.startY, this.width, this.height);
  }

  draw(x: number, y: number, w: number, h: number) {
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
      this.ctx?.rect(x, y, w, h);
      this.ctx?.stroke();
    };
  }

  static staticDraw(ctx: CanvasRenderingContext2D, { x, y, width, height, color, borderWidth }: TSquareFigure) {
    ctx?.beginPath();
    ctx?.rect(x, y, width, height);
    ctx?.stroke();
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = borderWidth;
    }
  }
}
