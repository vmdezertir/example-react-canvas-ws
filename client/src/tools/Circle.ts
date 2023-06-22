import { EEventType, EFigureType, TCircleFigure } from 'types';
import Tool from './Tool';

export class Circle extends Tool {
  startX: number;
  startY: number;
  radius: number;
  savedImg?: string;

  constructor(canvas: HTMLCanvasElement, socket: WebSocket | null, id: string) {
    super(canvas, socket, id, EFigureType.CIRCLE);
    this.listen();
    this.startX = 0;
    this.startY = 0;
    this.radius = 0;
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
          r: this.radius,
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
    const width = currentX - this.startX;
    const height = currentY - this.startY;

    const r = Math.sqrt(width ** 2 + height ** 2);
    this.radius = r;

    this.draw(this.startX, this.startY, r);
  }

  draw(x: number, y: number, r: number) {
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
      this.ctx?.arc(x, y, r, 0, 2 * Math.PI);
      this.ctx?.stroke();
    };
  }

  static staticDraw(ctx: CanvasRenderingContext2D, { x, y, r, color, borderWidth }: TCircleFigure) {
    ctx?.beginPath();
    ctx?.arc(x, y, r, 0, 2 * Math.PI);
    ctx?.stroke();
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = borderWidth;
    }
  }
}
