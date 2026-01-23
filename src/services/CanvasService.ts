import { CanvasData } from '../data/CanvasData'
import { Stroke } from './types'

class CanvasService {
  addStroke(canvas: CanvasData, stroke: Stroke): void {
    canvas.strokes.push(stroke)
  }

  clearCanvas(canvas: CanvasData): void {
    canvas.strokes = []
  }
}

const canvasService = new CanvasService()

export { canvasService }
