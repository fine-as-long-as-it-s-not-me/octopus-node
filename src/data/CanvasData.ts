import { Stroke } from './types'

class CanvasData {
  static nextId = 1

  id: number
  strokes: Stroke[]
  backgroundColor: string

  constructor() {
    this.id = CanvasData.nextId++
    this.strokes = []
    this.backgroundColor = '#FFFFFF'
  }
}

export { CanvasData }
