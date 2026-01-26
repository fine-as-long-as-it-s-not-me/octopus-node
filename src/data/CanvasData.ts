import { Stroke } from './types'

class CanvasData {
  static nextId = 1

  id: number
  gameId: number
  strokes: Stroke[]
  bgColor: string

  constructor(gameId: number) {
    this.id = CanvasData.nextId++
    this.gameId = gameId
    this.strokes = []
    this.bgColor = '#FFFFFF'
  }
}

export { CanvasData }
