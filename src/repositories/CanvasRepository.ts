import { CanvasData } from '../data/CanvasData'
import { BaseRepository } from './BaseRepository'

class CanvasRepository extends BaseRepository<CanvasData> {}

const canvasRepository = new CanvasRepository('canvases')

export { canvasRepository }
