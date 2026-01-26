import { Stroke } from '../../data/types'
import { canvasService } from '../../services/CanvasService'
import { SubTypeHandlerMap } from '../types'

type StrokeAddHandler = {
  stroke: Stroke
}

type CanvasBackgroundHandler = {
  color: string
}

type DrawHandlerHandlerMap = {
  add: StrokeAddHandler
  background: CanvasBackgroundHandler
}

export const drawHandlers: SubTypeHandlerMap<DrawHandlerHandlerMap> = {
  add(socket, data: StrokeAddHandler) {
    const { stroke } = data
    canvasService.addStroke(socket, stroke)
  },
  background(socket, data: CanvasBackgroundHandler) {
    // 배경색 변경
    const { color } = data
    canvasService.changeBackground(socket, color)
  },
}
