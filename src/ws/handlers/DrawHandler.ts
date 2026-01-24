import { SubTypeHandlerMap } from '../types'

type StrokeStartHandler = {
  strokeId: string
  tool: string
  color: string
  width: number
}

type StrokeAddHandler = {
  strokeId: string
  points: Array<{ x: number; y: number }>
}

type StrokeEndHandler = {
  strokeId: string
}

type CanvasBackgroundHandler = {
  canvasColor: string
}

type DrawHandlerHandlerMap = {
  start: StrokeStartHandler
  add: StrokeAddHandler
  end: StrokeEndHandler
  background: CanvasBackgroundHandler
}

export const drawHandlers: SubTypeHandlerMap<DrawHandlerHandlerMap> = {
  start(socket, data: StrokeStartHandler) {
    // 그리기 시작
  },
  add(socket, data: StrokeAddHandler) {
    // stroke 추가
  },
  end(socket, data: StrokeEndHandler) {
    // 그림 끝
  },
  background(socket, data: CanvasBackgroundHandler) {
    // 배경색 변경
  },
}
