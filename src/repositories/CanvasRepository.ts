import { CanvasData } from '../data/CanvasData'
import { canvasService } from '../services/CanvasService'
import { BaseRepository } from './BaseRepository'

class CanvasRepository extends BaseRepository<CanvasData> {
  create({ gameId }: Pick<CanvasData, 'gameId'>): CanvasData {
    const canvas = new CanvasData(gameId)
    this.records.set(canvas.id, canvas)
    const res = this.records.get(canvas.id)
    if (res === undefined) {
      throw new Error(`Failed to create record in ${this.tableName}`)
    }
    return res
  }
}

const canvasRepository = new CanvasRepository('canvases')

export { canvasRepository }
