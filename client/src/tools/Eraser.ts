import { EFigureType, TBrushFigure } from 'types';
import { Brush } from './Brush';

export class Eraser extends Brush {
  constructor(canvas: HTMLCanvasElement, socket: WebSocket | null, id: string) {
    super(canvas, socket, id, EFigureType.ERASER);
  }

  static draw(ctx: CanvasRenderingContext2D, figure: TBrushFigure) {
    super.draw(ctx, { ...figure, color: 'white' });
  }
}
