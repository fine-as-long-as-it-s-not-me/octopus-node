import { WebSocket } from 'ws'
import { CanvasData } from '../data/CanvasData'
import { Stroke } from '../data/types'
import { canvasRepository } from '../repositories/CanvasRepository'
import { playerRepository } from '../repositories/PlayerRepository'
import { roomRepository } from '../repositories/RoomRepository'
import { RoomData } from '../data/RoomData'
import { roomService } from './RoomService'

class CanvasService {
  addStroke(socket: WebSocket, stroke: Stroke): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) return

    const roomId = player.roomId
    if (!roomId) return

    const room = roomRepository.findById(roomId)
    if (!room) return

    const game = room.game
    if (!game || game.painterId !== player.id) return console.log('Not allowed to draw')

    if (!game.canvasId) return console.log('Canvas ID not found in game')

    const canvas = canvasRepository.findById(game.canvasId)
    if (!canvas) return console.log('Canvas not found')

    canvasRepository.update(canvas.id, { ...canvas, strokes: [...canvas.strokes, stroke] })
    this.updateCanvas(room, canvas)
  }

  updateCanvas(room: RoomData, canvas: CanvasData): void {
    roomService.sendMessage(room, 'canvas_updated', {
      strokes: canvas.strokes,
      bgColor: canvas.bgColor,
    })
  }

  clearCanvas(canvas: CanvasData): void {
    canvas.strokes = []
  }
}

const canvasService = new CanvasService()

export { canvasService }
