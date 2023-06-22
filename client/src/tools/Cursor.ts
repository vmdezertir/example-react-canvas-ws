import { EFigureType } from 'types';
import Tool from './Tool';

export class Cursor extends Tool {
  constructor(canvas: HTMLCanvasElement, socket: WebSocket | null, id: string) {
    super(canvas, socket, id, EFigureType.CURSOR);
  }
}
