import { WebSocket } from 'ws'
import { CanvasData } from '../data/CanvasData'
import { Stroke } from '../data/types'
import { canvasRepository } from '../repositories/CanvasRepository'
import { playerRepository } from '../repositories/PlayerRepository'
import { roomRepository } from '../repositories/RoomRepository'
import { RoomData } from '../data/RoomData'
import { roomService } from './RoomService'
import { CANVAS_NOT_ALLOWED_ERROR, CANVAS_NOT_FOUND_ERROR } from '../errors/canvas'
import { GAME_NOT_FOUND_ERROR } from '../errors/game'
import { PLAYER_NOT_FOUND_ERROR, PLAYER_NOT_IN_ROOM_ERROR } from '../errors/player'
import { ROOM_NOT_FOUND_ERROR } from '../errors/room'

class CanvasService {
  addStroke(socket: WebSocket, stroke: Stroke): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) throw PLAYER_NOT_FOUND_ERROR

    const roomId = player.roomId
    if (!roomId) throw PLAYER_NOT_IN_ROOM_ERROR

    const room = roomRepository.findById(roomId)
    if (!room) throw ROOM_NOT_FOUND_ERROR

    const game = room.game
    if (!game) throw GAME_NOT_FOUND_ERROR
    if (game.painterId !== player.id) throw CANVAS_NOT_ALLOWED_ERROR

    if (!game.canvasId) throw CANVAS_NOT_FOUND_ERROR

    const canvas = canvasRepository.findById(game.canvasId)
    if (!canvas) throw CANVAS_NOT_FOUND_ERROR

    canvasRepository.update(canvas.id, { ...canvas, strokes: [...canvas.strokes, stroke] })
    const updatedCanvas = canvasRepository.findById(canvas.id)
    if (!updatedCanvas) throw CANVAS_NOT_FOUND_ERROR
    this.updateCanvas(room, updatedCanvas)
  }

  changeBackground(socket: WebSocket, color: string): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) throw PLAYER_NOT_FOUND_ERROR

    const roomId = player.roomId
    if (!roomId) throw PLAYER_NOT_IN_ROOM_ERROR

    const room = roomRepository.findById(roomId)
    if (!room) throw ROOM_NOT_FOUND_ERROR

    const game = room.game
    if (!game) throw GAME_NOT_FOUND_ERROR
    if (game.painterId !== player.id) throw CANVAS_NOT_ALLOWED_ERROR

    if (!game.canvasId) throw CANVAS_NOT_FOUND_ERROR

    canvasRepository.update(game.canvasId, { bgColor: color })

    const canvas = canvasRepository.findById(game.canvasId)
    if (!canvas) throw CANVAS_NOT_FOUND_ERROR
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
