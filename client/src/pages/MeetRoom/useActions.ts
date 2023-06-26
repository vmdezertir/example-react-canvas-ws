import { MouseEvent, useCallback, useEffect, useState, useRef, MutableRefObject } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { ToolVariant } from 'tools/interface';
import { EEventType, EFigureType, IMessage, TBrushFigure } from 'types';
import { Brush, Circle, Cursor, Eraser, Line, Square } from 'tools';
import { useCanvasStore, useToolStore, useUserStore } from 'store';
import { useMutation } from '@tanstack/react-query';

const { REACT_APP_API_PATH: API_PATH, REACT_APP_SOCKET_PATH: SOCKET_PATH } = process.env;

type TUseActionsProps = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  messageApi: any;
  setReady: (v: boolean) => void;
};

const checkMeet = async (meetId: string) => {
  const response = await axios.get(`${API_PATH}/meet/${meetId}`);
  return response.data;
};
const getMeetImage = async (meetId: string) => {
  const response = await axios.get(`${API_PATH}/meet/image/${meetId}`);
  return response.data;
};

export const useActions = ({ canvasRef, messageApi, setReady }: TUseActionsProps) => {
  const canvas = canvasRef.current;
  const navigate = useNavigate();
  const { meetId = '' } = useParams();
  const [mousePos, setMousePos] = useState<{ x: number; y: number; isCanvas: boolean }>({
    x: 0,
    y: 0,
    isCanvas: false,
  });
  const connection = useRef(false);

  const [setCanvas, setSocket, setMeetId, ws] = useCanvasStore(state => [
    state.setCanvas,
    state.setSocket,
    state.setMeetId,
    state.socket,
  ]);
  const [toolName, clearTool, setTool, tool, color, lineWidth, addToUndo] = useToolStore(state => [
    state.toolName,
    state.clearTool,
    state.setTool,
    state.tool,
    state.color,
    state.size,
    state.addToUndo,
  ]);
  const [userName, openModal] = useUserStore(state => [state.userName, state.openModal]);

  useEffect(() => {
    canvas && setCanvas(canvas);
  }, [setCanvas, canvas]);

  useEffect(
    () => () => {
      clearTool();
      ws?.close();
    },
    [],
  );

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
        ctx && ctx.beginPath();
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

    const socket = new WebSocket(`${SOCKET_PATH}/connect/${meetId}`);
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
  }, [meetId, userName, connection, canvas]);

  const navigateToMain = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const mouseDownHandler = useCallback(() => {
    if (!canvas) {
      return;
    }
    const img = canvas?.toDataURL();
    addToUndo(img);
    axios.post(`${API_PATH}/meet/image/${meetId}`, { screenImg: img });
  }, [canvas, meetId, addToUndo]);

  const checkMeetMutation = useMutation(checkMeet, {
    mutationKey: ['checkMeet', meetId],
    onSuccess: () => {
      if (userName) {
        setReady(true);
      } else {
        openModal();
      }
    },
    onError: navigateToMain,
  });

  const getImageMutation = useMutation(getMeetImage, {
    mutationKey: ['printscreen', meetId],
    onSuccess: data => {
      if (!canvasRef.current || !data) {
        return null;
      }
      const { width, height } = canvasRef.current;
      const ctx = canvasRef.current.getContext('2d');
      const img = new Image();
      img.src = data;
      img.onload = async () => {
        ctx?.clearRect(0, 0, width, height);
        ctx?.drawImage(img, 0, 0, width, height);
        ctx?.stroke();
      };
    },
  });

  const submitUserModal = useCallback(() => {
    setReady(true);
  }, [setReady]);

  return {
    mousePos,
    mouseMoveHandler,
    mouseHandler,
    connect,
    mouseDownHandler,
    getImageMutation,
    checkMeetMutation,
    navigateToMain,
    submitUserModal,
  };
};
