import { create } from 'zustand';

import { ToolVariant } from 'tools/interface';
import { Color } from 'antd/es/color-picker';
import Tool from 'tools/Tool';

interface CanvasState {
  canvasRef: HTMLCanvasElement | null;
  setCanvas: (canvas: HTMLCanvasElement | null) => void;
  socket: WebSocket | null;
  meetId: string | null;
  setSocket: (socket: WebSocket) => void;
  setMeetId: (meetId: string | null) => void;
}

export const useCanvasStore = create<CanvasState>(set => ({
  canvasRef: null,
  socket: null,
  meetId: null,
  setCanvas: canvas => set(_ => ({ canvasRef: canvas })),
  setSocket: socket => set(_ => ({ socket })),
  setMeetId: meetId => set(_ => ({ meetId })),
}));

interface ToolState {
  size: number;
  toolName: ToolVariant;
  color: string;
  setSize: (size: number) => void;
  setToolName: (name: ToolVariant) => void;
  setColor: (color: Color) => void;
  undoList: string[];
  redoList: string[];
  addToUndo: (item: string) => void;
  addToRedo: (item: string) => void;
  removeFromUndo: () => void;
  removeFromRedo: () => void;
  clearTool: () => void;
  tool: Tool | null;
  setTool: (tool: Tool) => void;
}

export const useToolStore = create<ToolState>(set => ({
  tool: null,
  size: 1,
  toolName: ToolVariant.CURSOR,
  color: '#000',
  undoList: [],
  redoList: [],
  setTool: (tool: Tool) => set(_ => ({ tool })),
  setSize: (size: number) => set(_ => ({ size })),
  setToolName: (toolName: ToolVariant) => set(_ => ({ toolName })),
  setColor: (color: Color) => set(_ => ({ color: color.toHexString() })),
  addToUndo: (item: string) =>
    set(state => {
      let undoList = [...state.undoList, item];
      if (undoList.length > 10) {
        undoList = undoList.slice(1);
      }

      return { undoList };
    }),
  addToRedo: (item: string) =>
    set(state => {
      let redoList = [...state.redoList, item];
      if (redoList.length > 10) {
        redoList = redoList.slice(1);
      }

      return { redoList };
    }),
  removeFromUndo: () => set(state => ({ undoList: [...state.undoList.slice(0, state.undoList.length - 1)] })),
  removeFromRedo: () => set(state => ({ redoList: [...state.redoList.slice(0, state.redoList.length - 1)] })),
  clearTool: () => set(state => ({ color: '#000', toolName: ToolVariant.CURSOR, size: 1, undoList: [], redoList: [] })),
}));

interface UserState {
  userName: string;
  setUserName: (userName: string) => void;
  isOpenModal: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useUserStore = create<UserState>(set => ({
  userName: '',
  isOpenModal: false,
  setUserName: userName => set(_ => ({ userName })),
  openModal: () => set(_ => ({ isOpenModal: true })),
  closeModal: () => set(_ => ({ isOpenModal: false })),
}));
