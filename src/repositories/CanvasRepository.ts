import { CanvasData } from '../data/CanvasData'
import { canvasService } from '../services/CanvasService'
import { BaseRepository } from './BaseRepository'

class CanvasRepository extends BaseRepository<CanvasData> {}

const canvasRepository = new CanvasRepository('canvases')

export { canvasRepository }
