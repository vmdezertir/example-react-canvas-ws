import { Brush } from './Brush';

export class Eraser extends Brush {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas, 'Eraser');
  }

  draw(x: number, y: number) {
    if (this.ctx) {
      this.ctx.strokeStyle = 'white';
    }

    super.draw(x, y);
  }
}
