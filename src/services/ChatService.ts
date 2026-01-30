import { WebSocket } from 'ws'
import { sendSocketMessage } from '../lib/socket'
import { playerRepository } from '../repositories/PlayerRepository'
import { roomRepository } from '../repositories/RoomRepository'
import { roomService } from './RoomService'
import { PLAYER_NOT_FOUND_ERROR, PLAYER_NOT_IN_ROOM_ERROR } from '../errors/player'
import { ROOM_NOT_FOUND_ERROR } from '../errors/room'

class ChatService {
  addChatMessage(socket: WebSocket, text: string): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) {
      sendSocketMessage(socket, 'error')
      throw PLAYER_NOT_FOUND_ERROR
    }
    if (!player.roomId) {
      sendSocketMessage(socket, 'error')
      throw PLAYER_NOT_IN_ROOM_ERROR
    }

    const room = roomRepository.findById(player.roomId)
    if (!room) {
      sendSocketMessage(socket, 'error')
      throw ROOM_NOT_FOUND_ERROR
    }

    roomService.sendMessage(room, 'chat_added', {
      player: playerRepository.getResponseDTO(player.id),
      text,
    })
  }

  addSystemChatMessage(roomId: number, type: string, variable?: object): void {
    const room = roomRepository.findById(roomId)
    if (!room) return

    roomService.sendMessage(room, 'system_chat', {
      type,
      variable,
    })
  }
}

const chatService = new ChatService()

export { chatService }
