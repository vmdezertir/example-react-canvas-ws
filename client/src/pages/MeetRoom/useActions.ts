import { MouseEvent, useCallback, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { ToolVariant } from 'tools/interface';
import { EEventType, EFigureType, IMessage, TBrushFigure } from 'types';
import { Brush, Circle, Cursor, Eraser, Line, Square } from 'tools';
import { useCanvasStore, useToolStore } from 'store';

type TUseActionsProps = {
  canvas: HTMLCanvasElement | null;
  userName: string;
  messageApi: any;
};

export const useActions = ({ canvas, userName, messageApi }: TUseActionsProps) => {
  const { meetId = '' } = useParams();
  const [mousePos, setMousePos] = useState<{ x: number; y: number; isCanvas: boolean }>({
    x: 0,
    y: 0,
    isCanvas: false,
  });
  const connection = useRef(false);

  const { setCanvas, setSocket, setMeetId, socket: ws } = useCanvasStore(state => state);
  const { toolName, clearTool, setTool, tool, color, size: lineWidth, addToUndo } = useToolStore(state => state);

  useEffect(() => {
    canvas && setCanvas(canvas);

    return () => clearTool();
  }, [setCanvas, clearTool, canvas]);

  useEffect(() => {
    if (!tool) {
      return;
    }

    tool.strokeColor = color as string;
    tool.lineWidth = lineWidth;
  }, [tool, color, lineWidth]);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    let tool;

    switch (toolName) {
      case ToolVariant.BRUSH:
        tool = new Brush(canvas, ws, meetId);
        break;
      case ToolVariant.LINE:
        tool = new Line(canvas, ws, meetId);
        break;
      case ToolVariant.ERASER:
        tool = new Eraser(canvas, ws, meetId);
        break;
      case ToolVariant.CIRCLE:
        tool = new Circle(canvas, ws, meetId);
        break;
      case ToolVariant.SQUARE:
        tool = new Square(canvas, ws, meetId);
        break;
      case ToolVariant.CURSOR:
      default:
        tool = new Cursor(canvas, ws, meetId);
    }

    setTool(tool);
  }, [toolName, setTool, canvas, ws, meetId]);

  const mouseMoveHandler = useCallback(
    (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY, isCanvas: true }),
    [setMousePos],
  );

  const mouseHandler = useCallback((isCanvas: boolean) => setMousePos(prev => ({ ...prev, isCanvas })), [setMousePos]);

  const drawHandler = (message: IMessage) => {
    const { figure } = message;
    const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
    switch (figure?.type) {
      case EFigureType.BRUSH:
        Brush.draw(ctx, figure);
        break;
      case EFigureType.ERASER:
        Eraser.draw(ctx, figure as unknown as TBrushFigure);
        break;
      case EFigureType.SQUARE:
        Square.staticDraw(ctx, figure);
        break;
      case EFigureType.CIRCLE:
        Circle.staticDraw(ctx, figure);
        break;
      case EFigureType.LINE:
        Line.staticDraw(ctx, figure);
        break;
      case EFigureType.FINISH:
        ctx.beginPath();
        break;
    }
  };

  const clearHandler = () => {
    if (!canvas) {
      return;
    }

    const ctx = canvas?.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const connect = useCallback(() => {
    if (connection.current) {
      return;
    }

    const socket = new WebSocket(`ws://localhost:8080/meet/${meetId}`);
    setSocket(socket);
    setMeetId(meetId || null);

    socket.onopen = () => {
      const message = {
        eventType: EEventType.CONNECT,
        participant: userName,
        room: meetId,
      };

      socket?.send(JSON.stringify(message));
      connection.current = true;
    };

    socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as IMessage;
      switch (message.eventType) {
        case EEventType.CONNECT:
          messageApi.success(message.notification);
          break;
        case EEventType.DRAW:
          drawHandler(message);
          break;
        case EEventType.CLEAR:
          clearHandler();
          messageApi.warning(message.notification);
          break;
      }
    };
  }, [meetId, userName, connection]);

  const mouseDownHandler = useCallback(() => {
    if (!canvas) {
      return;
    }
    const img = canvas?.toDataURL();
    addToUndo(img);
    axios.post(`http://localhost:8080/meet/${meetId}`, { screenImg: img });
  }, [canvas, meetId, addToUndo]);

  return {
    mousePos,
    mouseMoveHandler,
    mouseHandler,
    connect,
    mouseDownHandler,
  };
};
