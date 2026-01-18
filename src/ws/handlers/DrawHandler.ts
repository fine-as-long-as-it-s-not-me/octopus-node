import { SubTypeHandlerMap } from '../types'

type StrokeStartData = {
  strokeId: string
  tool: string
  color: string
  width: number
}

type StrokeAddData = {
  strokeId: string
  points: Array<{ x: number; y: number }>
}

type StrokeEndData = {
  strokeId: string
}

type CanvasBackgroundData = {
  bgColor: string
}

type DrawHandlerDataMap = {
  start: StrokeStartData
  add: StrokeAddData
  end: StrokeEndData
  background: CanvasBackgroundData
}

export const drawHandlers: SubTypeHandlerMap<DrawHandlerDataMap> = {
  start(socket, data: StrokeStartData) {
    // 그리기 시작
  },
  add(socket, data: StrokeAddData) {
    // stroke 추가
  },
  end(socket, data: StrokeEndData) {
    // 그림 끝
  },
  background(socket, data: CanvasBackgroundData) {
    // 배경색 변경
  },
}
