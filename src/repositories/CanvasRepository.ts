import { CanvasData } from '../data/CanvasData'
import { CANVAS_CREATE_FAILED_ERROR } from '../errors/canvas'
import { BaseRepository } from './BaseRepository'

class CanvasRepository extends BaseRepository<CanvasData> {
  create({ gameId }: Pick<CanvasData, 'gameId'>): CanvasData {
    const canvas = new CanvasData(gameId)
    this.records.set(canvas.id, canvas)
    const res = this.records.get(canvas.id)
    if (res === undefined) {
      throw CANVAS_CREATE_FAILED_ERROR
    }
    return res
  }
}

const canvasRepository = new CanvasRepository('canvases')

export { canvasRepository }
