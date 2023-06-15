import { useCallback, useEffect, useState, MouseEvent } from 'react';

import { ToolVariant } from 'tools/interface';
import { Brush, Circle, Cursor, Eraser, Line, Pencil, Square } from 'tools';
import { useCanvasStore, useToolStore } from 'store';

export const useActions = (canvas: HTMLCanvasElement | null) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isCanvas: false });

  const setCanvas = useCanvasStore(state => state.setCanvas);
  const { toolName, clearTool, setTool, tool, color, lineWidth } = useToolStore(state => ({
    tool: state.tool,
    toolName: state.toolName,
    clearTool: state.clearTool,
    setTool: state.setTool,
    color: state.color,
    lineWidth: state.size,
  }));

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
        tool = new Brush(canvas);
        break;
      case ToolVariant.LINE:
        tool = new Line(canvas);
        break;
      case ToolVariant.ERASER:
        tool = new Eraser(canvas);
        break;
      case ToolVariant.PENCIL:
        tool = new Pencil(canvas);
        break;
      case ToolVariant.CIRCLE:
        tool = new Circle(canvas);
        break;
      case ToolVariant.SQUARE:
        tool = new Square(canvas);
        break;
      case ToolVariant.CURSOR:
      default:
        tool = new Cursor(canvas);
    }

    setTool(tool);
  }, [toolName, setTool, canvas]);

  const mouseMoveHandler = useCallback(
    (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY, isCanvas: true }),
    [setMousePos],
  );

  const mouseHandler = useCallback((isCanvas: boolean) => setMousePos(prev => ({ ...prev, isCanvas })), [setMousePos]);

  return {
    mousePos,
    mouseMoveHandler,
    mouseHandler,
  };
};
