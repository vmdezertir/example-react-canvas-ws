export enum EEventType {
  CONNECT = 'connection',
  DRAW = 'draw',
  CLEAR = 'clear',
}

export enum EFigureType {
  CURSOR = 'cursor',
  BRUSH = 'brush',
  SQUARE = 'square',
  CIRCLE = 'circle',
  ERASER = 'eraser',
  LINE = 'line',
  FINISH = 'finish',
  TEXT = 'text',
}

type TFinishFigure = {
  type: EFigureType.FINISH;
};

export type TBaseFigure = {
  x: number;
  y: number;
  color: string;
  borderWidth: number;
};

export type TBrushFigure = TBaseFigure & {
  type: EFigureType.BRUSH;
};

export type TEraserFigure = TBaseFigure & {
  type: EFigureType.ERASER;
};

export type TSquareFigure = TBaseFigure & {
  type: EFigureType.SQUARE;
  width: number;
  height: number;
};

export type TCircleFigure = TBaseFigure & {
  type: EFigureType.CIRCLE;
  r: number;
};

export type TLineFigure = TBaseFigure & {
  type: EFigureType.LINE;
  cX: number;
  cY: number;
};

export interface IMessage {
  eventType: EEventType;
  room: string;
  participant: string;
  notification?: string;
  figure?: TFinishFigure | TBrushFigure | TEraserFigure | TSquareFigure | TCircleFigure | TLineFigure;
}
