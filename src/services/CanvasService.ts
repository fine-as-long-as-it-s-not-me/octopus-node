import { Stroke } from './types'

class Canvas {
  strokes: Stroke[]
  backgroundColor: string

  constructor() {
    this.strokes = []
    this.backgroundColor = '#FFFFFF'
  }

  addStroke(stroke: Stroke): void {
    this.strokes.push(stroke)
  }

  clearCanvas(): void {
    this.strokes = []
  }
}
