import { EEventType, EFigureType, TBrushFigure } from 'types';
import Tool from './Tool';

export class Brush extends Tool {
  constructor(canvas: HTMLCanvasElement, socket: WebSocket | null, id: string, name = EFigureType.BRUSH) {
    super(canvas, socket, id, name);
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
    this.ctx?.moveTo(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
  }

  mouseUpHandler(e: MouseEvent) {
    super.mouseUpHandler(e);

    this.socket?.send(
      JSON.stringify({
        eventType: EEventType.DRAW,
        room: this.id,
        figure: {
          type: EFigureType.FINISH,
        },
      }),
    );
  }

  mouseMoveHandler(e: MouseEvent) {
    if (!this.mouseDown) {
      return;
    }

    const target = e.target as HTMLCanvasElement;

    this.socket?.send(
      JSON.stringify({
        eventType: EEventType.DRAW,
        room: this.id,
        figure: {
          type: this.name,
          x: e.pageX - target.offsetLeft,
          y: e.pageY - target.offsetTop,
          color: this.ctx?.strokeStyle,
          borderWidth: this.ctx?.lineWidth,
        },
      }),
    );
  }

  static draw(ctx: CanvasRenderingContext2D, { x, y, color, borderWidth }: TBrushFigure) {
    ctx?.lineTo(x, y);
    ctx?.stroke();
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = borderWidth;
    }
  }
}
