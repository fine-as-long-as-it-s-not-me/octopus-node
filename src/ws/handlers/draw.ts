import { SubTypeHandlerMap } from '../types'

type StrokeStartData = {
  type: 'stroke_start'
  strokeId: string
  tool: string
  color: string
  timestamp: number
}

type StrokeEndData = {
  type: 'stroke_end'
  strokeId: string
  timestamp: number
}

type EraseStartData = {
  type: 'stroke_start'
  strokeId: string
  tool: 'erase'
  timestamp: number
}

type EraseEndData = StrokeEndData

type CanvasBackgroundData = {
  type: 'canvas_set_background'
  bgColor: string
  version: number
  timestamp: number
}

type DrawHandlerDataMap = {
  start: StrokeStartData
  end: StrokeEndData
  erase_start: EraseStartData
  erase_end: EraseEndData
  background: CanvasBackgroundData
}

export const drawHandlers: SubTypeHandlerMap<DrawHandlerDataMap> = {
  start(socket, data: StrokeStartData) {
    // 그리기 시작
  },
  end(socket, data: StrokeEndData) {
    // 그림 끝
  },
  erase_start(socket, data: EraseStartData) {
    // 지우기 시작
  },
  erase_end(socket, data: EraseEndData) {
    // 지우기 끝
  },
  background(socket, data: CanvasBackgroundData) {
    // 배경색 변경
  },
}
